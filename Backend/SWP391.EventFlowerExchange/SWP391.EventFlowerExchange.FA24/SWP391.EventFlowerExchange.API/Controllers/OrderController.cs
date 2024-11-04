using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SWP391.EventFlowerExchange.Application;
using SWP391.EventFlowerExchange.Domain.Entities;
using SWP391.EventFlowerExchange.Domain.ObjectValues;
using SWP391.EventFlowerExchange.Infrastructure;
using System.Collections.Generic;

namespace SWP391.EventFlowerExchange.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private IOrderService _service;
        private IVoucherService _voucherService;
        private IAccountService _accountService;
        private IDeliveryLogService _deliveryLogService;
        private ITransactionService _transactionService;
        private INotificationService _notificationService;
        private IProductService _productService;

        public OrderController(IOrderService service, IVoucherService voucherService, IAccountService accountService, IDeliveryLogService deliveryLogService, ITransactionService transactionService, INotificationService notificationService, IProductService productService)
        {
            _deliveryLogService = deliveryLogService;
            _accountService = accountService;
            _voucherService = voucherService;
            _service = service;
            _transactionService = transactionService;
            _notificationService = notificationService;
            _productService = productService;
        }

        [HttpGet("GetMonthlyOrderStatistics")]
        //[Authorize(Roles = ApplicationRoles.Manager)]
        public ActionResult<List<StatisticSystem>> GetMonthlyOrderStatistics()
        {
            var result = _service.GetMonthlyOrderStatisticsFromAPI();
            List<StatisticSystem> list = new List<StatisticSystem>();
            if (result != null)
            {
                foreach (var entry in result)
                {
                    StatisticSystem statisticSystem = new StatisticSystem()
                    {
                        Name = entry.Key,       // Key từ Dictionary
                        Total = entry.Value     // Value từ Dictionary
                    };
                    list.Add(statisticSystem);
                }
            }
            return list;
        }

        private async Task UpdateOrderStatusAutomaticAsync()
        {
            var deliveryList = await _deliveryLogService.ViewAllDeliveryLogFromAsync();
            for (int i = 0; i < deliveryList.Count; i++)
            {
                var order = await _service.SearchOrderByOrderIdFromAPIAsync(new Order() { OrderId = (int)deliveryList[i].OrderId });
                if (DateTime.Now > order.UpdateAt && order.UpdateAt != null)
                {
                    var transaction = await _transactionService.ViewAllTransactionByOrderIdFromAPIAsync(new Order() { OrderId = order.OrderId });
                    if (transaction.Count == 1)
                    {
                        await SendOrderPriceToSeller(order);

                        if (order.Status == "Fail")
                            await SendOrderPriceToBuyer(order);

                        await _service.UpdateOrderStatusFromAPIAsync(order);
                        break;
                    }

                }
            }
        }

        private async Task SendOrderPriceToSeller(Order order)
        {
            //Kiem tra phi ship
            var searchOrderItemList = await _service.ViewOrderDetailFromAPIAsync(order);
            List<int> productList = new List<int>();
            foreach (var item in searchOrderItemList)
            {
                productList.Add(item.ProductId);
            }
            var check = await _service.CheckFeeShipEventOrBatchFromAPIAsync(productList);

            //Lenh chuyen tien ve cho nguoi ban hang
            decimal? originPrice;
            if (check)
                originPrice = order.TotalPrice - _service.CheckFeeShipForOrderEvent(order.DeliveredAt);
            else
                originPrice = order.TotalPrice - _service.CheckFeeShipForOrderBatch(order.DeliveredAt);

            //Lay gia goc khong tinh giam gia
            if (order.VoucherId != null)
            {
                var voucher = await _voucherService.SearchVoucherByIdFromAPIAsync(new Voucher() { VoucherId = (int)order.VoucherId });
                originPrice /= (1 - voucher.DiscountValue);
            }

            //Cap nhat lai tien tra cho nguoi ban
            originPrice *= (decimal)0.9;

            var account = await _accountService.GetUserByIdFromAPIAsync(new Account() { Id = order.SellerId });
            account.Balance += originPrice;
            await _accountService.UpdateAccountFromAPIAsync(account);

            //Tru tien he thong
            var system = await _accountService.GetUserByEmailFromAPIAsync(new Account() { Email = "ManagerEVESystem@gmail.com" });
            system.Balance -= originPrice;
            await _accountService.UpdateAccountFromAPIAsync(system);

            var transactionCode = "EVE";
            while (true)
            {
                transactionCode = "EVE" + new Random().Next(100000, 999999).ToString();
                var result = await _transactionService.ViewTransactionByCodeFromAPIAsync(new Transaction() { TransactionCode = transactionCode });
                if (result == null)
                {
                    break;
                }

            }

            Transaction transaction = new Transaction()
            {
                TransactionCode = transactionCode,
                Amount = originPrice,
                CreatedAt = DateTime.Now,
                OrderId = order.OrderId,
                UserId = account.Id,
                TransactionType = 1,
                TransactionContent = $"Payment of orders {order.OrderId} to sellers",
                Status = false
            };
            await _transactionService.CreateTransactionFromAPIAsync(transaction);

            var accountSeller = await _accountService.GetUserByIdFromAPIAsync(new Account() { Id = order.SellerId });

            CreateNotification notificationSeller = new CreateNotification()
            {
                UserEmail = accountSeller.Email,
                Content = $"Order payment system for {accountSeller.Name}",
            };
            await _notificationService.CreateNotificationFromApiAsync(notificationSeller);
        }

        private async Task SendOrderPriceToBuyer(Order order)
        {
            var searchOrderItemList = await _service.ViewOrderDetailFromAPIAsync(order);
            List<int> productList = new List<int>();
            foreach (var item in searchOrderItemList)
            {
                productList.Add(item.ProductId);
            }

            decimal? originPrice = 0;
            if (order.DeliveryPersonId != null)
            {
                var check = await _service.CheckFeeShipEventOrBatchFromAPIAsync(productList);
                //Lenh chuyen tien ve cho nguoi mua hang chi tru tien ship
                if (check)
                    originPrice = order.TotalPrice - _service.CheckFeeShipForOrderEvent(order.DeliveredAt);
                else
                    originPrice = order.TotalPrice - _service.CheckFeeShipForOrderBatch(order.DeliveredAt);
            }
            else
            {
                originPrice = order.TotalPrice;
            }

            var account = await _accountService.GetUserByIdFromAPIAsync(new Account() { Id = order.BuyerId });
            account.Balance += (decimal)originPrice;
            await _accountService.UpdateAccountFromAPIAsync(account);

            //Tru tien he thong
            var system = await _accountService.GetUserByEmailFromAPIAsync(new Account() { Email = "ManagerEVESystem@gmail.com" });
            system.Balance -= (decimal)originPrice;
            await _accountService.UpdateAccountFromAPIAsync(system);

            //Tao giao dich
            var transactionCode = "EVE";
            while (true)
            {
                transactionCode = "EVE" + new Random().Next(100000, 999999).ToString();
                var result = await _transactionService.ViewTransactionByCodeFromAPIAsync(new Transaction() { TransactionCode = transactionCode });
                if (result == null)
                {
                    break;
                }
            }

            Transaction transaction = new Transaction()
            {
                TransactionCode = transactionCode,
                Amount = originPrice,
                CreatedAt = DateTime.Now,
                OrderId = order.OrderId,
                UserId = account.Id,
                TransactionType = 1,
                TransactionContent = $"Payment of orders {order.OrderId} to buyer",
                Status = false
            };
            await _transactionService.CreateTransactionFromAPIAsync(transaction);

            var accountBuyer = await _accountService.GetUserByIdFromAPIAsync(new Account() { Id = order.BuyerId });

            CreateNotification notificationBuyer = new CreateNotification()
            {
                UserEmail = accountBuyer.Email,
                Content = $"Order payment system for {accountBuyer.Name}",
            };
            await _notificationService.CreateNotificationFromApiAsync(notificationBuyer);
        }
    }
}

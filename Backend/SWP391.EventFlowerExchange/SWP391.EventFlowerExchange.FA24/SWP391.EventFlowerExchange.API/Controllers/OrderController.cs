using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SWP391.EventFlowerExchange.Application;
using SWP391.EventFlowerExchange.Domain.Entities;
using SWP391.EventFlowerExchange.Domain.ObjectValues;
using SWP391.EventFlowerExchange.Infrastructure;

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

        public OrderController(IOrderService service, IVoucherService voucherService, IAccountService accountService, IDeliveryLogService deliveryLogService, ITransactionService transactionService, INotificationService notificationService)
        {
            _deliveryLogService = deliveryLogService;
            _accountService = accountService;
            _voucherService = voucherService;
            _service = service;
            _transactionService = transactionService;
            _notificationService = notificationService;
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

        [HttpGet("ViewAllOrder")]
        //[Authorize(Roles = ApplicationRoles.Staff + "," + ApplicationRoles.Manager)]
        public async Task<IActionResult> ViewAllOrderAsync()
        {
            await UpdateOrderStatusAutomaticAsync();
            var list = await _service.ViewAllOrderFromAPIAsync();
            return Ok(list);
        }

        [HttpGet("ViewOrderDetail/{id}")]
        //[Authorize]
        public async Task<IActionResult> ViewOrderDetailFromAPIAsync(int id)
        {
            await UpdateOrderStatusAutomaticAsync();
            return Ok(await _service.ViewOrderDetailFromAPIAsync(new Order { OrderId = id }));
        }

        [HttpGet("ViewOrderByBuyerEmail")]
        //[Authorize(Roles = ApplicationRoles.Buyer)]
        public async Task<IActionResult> ViewOrderByBuyerIdAsync(string email)
        {

            var account = await _accountService.GetUserByEmailFromAPIAsync(new Account { Email = email });
            if (account != null)
            {
                return Ok(await _service.ViewOrderByBuyerIdFromAPIAsync(account));
            }
            return BadRequest("Not found!!!");
        }

        [HttpPost("CheckProductHasSameSeller")]
        //[Authorize(Roles = ApplicationRoles.Staff + "," + ApplicationRoles.Manager)]
        public async Task<ActionResult<bool>> CheckProductHasSameSellerAsync(List<int> productIdList)
        {
            return await _service.CheckProductHasSameSellerFromAPIAsync(productIdList);
        }

        [HttpPost("CheckOutOrder")]
        //[Authorize(Roles = ApplicationRoles.Staff + "," + ApplicationRoles.Manager)]
        public async Task<IActionResult> CheckOutOrderAsync(CheckOutBefore checkOutBefore)
        {
            var voucher = await _voucherService.SearchVoucherByCodeFromAPIAsync(checkOutBefore.VoucherCode);
            var result = await _service.CheckOutOrderFromAPIAsync(checkOutBefore.Address, checkOutBefore.ListProduct, voucher);
            return Ok(result);
        }

        [HttpPost("CreateOrder")]
        //[Authorize(Roles = ApplicationRoles.Buyer + "," + ApplicationRoles.Seller)]
        public async Task<ActionResult<bool>> CreateOrderAsync(DeliveryInformation deliveryInformation, string code)
        {
            var checkVoucher = await _voucherService.SearchVoucherByCodeFromAPIAsync(code);
            if (checkVoucher != null)
            {
                return await _service.CreateOrderFromAPIAsync(deliveryInformation, checkVoucher);
            }
            return false;
        }

        [HttpPut("UpdateOrderStatus/{orderId}")]
        //[Authorize(Roles =ApplicationRoles.Buyer)]
        public async Task<ActionResult<bool>> UpdateOrderStatusAsync(int orderId)
        {
            var delivery = await _deliveryLogService.ViewDeliveryLogByOrderIdFromAsync(new Order() { OrderId = orderId });
            if (delivery != null && delivery.Status == "Delivery Success")
            {
                var order = await _service.SearchOrderByOrderIdFromAPIAsync(new Order() { OrderId = orderId });

                if (order != null)
                {
                    order.Status = "Success";
                    order.UpdateAt = DateTime.Now;
                    return await _service.UpdateOrderStatusFromAPIAsync(order);
                }
            }

            return false;
        }

        private async Task UpdateOrderStatusAutomaticAsync()
        {
            var deliveryList = await _deliveryLogService.ViewAllDeliveryLogFromAsync();
            for (int i = 0; i < deliveryList.Count; i++)
            {
                var order = await _service.SearchOrderByOrderIdFromAPIAsync(new Order() { OrderId = (int)deliveryList[i].OrderId });
                if (DateTime.Now > order.UpdateAt && order.UpdateAt != null)
                {
                    var transaction = await _transactionService.ViewAllTransactionByUserIdAndOrderIdFromAPIAsync(new Account() { Id = order.SellerId }, new Order() { OrderId = order.OrderId });
                    if(transaction == null)
                    {
                        await SendOrderPriceToSeller(order);

                        if (order.Status != "Fail")
                            order.Status = "Success";
                        else
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
            var voucher = await _voucherService.SearchVoucherByIdFromAPIAsync(new Voucher() { VoucherId = (int)order.VoucherId });

            //Lenh chuyen tien ve cho nguoi ban hang
            decimal? originPrice;
            if (check)
            {
                originPrice = order.TotalPrice - _service.CheckFeeShipForOrderEvent(order.DeliveredAt);
                if (voucher != null)
                    originPrice /= (1 - voucher.DiscountValue);
            }
            else
            {
                originPrice = order.TotalPrice - _service.CheckFeeShipForOrderBatch(order.DeliveredAt);
                if (voucher != null)
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
                Content = "Order payment system for sellers",
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
            var check = await _service.CheckFeeShipEventOrBatchFromAPIAsync(productList);
            var voucher = await _voucherService.SearchVoucherByIdFromAPIAsync(new Voucher() { VoucherId = (int)order.VoucherId });

            //Lenh chuyen tien ve cho nguoi mua hang chi tru tien ship
            decimal? originPrice = 0;
            if (check)
                originPrice = order.TotalPrice - _service.CheckFeeShipForOrderEvent(order.DeliveredAt);
            else
                originPrice = order.TotalPrice - _service.CheckFeeShipForOrderBatch(order.DeliveredAt);

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
                Content = "Order payment system for Buyer",
            };
            await _notificationService.CreateNotificationFromApiAsync(notificationBuyer);
        }
    }
}

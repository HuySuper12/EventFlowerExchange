using SWP391.EventFlowerExchange.Domain.Entities;
using SWP391.EventFlowerExchange.Domain.ObjectValues;
using SWP391.EventFlowerExchange.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace SWP391.EventFlowerExchange.Infrastructure
{
    public class OrderRepository : IOrderRepository
    {
        private Swp391eventFlowerExchangePlatformContext _context;
        private ICartRepository _cartRepository;
        private IProductRepository _productRepository;
        private ITransactionRepository _transactionRepository;
        private INotificationRepository _notificationRepository;
        private IAccountRepository _accountRepository;

        public OrderRepository(ICartRepository cartRepository, IProductRepository productRepository, ITransactionRepository transactionRepository, INotificationRepository notificationRepository, IAccountRepository accountRepository)
        {
            _productRepository = productRepository;
            _cartRepository = cartRepository;
            _transactionRepository = transactionRepository;
            _notificationRepository = notificationRepository;
            _accountRepository = accountRepository;
        }

        public async Task<bool> CheckProductHasSameSellerAsync(List<int> productIdList)
        {
            //Tim product de gan sellerId && Kiem tra coi cac san pham co cung nguoi ban hay khong
            var product = await _productRepository.SearchProductByIdAsync(new GetProduct() { ProductId = productIdList[0] });
            for (int i = 0; i < productIdList.Count(); i++)
            {
                var checkProduct = await _productRepository.SearchProductByIdAsync(new GetProduct() { ProductId = productIdList[i] });
                if (checkProduct.SellerId != product.SellerId)
                {
                    return false;
                }
            }
            return true;
        }

        public async Task<CheckOutAfter> CheckOutOrderAsync(string address, List<int> productList, Voucher voucher)
        {
            decimal subTotal = 0;
            for (int i = 0; i < productList.Count; i++)
            {
                var product = await _productRepository.SearchProductByIdAsync(new GetProduct() { ProductId = productList[i] });
                subTotal += (decimal)product.Price;
            }

            decimal ship = 0;
            var result = await CheckFeeShipEventOrBatchAsync(productList);
            if (result)
                ship = CheckFeeShipForOrderEvent(address);
            else
                ship = CheckFeeShipForOrderBatch(address);

            decimal discount = subTotal * voucher.DiscountValue;

            return new CheckOutAfter { SubTotal = subTotal, Ship = ship, Discount = discount, Total = subTotal + ship - discount };
        }

        public async Task<bool> CreateOrderAsync(DeliveryInformation deliveryInformation, Account account, List<int> productIdList, Voucher voucher)
        {
            _context = new Swp391eventFlowerExchangePlatformContext();

            //Check san pham co o trong cart hay ko
            var cartItemList = new List<CartItem>();
            for (int i = 0; i < productIdList.Count(); i++)
            {
                var cartItem = await _cartRepository.ViewCartItemDetailAsync(new CartItem() { BuyerId = account.Id, ProductId = productIdList[i] });
                if (cartItem != null)
                    cartItemList.Add(cartItem);
                else
                    return false;
            }

            decimal? totalPrice = 0;
            //Tinh totalPrice
            foreach (var cartItem in cartItemList)
            {
                totalPrice += cartItem.Price;
            }
            totalPrice *= (1 - voucher.DiscountValue);

            var product = await _productRepository.SearchProductByIdAsync(new GetProduct() { ProductId = productIdList[0] });

            var check = await CheckFeeShipEventOrBatchAsync(productIdList);
            if (check)
                totalPrice += CheckFeeShipForOrderEvent(deliveryInformation.Address);
            else
                totalPrice += CheckFeeShipForOrderBatch(deliveryInformation.Address);

            //Tao don hang
            Order order = new Order()
            {
                BuyerId = account.Id,
                CreatedAt = DateTime.Now,
                SellerId = product.SellerId,
                TotalPrice = totalPrice,
                Status = "Pending",
                VoucherId = voucher.VoucherId,
                DeliveredAt = deliveryInformation.Address,
                PhoneNumber = deliveryInformation.PhoneNumber
            };
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            //Tao don hang chi tiet
            for (var i = 0; i < cartItemList.Count; i++)
            {
                OrderItem orderItem = new OrderItem()
                {
                    OrderId = order.OrderId,
                    ProductId = cartItemList[i].ProductId,
                    Quantity = 1,
                    Price = cartItemList[i].Price
                };
                _context.OrderItems.Add(orderItem);

                //Xoa tung san pham trong gio hang
                await _cartRepository.RemoveCartItemToCreateOrderAsync(new CartItem() { BuyerId = account.Id, ProductId = productIdList[i] });
            }

            //Tao giao dich khi mua hang
            var transactionCode = "EVE";
            while (true)
            {
                transactionCode = "EVE" + new Random().Next(100000, 999999).ToString();
                var result = await _transactionRepository.ViewTransactionByCodeAsync(new Transaction() { TransactionCode = transactionCode });
                if (result == null)
                {
                    break;
                }

            }
            Transaction transaction = new Transaction()
            {
                TransactionCode = transactionCode,
                Amount = totalPrice,
                CreatedAt = DateTime.Now,
                OrderId = order.OrderId,
                UserId = account.Id,
                TransactionType = 1,
                TransactionContent = $"Successful online purchase payment with order code is {order.OrderId}.",
                Status = true
            };

            _context.Transactions.Add(transaction);

            //Tru tien trong so du cua nguoi mua
            account.Balance -= totalPrice;
            await _accountRepository.UpdateAccountAsync(account);

            //Cong tien vao he thong
            var system = await _accountRepository.GetUserByEmailAsync(new Account() { Email = "ManagerEVESystem@gmail.com" });
            system.Balance += totalPrice;
            await _accountRepository.UpdateAccountAsync(system);

            //Gui thong bao cho nguoi ban va nguoi mua
            CreateNotification notificationBuyer = new CreateNotification()
            {
                UserEmail = account.Email,
                Content = "Order payment successful.",
            };
            await _notificationRepository.CreateNotificationAsync(notificationBuyer);

            CreateNotification notificationSeller = new CreateNotification()
            {
                UserEmail = account.Email,
                Content = "Your product has been ordered. Please prepare the order.",
            };
            await _notificationRepository.CreateNotificationAsync(notificationSeller);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<List<Order>> ViewAllOrderAsync()
        {
            _context = new Swp391eventFlowerExchangePlatformContext();
            return await _context.Orders.ToListAsync();
        }

        public async Task<List<OrderItem>> ViewOrderDetailAsync(Order order)
        {
            _context = new Swp391eventFlowerExchangePlatformContext();
            return await _context.OrderItems.Where(x => x.OrderId == order.OrderId).ToListAsync();
        }

        public async Task<List<Order>> ViewOrderByBuyerIdAsync(Account account)
        {
            _context = new Swp391eventFlowerExchangePlatformContext();
            return await _context.Orders.Where(x => x.BuyerId == account.Id).ToListAsync();
        }

        public async Task<Order> SearchOrderByOrderIdAsync(Order order)
        {
            _context = new Swp391eventFlowerExchangePlatformContext();
            return await _context.Orders.FirstOrDefaultAsync(x => x.OrderId == order.OrderId);
        }

        public async Task<bool> UpdateOrderStatusAsync(Order order)
        {
            _context = new Swp391eventFlowerExchangePlatformContext();

            _context.Orders.Update(order);
            await _context.SaveChangesAsync();
            return true;
        }

        public decimal CheckFeeShipForOrderEvent(string address)
        {
            if (address.ToLower().Contains("binh chanh") || address.ToLower().Contains("can gio") || address.ToLower().Contains("cu chi") || address.ToLower().Contains("hoc mon") || address.ToLower().Contains("nha be"))
            {
                return 400000;
            }
            else
            {
                return 300000;
            }
        }

        public decimal CheckFeeShipForOrderBatch(string address)
        {
            if (address.ToLower().Contains("binh chanh") || address.ToLower().Contains("can gio") || address.ToLower().Contains("cu chi") || address.ToLower().Contains("hoc mon") || address.ToLower().Contains("nha be"))
            {
                return 80000;
            }
            else
            {
                return 10000;
            }
        }

        public async Task<bool> CheckFeeShipEventOrBatchAsync(List<int> productIdList)
        {
            bool check = false;
            //Kiem tra phi ship la Event hay Batch
            for (int i = 0; i < productIdList.Count(); i++)
            {
                var checkProduct = await _productRepository.SearchProductByIdAsync(new GetProduct() { ProductId = productIdList[i] });
                if (checkProduct.ComboType.ToLower() == "events")
                {
                    check = true;
                    break;
                }
            }
            return check;
        }

        public Dictionary<string, int> GetMonthlyOrderStatistics()
        {
            _context = new Swp391eventFlowerExchangePlatformContext();
            var statistics = _context.Orders
            .Where(order => order.CreatedAt.HasValue)
            .GroupBy(order => new { Year = order.CreatedAt.Value.Year, Month = order.CreatedAt.Value.Month })
            .ToDictionary(
                g => $"{g.Key.Year}-{g.Key.Month}",  // Key: Năm và tháng
                g => g.Count()  // Value: Số lượng đơn hàng
            );
            return statistics;
        }

    }
}

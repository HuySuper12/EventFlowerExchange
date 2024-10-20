using SWP391.EventFlowerExchange.Domain.Entities;
using SWP391.EventFlowerExchange.Domain.ObjectValues;
using SWP391.EventFlowerExchange.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWP391.EventFlowerExchange.Application
{
    public class OrderService : IOrderService
    {
        private IOrderRepository _repo;
        private ICartRepository _cartRepository;
        private IAccountRepository _accountRepository;
        private IProductRepository _productRepository;

        public OrderService(IOrderRepository repo, ICartRepository cartRepository, IAccountRepository accountRepository, IProductRepository productRepository)
        {
            _accountRepository = accountRepository;
            _repo = repo;
            _cartRepository = cartRepository;
            _productRepository = productRepository;
        }

        public async Task<bool> CreateOrderFromAPIAsync(DeliveryInformation deliveryInformation, Voucher voucher)
        {
            var account = await _accountRepository.GetUserByEmailAsync(new Account() { Email = deliveryInformation.Email });
            for (var i = 0; i < deliveryInformation.Product.Count(); i++)
            {
                var product = await _productRepository.SearchProductByIdAsync(new GetProduct() { ProductId = deliveryInformation.Product[i] });
                if (product.Status == "Disable")
                    return false;
            }
            return await _repo.CreateOrderAsync(deliveryInformation, account, deliveryInformation.Product, voucher);
        }

        public async Task<List<OrderItem>> ViewOrderDetailFromAPIAsync(Order order)
        {
            return await _repo.ViewOrderDetailAsync(order);
        }

        public async Task<List<Order>> ViewAllOrderFromAPIAsync()
        {
            return await _repo.ViewAllOrderAsync();
        }

        public async Task<List<Order>> ViewOrderByBuyerIdFromAPIAsync(Account account)
        {
            return await _repo.ViewOrderByBuyerIdAsync(account);
        }

        public async Task<Order> SearchOrderByOrderIdFromAPIAsync(Order order)
        {
            return await _repo.SearchOrderByOrderIdAsync(order);
        }

        public async Task<bool> UpdateOrderStatusFromAPIAsync(Order order)
        {
            return await _repo.UpdateOrderStatusAsync(order);
        }

        public Dictionary<string, int> GetMonthlyOrderStatisticsFromAPI()
        {
            return _repo.GetMonthlyOrderStatistics();
        }

        public decimal CheckFeeShipForOrderEvent(string address)
        {
            return _repo.CheckFeeShipForOrderEvent(address);
        }

        public decimal CheckFeeShipForOrderBatch(string address)
        {
            return _repo.CheckFeeShipForOrderBatch(address);
        }

        public async Task<bool> CheckFeeShipEventOrBatchFromAPIAsync(List<int> productIdList)
        {
            return await _repo.CheckFeeShipEventOrBatchAsync(productIdList);
        }

        public async Task<bool> CheckProductHasSameSellerFromAPIAsync(List<int> productIdList)
        {
            return await _repo.CheckProductHasSameSellerAsync(productIdList);
        }

        public async Task<CheckOutAfter> CheckOutOrderFromAPIAsync(string address, List<int> productList, Voucher voucher)
        {
            return await _repo.CheckOutOrderAsync(address, productList, voucher);
        }
    }
}

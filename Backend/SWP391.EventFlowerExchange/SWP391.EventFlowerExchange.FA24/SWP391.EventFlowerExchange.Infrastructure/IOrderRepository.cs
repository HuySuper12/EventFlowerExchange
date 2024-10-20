﻿using SWP391.EventFlowerExchange.Domain.Entities;
using SWP391.EventFlowerExchange.Domain.ObjectValues;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWP391.EventFlowerExchange.Infrastructure
{
    public interface IOrderRepository
    {
        public Task<List<Order>> ViewAllOrderAsync();
        public Task<List<OrderItem>> ViewOrderDetailAsync(Order order);
        public Task<Order> SearchOrderByOrderIdAsync(Order order);
        public Task<List<Order>> ViewOrderByBuyerIdAsync(Account account);
        public Task<bool> CreateOrderAsync(DeliveryInformation deliveryInformation, Account account, List<int> productIdList, Voucher voucher);
        public Task<bool> UpdateOrderStatusAsync(Order order);

        public Dictionary<string, int> GetMonthlyOrderStatistics();

        public decimal CheckFeeShipForOrderEvent(string address);
        public decimal CheckFeeShipForOrderBatch(string address);
        public Task<bool> CheckFeeShipEventOrBatchAsync(List<int> productIdList);

        public Task<bool> CheckProductHasSameSellerAsync(List<int> productIdList);
        public Task<CheckOutAfter> CheckOutOrderAsync(string address, List<int> productList, Voucher voucher);

    }
}
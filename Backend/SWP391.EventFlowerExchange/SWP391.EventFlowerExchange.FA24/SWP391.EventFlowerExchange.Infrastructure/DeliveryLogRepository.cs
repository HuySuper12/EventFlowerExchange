﻿using SWP391.EventFlowerExchange.Domain.ObjectValues;
using SWP391.EventFlowerExchange.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace SWP391.EventFlowerExchange.Infrastructure
{
    public class DeliveryLogRepository : IDeliveryLogRepository
    {

        private Swp391eventFlowerExchangePlatformContext _context;

        public async Task<bool> CreateDeliveryLogAsync(DeliveryLog deliveryLog)
        {
            _context = new Swp391eventFlowerExchangePlatformContext();
            _context.DeliveryLogs.Add(deliveryLog);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateDeliveryLogStatusAsync(DeliveryLog deliveryLog)
        {
            _context = new Swp391eventFlowerExchangePlatformContext();
            _context.DeliveryLogs.Update(deliveryLog);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<DeliveryLog>> ViewAllDeliveryLogAsync()
        {
            _context = new Swp391eventFlowerExchangePlatformContext();
            return await _context.DeliveryLogs.ToListAsync();
        }

        public async Task<DeliveryLog> ViewDeliveryLogByOrderIdAsync(Order order)
        {
            _context = new Swp391eventFlowerExchangePlatformContext();
            return await _context.DeliveryLogs.FirstOrDefaultAsync(x => x.OrderId == order.OrderId);
        }

        public async Task<List<DeliveryLog>> ViewDeliveryLogByShipperIdAsync(Account account)
        {
            _context = new Swp391eventFlowerExchangePlatformContext();
            return await _context.DeliveryLogs.Where(x => x.DeliveryPersonId == account.Id).ToListAsync();
        }
    }
}

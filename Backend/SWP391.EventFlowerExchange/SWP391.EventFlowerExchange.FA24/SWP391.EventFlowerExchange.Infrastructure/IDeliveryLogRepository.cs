using SWP391.EventFlowerExchange.Domain.ObjectValues;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWP391.EventFlowerExchange.Infrastructure
{
    public interface IDeliveryLogRepository
    {
        public Task<List<DeliveryLog>> ViewAllDeliveryLogAsync();

        public Task<List<DeliveryLog>> ViewDeliveryLogByShipperIdAsync(Account account);

        public Task<DeliveryLog> ViewDeliveryLogByOrderIdAsync(Order order);

        public Task<bool> CreateDeliveryLogAsync(DeliveryLog deliveryLog);

        public Task<bool> UpdateDeliveryLogStatusAsync(DeliveryLog deliveryLog);

        public Task<bool> CheckShipperIsFreeAsync(Account account);
    }
}

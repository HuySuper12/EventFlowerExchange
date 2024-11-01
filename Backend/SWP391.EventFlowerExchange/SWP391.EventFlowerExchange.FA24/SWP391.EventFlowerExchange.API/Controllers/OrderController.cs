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

        
    }
}

﻿using Microsoft.AspNetCore.Authorization;
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
    public class DeliveryLogController : ControllerBase
    {
        private IDeliveryLogService _service;
        private IAccountService _accountService;
        private IOrderService _orderService;
        private INotificationService _notificationService;

        public DeliveryLogController(IDeliveryLogService service, IAccountService accountService, IOrderService orderService, INotificationService notificationService)
        {
            _service = service;
            _accountService = accountService;
            _orderService = orderService;
            _notificationService = notificationService;
        }

        [HttpGet("ViewAllDeliveryLog")]
        //[Authorize(Roles = ApplicationRoles.Manager + "," + ApplicationRoles.Staff)]
        public async Task<IActionResult> ViewAllDeliveryLogAsync()
        {
            return Ok(await _service.ViewAllDeliveryLogFromAsync());
        }

        
    }
}

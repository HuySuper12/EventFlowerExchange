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

        [HttpGet("ViewDeliveryLogShipperByEmail")]
        //[Authorize(Roles = ApplicationRoles.Shipper)]
        public async Task<IActionResult> ViewDeliveryLogByShipperIdAsync(string email)
        {
            var account = await _accountService.GetUserByEmailFromAPIAsync(new Account() { Email = email });
            var result = await _service.ViewDeliveryLogByShipperIdFromAsync(account);
            if (result != null)
            {
                return Ok(result);
            }
            return BadRequest("Not found!!!");
        }

        [HttpGet("ViewDeliveryLogByOrderId")]
        //[Authorize(Roles = ApplicationRoles.Buyer)]
        public async Task<IActionResult> ViewDeliveryLogByOrderIdAsync(int orderId)
        {
            var result = await _service.ViewDeliveryLogByOrderIdFromAsync(new Order() { OrderId = orderId });
            if (result != null)
            {
                return Ok(result);
            }
            return BadRequest("Not found!!!");
        }
    }
}

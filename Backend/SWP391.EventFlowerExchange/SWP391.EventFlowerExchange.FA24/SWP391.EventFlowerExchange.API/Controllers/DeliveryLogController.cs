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

        [HttpGet("ViewDeliveryTime")]
        //[Authorize(Roles = ApplicationRoles.Shipper)]
        public async Task<ActionResult<DeliveryTime>> ViewDeliveryTimeAsync(int id)
        {
            var order = await _orderService.SearchOrderByOrderIdFromAPIAsync(new Order() { OrderId = id });
            if (order != null)
            {
                return await _service.ViewDeliveryTimeFromAPIAsync(order);
            }
            return BadRequest("Not found!!!");
        }

        [HttpGet("ViewDeliveryLogDeliveringByShipperEmail")]
        //[Authorize(Roles = ApplicationRoles.Shipper)]
        public async Task<ActionResult<DeliveryLog>> ViewDeliveryLogDeliveringByShipperId(string email)
        {
            var account = await _accountService.GetUserByEmailFromAPIAsync(new Account() { Email = email });
            if (account != null)
            {
                var deliveryLog = await _service.ViewDeliveryLogDeliveringByShipperIdFromAPIAsync(new DeliveryLog() { DeliveryPersonId = account.Id });
                return deliveryLog;
            }
            return BadRequest("Not found!!!");
        }

        [HttpPost("CreateDeliveryLog")]
        //[Authorize(Roles = ApplicationRoles.Staff + "," + ApplicationRoles.Manager)]
        public async Task<ActionResult<bool>> CreateDeliveryLogAsync(CreateDeliveryLog createDeliveryLog)
        {
            var deliveryLogResult = await _service.ViewDeliveryLogByOrderIdFromAsync(new Order() { OrderId = (int)createDeliveryLog.OrderId });

            if (deliveryLogResult == null)
            {
                var account = await _accountService.GetUserByEmailFromAPIAsync(new Account() { Email = createDeliveryLog.DeliveryPersonEmail });
                DeliveryLog deliveryLog = new DeliveryLog()
                {
                    OrderId = createDeliveryLog.OrderId,
                    DeliveryPersonId = account.Id,
                    CreatedAt = DateTime.Now
                };
                await _service.CreateDeliveryLogFromAsync(deliveryLog);

                //Gan shipper vao don hang, thay doi trang thai don hang thanh giao hang
                var order = await _orderService.SearchOrderByOrderIdFromAPIAsync(new Order() { OrderId = (int)createDeliveryLog.OrderId });
                order.Status = "Take over";
                deliveryLog.TakeOverAt = DateTime.Now;
                order.DeliveryPersonId = account.Id;
                await _orderService.UpdateOrderStatusFromAPIAsync(order);

                var accountBuyer = await _accountService.GetUserByIdFromAPIAsync(new Account() { Id = order.BuyerId });

                //Gui thong bao don hang dang giao
                CreateNotification notification = new CreateNotification()
                {
                    UserEmail = accountBuyer.Email,
                    Content = "Shipper is coming to pick up your order"
                };
                await _notificationService.CreateNotificationFromApiAsync(notification);

                return true;
            }
            return false;
        }
    }
}

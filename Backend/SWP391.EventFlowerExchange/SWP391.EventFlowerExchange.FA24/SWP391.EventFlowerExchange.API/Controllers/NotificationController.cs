using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SWP391.EventFlowerExchange.Application;
using SWP391.EventFlowerExchange.Domain.Entities;
using SWP391.EventFlowerExchange.Domain.ObjectValues;
using SWP391.EventFlowerExchange.Infrastructure;

namespace SWP391.EventFlowerExchange.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private INotificationService _service;
        private IAccountService _accountService;

        public NotificationController(INotificationService service, IAccountService accountService)
        {
            _service = service;
            _accountService = accountService;
        }

        [HttpGet("ViewAllNotification")]
        [Authorize(Roles = ApplicationRoles.Manager + " , " + ApplicationRoles.Staff)]
        public async Task<IActionResult> ViewAllNotification()
        {
            try
            {
                return Ok(await _service.ViewAllNotificationFromApiAsync());
            }
            catch
            {
                return Ok("Not found!");
            }
        }

        
    } 
}

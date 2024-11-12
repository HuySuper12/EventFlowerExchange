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
        //[Authorize(Roles = ApplicationRoles.Manager + " , " + ApplicationRoles.Staff )]
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

        [HttpGet("ViewNotificationByUserEmail/{email}")]
        //[Authorize(Roles = ApplicationRoles.Seller + " , " + ApplicationRoles.Buyer)]
        public async Task<IActionResult> ViewNotificationByUserEmail(string email)
        {
            Account acc = new Account();
            acc.Email = email;

            var check = await _accountService.GetUserByEmailFromAPIAsync(acc); // ĐÃ SỬA
            if (check != null)
            {
                var result = await _service.ViewAllNotificationByUserIdFromApiAsync(check);
                if (result != null)
                {
                    return Ok(result);
                }
            }

            return Ok("Not found!");
        }
    } 
}

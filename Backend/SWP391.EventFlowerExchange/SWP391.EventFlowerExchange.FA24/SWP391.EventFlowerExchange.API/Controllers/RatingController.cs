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
    public class RatingController : ControllerBase
    {
        private IRatingService _service;
        private IAccountService _accountService;
        private IOrderService _orderService;

        public RatingController(IRatingService service, IAccountService accountService, IOrderService orderService)
        {
            _service = service;
            _accountService = accountService;
            _orderService = orderService;
        }

        [HttpGet("ViewRatingByUserEmail")]
        //[Authorize]
        public async Task<IActionResult> ViewRatingByUserEmail(string email)
        {
            Account acc = new Account();
            acc.Email = email;

            var check = await _accountService.GetUserByEmailFromAPIAsync(acc);     // ĐÃ SỬA 
            if (check != null)
            {
                var result = await _service.ViewAllRatingByUserIdFromApiAsync(check);
                if (result != null)
                {
                    return Ok(result);
                }
            }

            return Ok("Not found!");
        }

        [HttpGet("CheckRatingByUserEmail")]
        //[Authorize]
        public async Task<bool> CheckRatingByUserEmail(string email)
        {
            Account acc = new Account();
            acc.Email = email;

            var check = await _accountService.GetUserByEmailFromAPIAsync(acc);     // ĐÃ SỬA 
            if (check != null)
            {
                var result = await _service.ViewAllRatingByUserIdFromApiAsync(check);
                if (result != null)
                {
                    return true;
                }
            }

            return false;
        }

    }
}

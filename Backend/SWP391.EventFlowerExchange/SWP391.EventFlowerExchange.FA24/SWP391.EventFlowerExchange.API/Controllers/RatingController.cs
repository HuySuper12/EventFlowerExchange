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

        public RatingController(IRatingService service, IAccountService accountService)
        {
            _service = service;
            _accountService = accountService;
        }

        [HttpGet("ViewRatingByUserId/{email}")]
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

        [HttpPost("PostRating")]
        //[Authorize(Roles = ApplicationRoles.Buyer)]
        public async Task<ActionResult<bool>> PostRating(CreateRating rate)  //KÊU QUÝ MINH TRUYỀN EMAIL VÀO BUYER ID. ĐỂ KHỎI PHẢI SỬA TÊN CreateRating Ở TRONG REPOSITORY
        {
            Account acc = new Account();
            acc.Email = rate.BuyerEmail;
            var deleteAccount = await _accountService.GetUserByEmailFromAPIAsync(acc); 

            if (deleteAccount != null)
            {
                var result = await _service.PostRatingFromApiAsync(rate);
                if (result.Succeeded)
                {
                    return true;
                }
                return false;
            }

            return false;
        }
    }
}

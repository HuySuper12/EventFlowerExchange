using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SWP391.EventFlowerExchange.Application;
using SWP391.EventFlowerExchange.Domain.Entities;

namespace SWP391.EventFlowerExchange.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private IAccountService _service;

        public AccountController(IAccountService service)
        {
            _service = service;
        }

        [HttpPost("SignUp/Buyer")]
        public async Task<IActionResult> SignUp(SignUp model)
        {
            var result = await _service.SignUpBuyerFromAPIAsync(model);
            if (result.Succeeded)
            {
                return Ok(result.Succeeded);
            }
            return Ok("Fail to sign up account.");
        }

        [HttpPost("SignIn")]
        public async Task<IActionResult> SignInFromAPIAsync(SignIn model)
        {
            var result = await _service.SignInFromAPIAsync(model);
            if (string.IsNullOrEmpty(result))
            {
                return Unauthorized();
            }
            return Ok(result);
        }
    }
}

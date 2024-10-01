using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SWP391.EventFlowerExchange.Application;
using SWP391.EventFlowerExchange.Domain.Entities;
using SWP391.EventFlowerExchange.Infrastructure;

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

        [HttpGet("ViewAllAccount")]
        [Authorize(Roles = ApplicationRoles.Manager)]
        public async Task<IActionResult> ViewAllAccount()
        {
            try
            {
                return Ok(await _service.ViewAllAccount());
            }
            catch
            {
                return Ok("Nothing!");    
            }
        }


        [HttpGet("ViewAllAccountByRole/{role}")]
        [Authorize(Roles = ApplicationRoles.Manager)]
        public async Task<IActionResult> ViewAllAccountByRole(string role)
        {
            var accounts= await _service.ViewAllAccountByRole(role);

            if (accounts != null) return Ok(accounts);
            
            return Ok("Nothing!");
        }

        [HttpPost("CreateStaffAccount")]
        [Authorize(Roles = ApplicationRoles.Manager)]
        public async Task<IActionResult> CreateStaff(SignUpStaff model)
        {
            var result = await _service.CreateStaffAccount(model);
            if (result.Succeeded)
            {
                return Ok(result.Succeeded);
            }
            return Ok("Fail to create staff account.");
        }

        [HttpDelete("RemoveAccount/{id}")]
        [Authorize(Roles = ApplicationRoles.Manager)]
        public async Task<IActionResult> RemoveAccount(string id)
        {
            await _service.RemoveAccount(id);
            return Ok();
        }
    }
}

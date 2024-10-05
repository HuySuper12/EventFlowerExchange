using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SWP391.EventFlowerExchange.Application;
using SWP391.EventFlowerExchange.Domain.Entities;
using SWP391.EventFlowerExchange.Domain.ObjectValues;
using SWP391.EventFlowerExchange.Infrastructure;
using System.Data;

namespace SWP391.EventFlowerExchange.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private IAccountService _service;
        private readonly Microsoft.AspNetCore.Identity.RoleManager<IdentityRole> roleManager;
        private readonly Microsoft.AspNetCore.Identity.UserManager<Account> userManager;

        public AccountController(IAccountService service, Microsoft.AspNetCore.Identity.RoleManager<IdentityRole> roleManager, Microsoft.AspNetCore.Identity.UserManager<Account> userManager)
        {
            _service = service;
            this.roleManager = roleManager;
            this.userManager = userManager;
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
        //[Authorize(Roles = ApplicationRoles.Manager)]
        public async Task<IActionResult> ViewAllAccount()
        {
            try
            {
                return Ok(await _service.ViewAllAccountFromAPIAsync());
            }
            catch
            {
                return Ok("Not found!");
            }
        }


        [HttpGet("ViewAllAccount/{role}")]
        //[Authorize(Roles = ApplicationRoles.Manager)]
        public async Task<IActionResult> ViewAllAccountByRole(string role)
        {

            var accounts = await _service.ViewAllAccountByRoleFromAPIAsync(role);

            if (accounts != null) return Ok(accounts);

            return Ok("Not found!");
        }

        [HttpGet("ViewAccount/{id}")]
        //[Authorize(Roles = ApplicationRoles.Manager)]
        public async Task<IActionResult> ViewAccountById(string id)
        {
            Account acc=new Account();
            acc.Id = id;

            var accounts = await _service.GetUserByIdFromAPIAsync(acc);

            if (accounts != null) return Ok(accounts);

            return Ok("Not found!");
        }

        [HttpPost("CreateAccount/Staff")]
        //[Authorize(Roles = ApplicationRoles.Manager)]
        public async Task<ActionResult<bool>> CreateStaff(SignUpStaff model)
        {
            var result = await _service.CreateStaffAccountFromAPIAsync(model);
            if (result.Succeeded)
            {
                return true;
            }
            return false;
        }

        [HttpPost("CreateAccount/Shipper")]
        //[Authorize(Roles = ApplicationRoles.Manager)]
        public async Task<ActionResult<bool>> CreateShipper(SignUpShipper model)
        {
            var result = await _service.CreateShipperAccountFromAPIAsync(model);
            if (result.Succeeded)
            {
                return true;
            }
            return false;
        }

        [HttpDelete("RemoveAccount/{id}")]
        //[Authorize(Roles = ApplicationRoles.Manager)]
        public async Task<ActionResult<bool>> RemoveAccount(string id)
        {
            Account acc=new Account();
            acc.Id = id;
            var deleteAccount = await _service.GetUserByIdFromAPIAsync(acc);


            if (deleteAccount != null)
            {
                var userRoles = await userManager.GetRolesAsync(deleteAccount);
                foreach (var role in userRoles)
                {
                    if (role.ToLower().Contains("admin")
                        || role.ToLower().Contains("shipper"))
                    {
                        await _service.RemoveAccountFromAPIAsync(deleteAccount);
                        return true;
                    }
                }
            }

            return false;
        }

        [HttpPut("DisableAccount/{id}")]
        //[Authorize(Roles = ApplicationRoles.Manager)]
        public async Task<ActionResult<bool>> DeleteAccount(string id)
        {
            Account acc = new Account();
            acc.Id = id;
            var disableAccount = await _service.GetUserByIdFromAPIAsync(acc);

            if (disableAccount != null)
            {
                var userRoles = await userManager.GetRolesAsync(disableAccount);
                foreach (var role in userRoles)
                {
                    if (role.ToLower().Contains("buyer")
                        || role.ToLower().Contains("seller"))
                    {
                        await _service.DeleteAccountFromAPIAsync(disableAccount);
                        return true;
                    }
                }
            }

            return false;
        }
    

        [HttpGet("SearchAccounts/{address}")]
        //[Authorize(Roles = ApplicationRoles.Manager)]
        public async Task<IActionResult> SearchAccountsByAddress(string address)
        {
            var accounts = await _service.SearchAccountsByAddressFromAPIAsync(address);

            if (accounts != null) return Ok(accounts);

            return Ok("Not found!");
        }

        [HttpGet("SearchShipper/{address}")]
        //[Authorize(Roles = ApplicationRoles.Manager)]
        public async Task<IActionResult> SearchShipperByAddress(string address)
        {
            var accounts = await _service.SearchShipperByAddressFromAPIAsync(address);

            if (accounts != null) return Ok(accounts);

            return Ok("Not found!");
        }

        [HttpGet("SearchAccounts/{minSalary}/{maxSalary}")]
        //[Authorize(Roles = ApplicationRoles.Manager)]
        public async Task<IActionResult> SearchAccountsBySalary(float minSalary, float maxSalary)
        { 
            if (minSalary < 0 || maxSalary < 0 )
            {
                return Ok("minSalary or maxSalary must not be negative number");
            }

            if (minSalary > maxSalary) 
            {
                return Ok("minSalary must be less than or equal to maxSalary");
            }

            var accounts = await _service.SearchAccountsBySalaryFromAPIAsync(minSalary, maxSalary);

            if (accounts != null) return Ok(accounts);

            return Ok("Not found!");
        }

        [HttpPost("SignUp/Seller")]
        public async Task<ActionResult<bool>> SignUpSeller(SignUpSeller model)
        {
            var result = await _service.SignUpSellerFromAPIAsync(model);
            if (result.Succeeded)
            {
                return true;
            }
            return false;
        }


    }
}

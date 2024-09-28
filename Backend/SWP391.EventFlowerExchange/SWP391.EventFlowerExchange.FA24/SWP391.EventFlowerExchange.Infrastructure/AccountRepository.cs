using SWP391.EventFlowerExchange.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SWP391.EventFlowerExchange.Domain.ObjectValues;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SWP391.EventFlowerExchange.Infrastructure
{
    public class AccountRepository : IAccountRepository
    {
        private readonly UserManager<Account> userManager;
        private readonly SignInManager<Account> signInManager;
        private readonly IConfiguration configuration;
        private readonly RoleManager<IdentityRole> roleManager;

        public AccountRepository(UserManager<Account> userManager, SignInManager<Account> signInManager, IConfiguration configuration, RoleManager<IdentityRole> roleManager)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.configuration = configuration;
            this.roleManager = roleManager;
        }

        public async Task<string> SignInAsync(SignIn model)
        {

            var user = await userManager.FindByEmailAsync(model.Email);//Tim email
            var passwordValid = await userManager.CheckPasswordAsync(user, model.Password);//Check password cua user
            if (user == null || !passwordValid)
            {
                return string.Empty;
            }

            var authenClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, model.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            var userRoles = await userManager.GetRolesAsync(user);
            foreach (var role in userRoles)
            {
                authenClaims.Add(new Claim(ClaimTypes.Role, role.ToString()));
            }

            var authenKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]));
            var tokenDescription = new JwtSecurityToken(
                issuer: configuration["JWT:ValidIssuer"],
                audience: configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddMinutes(5),
                claims: authenClaims,
                signingCredentials: new Microsoft.IdentityModel.Tokens.SigningCredentials(authenKey, SecurityAlgorithms.HmacSha256Signature)
                );
            return new JwtSecurityTokenHandler().WriteToken(tokenDescription);
        }

        public async Task<IdentityResult> SignUpBuyerAsync(SignUp model)
        {
            var user = new Account
            {
                Name = model.Name,
                Email = model.Email,
                UserName = model.Email,
                Balance = model.Balance,
                Address = model.Address,
                PhoneNumber = model.Phone,
                CreatedAt = DateTime.UtcNow,
                Status = true
            };

            var result = await userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                //Gan Role Customer
                await roleManager.CreateAsync(new IdentityRole(ApplicationRoles.Buyer));
                await userManager.AddToRoleAsync(user, ApplicationRoles.Buyer);
            }
            return result;
        }
    }
}

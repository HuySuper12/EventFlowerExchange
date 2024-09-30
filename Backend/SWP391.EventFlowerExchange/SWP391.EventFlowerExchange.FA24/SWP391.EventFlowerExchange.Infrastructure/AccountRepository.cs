﻿using SWP391.EventFlowerExchange.Domain.Entities;
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
using SWP391.EventFlowerExchange.Domain;
using Microsoft.EntityFrameworkCore;

namespace SWP391.EventFlowerExchange.Infrastructure
{
    public class AccountRepository : IAccountRepository
    {
        private readonly UserManager<Account> userManager;
        private readonly SignInManager<Account> signInManager;
        private readonly IConfiguration configuration;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly Swp391eventFlowerExchangePlatformContext _context;

        public AccountRepository(UserManager<Account> userManager, SignInManager<Account> signInManager, IConfiguration configuration, RoleManager<IdentityRole> roleManager, Swp391eventFlowerExchangePlatformContext context)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.configuration = configuration;
            this.roleManager = roleManager;
            _context = context;
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

        public async Task<IdentityResult> CreateStaffAccount(SignUpStaff model)
        {
            var user = new Account
            {
                Name = model.Name,
                Salary = model.Salary,
                Email = model.Email,
                PhoneNumber = model.PhoneNumber,
                Address = model.Address,
                CreatedAt = DateTime.UtcNow,
                Status = true
            };

            var result = await userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                //Gan Role Customer
                await roleManager.CreateAsync(new IdentityRole(ApplicationRoles.Admin));
                await userManager.AddToRoleAsync(user, ApplicationRoles.Admin);
            }
            return result;
        }

        public async Task<List<Account>> ViewAllAccount()
        {
            return await _context.Accounts.ToListAsync();
        }

        public async Task<List<Account>> ViewAllAccountByRole(string role)
        {
            var result = new List<Account>();
            var accounts = await _context.Accounts.ToListAsync();

            foreach (var account in accounts)
            {
                var userRoles = await userManager.GetRolesAsync(account);
                foreach (var userRole in userRoles)
                {
                    if (userRole.ToLower() == role.ToLower())
                    {
                        result.Add(account);
                    }
                }
            }
            return result;
        }

        public async Task<IdentityResult> RemoveAccount(string id)
        {
            var deleteAccount = await _context.Accounts!.SingleOrDefaultAsync(b => b.Id == id);
            if (deleteAccount != null)
            {
                var result = _context.Accounts!.Remove(deleteAccount);
                await _context.SaveChangesAsync();
                return IdentityResult.Success;
            }
            return IdentityResult.Failed(); // Account not found
        }
    }
}

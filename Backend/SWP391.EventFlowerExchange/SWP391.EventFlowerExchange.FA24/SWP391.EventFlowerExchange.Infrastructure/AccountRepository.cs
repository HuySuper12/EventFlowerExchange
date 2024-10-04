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
using System.Data;

namespace SWP391.EventFlowerExchange.Infrastructure
{
    public class AccountRepository : IAccountRepository
    {
        private readonly UserManager<Account> userManager;
        private readonly SignInManager<Account> signInManager;
        private readonly IConfiguration configuration;
        private readonly RoleManager<IdentityRole> roleManager;
        private Swp391eventFlowerExchangePlatformContext _context;

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

        public async Task<IdentityResult> CreateStaffAccountAsync(SignUpStaff model)
        {

            var user = new Account
            {
                Name = model.Name,
                Salary = model.Salary,
                UserName=model.Email,
                //khi login thì identity tiến hành xác thực email qua NormalizedUserName và NormalizedEmail thì nó mới 
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

        public async Task<IdentityResult> SignUpSellerAsync(SignUpSeller model)
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
                //Gan Role Seller
                await roleManager.CreateAsync(new IdentityRole(ApplicationRoles.Seller));
                await userManager.AddToRoleAsync(user, ApplicationRoles.Seller);
            }

            return result;

        }

        public async Task<IdentityResult> CreateShipperAccountAsync(SignUpShipper model)
        {

            var user = new Account
            {
                Name = model.Name,
                Salary = model.Salary,
                UserName = model.Email,
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
                await roleManager.CreateAsync(new IdentityRole(ApplicationRoles.Shipper));
                await userManager.AddToRoleAsync(user, ApplicationRoles.Shipper);
            }

            return result;

        }

        public async Task<List<Account>> ViewAllAccountAsync()
        {

            _context = new Swp391eventFlowerExchangePlatformContext();

            return await _context.Accounts.ToListAsync();

        }

        public async Task<List<Account>> ViewAllAccountByRoleAsync(string role)
        {

            _context = new Swp391eventFlowerExchangePlatformContext();

            var result = new List<Account>();
            var accounts = await _context.Accounts.ToListAsync();

            foreach (var account in accounts)
            {
                var userRoles = await userManager.GetRolesAsync(account);
                foreach (var userRole in userRoles)
                {
                    if (userRole.ToLower().Contains(role.ToLower()))
                    {
                        result.Add(account);
                    }
                }
            }

            if (result != null)
            {
                return result;
            }

            return null;

        }

        public async Task<IdentityResult> RemoveAccountAsync(string id)
        {

            _context = new Swp391eventFlowerExchangePlatformContext();

            var deleteAccount = await this.GetUserByIdAsync(id);

            if (deleteAccount != null)
            {
                var userRoles=await userManager.GetRolesAsync(deleteAccount);
                foreach (var role in userRoles)
                {
                    if (role.ToLower().Contains("admin")
                        || role.ToLower().Contains("shipper"))
                    {
                        var result = _context.Accounts!.Remove(deleteAccount);
                        await _context.SaveChangesAsync();
                        return IdentityResult.Success;
                    }
                }
            }

            return IdentityResult.Failed();

        }

        public async Task<Account> GetUserByIdAsync(string id)
        {

            _context = new Swp391eventFlowerExchangePlatformContext();

            var user = await _context.Accounts!.FindAsync(id);

            if (user != null)
            {
                return user;
            }

            return null;

        }


        public async Task<IdentityResult> DisableAccountAsync(string id)
        {

            _context = new Swp391eventFlowerExchangePlatformContext();

            var disableAccount = await this.GetUserByIdAsync(id);

            if (disableAccount != null)
            {
                var userRoles = await userManager.GetRolesAsync(disableAccount);
                foreach (var role in userRoles)
                {
                    if (role.ToLower().Contains("buyer")
                        || role.ToLower().Contains("seller"))
                    {
                        disableAccount.Status = false;
                        await _context.SaveChangesAsync();
                        return IdentityResult.Success;
                    }
                }
            }

            return IdentityResult.Failed();

        }

        public async Task<List<Account>> SearchAccountsByAddressAsync(string address)
        {

            _context = new Swp391eventFlowerExchangePlatformContext();

            var accounts = await _context.Accounts
                .Where(b => b.Address.ToLower().Contains(address.ToLower()))
                .ToListAsync();

            if (accounts != null)
            {
                return accounts;
            }

            return null;

        }

        public async Task<List<Account>> SearchAccountsBySalaryAsync(float minSalary, float maxSalary)
        {

           _context = new Swp391eventFlowerExchangePlatformContext();

            var accounts = await _context.Accounts
                .Where(s => s.Salary >= minSalary && s.Salary <= maxSalary)
                .ToListAsync();

            if (accounts != null)
            {
                return accounts;
            }

            return null;

        }

        

        public async Task<List<Account>> SearchShipperByAddressAsync(string address)
        {

            _context = new Swp391eventFlowerExchangePlatformContext();

            var result = new List<Account>();
            var accounts = await _context.Accounts
                .Where(b => b.Address.ToLower().Contains(address.ToLower()))
                .ToListAsync();

            if (accounts != null)
            {
                foreach (var account in accounts)
                {
                    var userRoles = await userManager.GetRolesAsync(account);
                    foreach (var userRole in userRoles)
                    {
                        if (userRole.ToLower().Contains("shipper"))
                        {
                            result.Add(account);
                        }
                    }
                }
            }

            return null;

        }
    }
}

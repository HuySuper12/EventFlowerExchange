using SWP391.EventFlowerExchange.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SWP391.EventFlowerExchange.Domain.ObjectValues;

namespace SWP391.EventFlowerExchange.Infrastructure
{
    public interface IAccountRepository
    {
        public Task<IdentityResult> SignUpBuyerAsync(SignUp signUp);
        public Task<IdentityResult> CreateStaffAccountAsync(SignUpStaff staff);
        public Task<IdentityResult> CreateShipperAccountAsync(SignUpShipper shipper);
        public Task<string> SignInAsync(SignIn signIn);
        public Task<List<Account>> ViewAllAccountAsync();
        public Task<List<Account>> ViewAllAccountByRoleAsync(string role);
        public Task<IdentityResult> RemoveAccountAsync(string id);
        public Task<IdentityResult> DisableAccountAsync(string id);
        public Task<List<Account>> SearchAccountsByAddressAsync(string address);
        public Task<List<Account>> SearchAccountsBySalaryAsync(float minSalary,float maxSalary);
        public Task<IdentityResult> SignUpSellerAsync(SignUpSeller signUp);
        public Task<List<Account>> SearchShipperByAddressAsync(string address);
        public Task<Account> GetUserByIdAsync(string id);
    }
}

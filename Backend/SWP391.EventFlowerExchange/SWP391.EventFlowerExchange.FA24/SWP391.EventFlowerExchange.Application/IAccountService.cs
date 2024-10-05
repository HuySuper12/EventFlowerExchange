using Microsoft.AspNetCore.Identity;
using SWP391.EventFlowerExchange.Domain.Entities;
using SWP391.EventFlowerExchange.Domain.ObjectValues;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWP391.EventFlowerExchange.Application
{
    public interface IAccountService
    {
        public Task<IdentityResult> SignUpBuyerFromAPIAsync(SignUp signUp);
        public Task<string> SignInFromAPIAsync(SignIn signIn);
        public Task<List<Account>> ViewAllAccountFromAPIAsync();
        public Task<List<Account>> ViewAllAccountByRoleFromAPIAsync(string role);
        public Task<IdentityResult> CreateStaffAccountFromAPIAsync(SignUpStaff staff);
        public Task<IdentityResult> CreateShipperAccountFromAPIAsync(SignUpShipper shipper);
        public Task<IdentityResult> RemoveAccountFromAPIAsync(Account account);
        public Task<IdentityResult> DeleteAccountFromAPIAsync(Account account);
        public Task<List<Account>> SearchAccountsByAddressFromAPIAsync(string address);
        public Task<List<Account>> SearchAccountsBySalaryFromAPIAsync(float minSalary, float maxSalary);
        public Task<IdentityResult> SignUpSellerFromAPIAsync(SignUpSeller signUp);
        public Task<List<Account>> SearchShipperByAddressFromAPIAsync(string address);
        public Task<Account> GetUserByIdFromAPIAsync(Account account);
    }
}

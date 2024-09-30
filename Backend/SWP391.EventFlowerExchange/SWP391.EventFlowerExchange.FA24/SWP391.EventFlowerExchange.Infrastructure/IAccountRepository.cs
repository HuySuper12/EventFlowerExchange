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
        public Task<IdentityResult> CreateStaffAccount(SignUpStaff staff);
        public Task<string> SignInAsync(SignIn signIn);
        public Task<List<Account>> ViewAllAccount();
        public Task<List<Account>> ViewAllAccountByRole(string role);
        public Task<IdentityResult> RemoveAccount(string id);

    }
}

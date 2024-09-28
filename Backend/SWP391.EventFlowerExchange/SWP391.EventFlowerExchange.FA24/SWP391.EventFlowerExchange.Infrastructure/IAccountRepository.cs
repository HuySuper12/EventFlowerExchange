using SWP391.EventFlowerExchange.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWP391.EventFlowerExchange.Infrastructure
{
    public interface IAccountRepository
    {
        public Task<IdentityResult> SignUpBuyerAsync(SignUp signUp);
        public Task<string> SignInAsync(SignIn signIn);
    }
}

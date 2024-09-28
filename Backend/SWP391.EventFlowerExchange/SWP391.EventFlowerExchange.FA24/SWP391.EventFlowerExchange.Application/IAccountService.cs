using Microsoft.AspNetCore.Identity;
using SWP391.EventFlowerExchange.Domain.Entities;
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
    }
}

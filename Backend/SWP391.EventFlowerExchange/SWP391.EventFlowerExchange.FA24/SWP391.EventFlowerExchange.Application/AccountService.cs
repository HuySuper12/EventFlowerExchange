using Microsoft.AspNetCore.Identity;
using SWP391.EventFlowerExchange.Domain.Entities;
using SWP391.EventFlowerExchange.Domain.ObjectValues;
using SWP391.EventFlowerExchange.Infrastructure;

namespace SWP391.EventFlowerExchange.Application
{
    public class AccountService : IAccountService
    {
        private IAccountRepository _repo;

        public AccountService(IAccountRepository repo)
        {
            _repo = repo;
        }

        public async Task<IdentityResult> CreateStaffAccount(SignUpStaff staff)
        {
            return await _repo.CreateStaffAccount(staff);
        }

        public Task<IdentityResult> RemoveAccount(string id)
        {
            return _repo.RemoveAccount(id);
        }

        public async Task<string> SignInFromAPIAsync(SignIn signIn)
        {
            return await _repo.SignInAsync(signIn);
        }

        public async Task<IdentityResult> SignUpBuyerFromAPIAsync(SignUp signUp)
        {
            return await _repo.SignUpBuyerAsync(signUp);
        }

        public async Task<List<Account>> ViewAllAccount()
        {
            return await _repo.ViewAllAccount();
        }

        public async Task<List<Account>> ViewAllAccountByRole(string role)
        {
            return await _repo.ViewAllAccountByRole(role);
        }
    }
}

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

        public async Task<IdentityResult> CreateStaffAccountFromAPIAsync(SignUpStaff staff)
        {
            return await _repo.CreateStaffAccountAsync(staff);
        }

        public async Task<IdentityResult> DisableAccountFromAPIAsync(string id)
        {
            return await _repo.DisableAccountAsync(id);
        }

        public async Task<IdentityResult> RemoveAccountFromAPIAsync(string id)
        {
            return await _repo.RemoveAccountAsync(id);
        }

        public async Task<List<Account>> SearchAccountsByAddressFromAPIAsync(string address)
        {
            return await _repo.SearchAccountsByAddressAsync(address);
        }

        public async Task<List<Account>> SearchAccountsBySalaryFromAPIAsync(float minSalary, float maxSalary)
        {
            return await _repo.SearchAccountsBySalaryAsync(minSalary, maxSalary);
        }

        public async Task<string> SignInFromAPIAsync(SignIn signIn)
        {
            return await _repo.SignInAsync(signIn);
        }

        public async Task<IdentityResult> SignUpBuyerFromAPIAsync(SignUp signUp)
        {
            return await _repo.SignUpBuyerAsync(signUp);
        }

        public async Task<List<Account>> ViewAllAccountFromAPIAsync()
        {
            return await _repo.ViewAllAccountAsync();
        }

        public async Task<List<Account>> ViewAllAccountByRoleFromAPIAsync(string role)
        {
            return await _repo.ViewAllAccountByRoleAsync(role);
        }

        public async Task<IdentityResult> SignUpSellerFromAPIAsync(SignUpSeller signUp)
        {
            return await _repo.SignUpSellerAsync(signUp);
        }

        public async Task<IdentityResult> CreateShipperAccountFromAPIAsync(SignUpShipper shipper)
        {
            return await _repo.CreateShipperAccountAsync(shipper);
        }

        public async Task<List<Account>> SearchShipperByAddressFromAPIAsync(string address)
        {
            return await _repo.SearchShipperByAddressAsync(address);
        }

        public async Task<Account> GetUserByIdFromAPIAsync(string id)
        {
            return await _repo.GetUserByIdAsync(id);
        }
    }
}

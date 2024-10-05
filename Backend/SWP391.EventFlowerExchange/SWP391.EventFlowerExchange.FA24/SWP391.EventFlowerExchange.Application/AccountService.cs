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

        public async Task<IdentityResult> DeleteAccountFromAPIAsync(Account account)
        {
            return await _repo.DeleteAccountAsync(account);
        }

        public async Task<IdentityResult> RemoveAccountFromAPIAsync(Account account)
        {
            return await _repo.RemoveAccountAsync(account);
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

        public async Task<Account> GetUserByIdFromAPIAsync(Account account)
        {
            return await _repo.GetUserByIdAsync(account);
        }
    }
}

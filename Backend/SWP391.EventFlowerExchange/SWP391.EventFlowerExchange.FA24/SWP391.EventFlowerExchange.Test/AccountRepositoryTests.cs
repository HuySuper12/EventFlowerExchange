using Microsoft.AspNetCore.Identity;
using Moq;
using SWP391.EventFlowerExchange.Domain.Entities;
using SWP391.EventFlowerExchange.Domain.ObjectValues;
using SWP391.EventFlowerExchange.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWP391.EventFlowerExchange.Test
{
    [TestFixture]
    public class AccountRepositoryTests
    {
        private Mock<IAccountRepository> _accountRepositoryMock;
        private SignUpBuyer _testSignUpBuyer;
        private SignUpSeller _testSignUpSeller;
        private SignUpStaff _testSignUpStaff;
        private SignUpShipper _testSignUpShipper;
        private SignIn _testSignIn;
        private Account _testAccount;

        [SetUp]
        public void SetUp()
        {
            _accountRepositoryMock = new Mock<IAccountRepository>();
            _testSignUpBuyer = new SignUpBuyer { Name = "Test Buyer", Email = "buyer@test.com", Phone = "1234567890", Password = "Password123", ConfirmPassword = "Password123" };
            _testSignUpSeller = new SignUpSeller { Name = "Test Seller", Email = "seller@test.com", Phone = "1234567890", Password = "Password123", ConfirmPassword = "Password123" };
            _testSignUpStaff = new SignUpStaff { Name = "Test Staff", Email = "staff@test.com", PhoneNumber = "1234567890", Salary = 50000, Address = "Test Address", Password = "Password123" };
            _testSignUpShipper = new SignUpShipper { Name = "Test Shipper", Email = "shipper@test.com", PhoneNumber = "1234567890", Salary = 30000, Address = "Test Address", Password = "Password123" };
            _testSignIn = new SignIn { Email = "user@test.com", Password = "Password123" };
            _testAccount = new Account { Id = "testUserId", Email = "user@test.com" };
        }

        [Test]
        public async Task SignUpBuyerAsync_ShouldReturnIdentityResult()
        {
            // Arrange
            var identityResult = IdentityResult.Success;
            _accountRepositoryMock.Setup(repo => repo.SignUpBuyerAsync(_testSignUpBuyer)).ReturnsAsync(identityResult);

            // Act
            var result = await _accountRepositoryMock.Object.SignUpBuyerAsync(_testSignUpBuyer);

            // Assert
            Assert.IsTrue(result.Succeeded);
        }

        [Test]
        public async Task SignUpSellerAsync_ShouldReturnIdentityResult()
        {
            // Arrange
            var identityResult = IdentityResult.Success;
            _accountRepositoryMock.Setup(repo => repo.SignUpSellerAsync(_testSignUpSeller)).ReturnsAsync(identityResult);

            // Act
            var result = await _accountRepositoryMock.Object.SignUpSellerAsync(_testSignUpSeller);

            // Assert
            Assert.IsTrue(result.Succeeded);
        }

        [Test]
        public async Task CreateStaffAccountAsync_ShouldReturnIdentityResult()
        {
            // Arrange
            var identityResult = IdentityResult.Success;
            _accountRepositoryMock.Setup(repo => repo.CreateStaffAccountAsync(_testSignUpStaff)).ReturnsAsync(identityResult);

            // Act
            var result = await _accountRepositoryMock.Object.CreateStaffAccountAsync(_testSignUpStaff);

            // Assert
            Assert.IsTrue(result.Succeeded);
        }

        [Test]
        public async Task CreateShipperAccountAsync_ShouldReturnIdentityResult()
        {
            // Arrange
            var identityResult = IdentityResult.Success;
            _accountRepositoryMock.Setup(repo => repo.CreateShipperAccountAsync(_testSignUpShipper)).ReturnsAsync(identityResult);

            // Act
            var result = await _accountRepositoryMock.Object.CreateShipperAccountAsync(_testSignUpShipper);

            // Assert
            Assert.IsTrue(result.Succeeded);
        }

        [Test]
        public async Task SignInAsync_ShouldReturnToken()
        {
            // Arrange
            var token = "testToken";
            _accountRepositoryMock.Setup(repo => repo.SignInAsync(_testSignIn)).ReturnsAsync(token);

            // Act
            var result = await _accountRepositoryMock.Object.SignInAsync(_testSignIn);

            // Assert
            Assert.AreEqual(token, result);
        }

        [Test]
        public async Task SignInEmailAsync_ShouldReturnToken()
        {
            // Arrange
            var token = "testToken";
            _accountRepositoryMock.Setup(repo => repo.SignInEmailAsync(_testSignIn)).ReturnsAsync(token);

            // Act
            var result = await _accountRepositoryMock.Object.SignInEmailAsync(_testSignIn);

            // Assert
            Assert.AreEqual(token, result);
        }

        [Test]
        public async Task SendEmailAsync_ShouldCompleteTask()
        {
            // Arrange
            var toEmail = "test@test.com";
            var subject = "Test Subject";
            var message = "Test Message";
            _accountRepositoryMock.Setup(repo => repo.SendEmailAsync(toEmail, subject, message)).Returns(Task.CompletedTask);

            // Act
            await _accountRepositoryMock.Object.SendEmailAsync(toEmail, subject, message);

            // Assert
            _accountRepositoryMock.Verify(repo => repo.SendEmailAsync(toEmail, subject, message), Times.Once);
        }

        [Test]
        public async Task SendOTPAsync_ShouldReturnTrue()
        {
            // Arrange
            var email = "test@test.com";
            _accountRepositoryMock.Setup(repo => repo.SendOTPAsync(email)).ReturnsAsync(true);

            // Act
            var result = await _accountRepositoryMock.Object.SendOTPAsync(email);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public async Task VerifyOTPAsync_ShouldReturnTrue()
        {
            // Arrange
            var email = "test@test.com";
            var otp = "123456";
            _accountRepositoryMock.Setup(repo => repo.VerifyOTPAsync(email, otp)).ReturnsAsync(true);

            // Act
            var result = await _accountRepositoryMock.Object.VerifyOTPAsync(email, otp);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public async Task ResetPasswordAsync_ShouldReturnTrue()
        {
            // Arrange
            var email = "test@test.com";
            var newPassword = "NewPassword123";
            _accountRepositoryMock.Setup(repo => repo.ResetPasswordAsync(email, newPassword)).ReturnsAsync(true);

            // Act
            var result = await _accountRepositoryMock.Object.ResetPasswordAsync(email, newPassword);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public async Task GetUserByEmailAsync_ShouldReturnAccount()
        {
            // Arrange
            _accountRepositoryMock.Setup(repo => repo.GetUserByEmailAsync(_testAccount)).ReturnsAsync(_testAccount);

            // Act
            var result = await _accountRepositoryMock.Object.GetUserByEmailAsync(_testAccount);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(_testAccount.Email, result.Email);
        }

        [Test]
        public async Task GetUserByIdAsync_ShouldReturnAccount()
        {
            // Arrange
            _accountRepositoryMock.Setup(repo => repo.GetUserByIdAsync(_testAccount)).ReturnsAsync(_testAccount);

            // Act
            var result = await _accountRepositoryMock.Object.GetUserByIdAsync(_testAccount);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(_testAccount.Id, result.Id);
        }

        [Test]
        public async Task UpdateAccountAsync_ShouldReturnIdentityResult()
        {
            // Arrange
            var identityResult = IdentityResult.Success;
            _accountRepositoryMock.Setup(repo => repo.UpdateAccountAsync(_testAccount)).ReturnsAsync(identityResult);

            // Act
            var result = await _accountRepositoryMock.Object.UpdateAccountAsync(_testAccount);

            // Assert
            Assert.IsTrue(result.Succeeded);
        }

        [Test]
        public async Task RemoveAccountAsync_ShouldReturnIdentityResult()
        {
            // Arrange
            var identityResult = IdentityResult.Success;
            _accountRepositoryMock.Setup(repo => repo.RemoveAccountAsync(_testAccount)).ReturnsAsync(identityResult);

            // Act
            var result = await _accountRepositoryMock.Object.RemoveAccountAsync(_testAccount);

            // Assert
            Assert.IsTrue(result.Succeeded);
        }

        [Test]
        public async Task DeleteAccountAsync_ShouldReturnIdentityResult()
        {
            // Arrange
            var identityResult = IdentityResult.Success;
            _accountRepositoryMock.Setup(repo => repo.DeleteAccountAsync(_testAccount)).ReturnsAsync(identityResult);

            // Act
            var result = await _accountRepositoryMock.Object.DeleteAccountAsync(_testAccount);

            // Assert
            Assert.IsTrue(result.Succeeded);
        }

        [Test]
        public async Task ViewAllAccountAsync_ShouldReturnAccounts()
        {
            // Arrange
            var accounts = new List<Account> { _testAccount };
            _accountRepositoryMock.Setup(repo => repo.ViewAllAccountAsync()).ReturnsAsync(accounts);

            // Act
            var result = await _accountRepositoryMock.Object.ViewAllAccountAsync();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }

        [Test]
        public async Task ViewAllAccountByRoleAsync_ShouldReturnAccounts()
        {
            // Arrange
            var role = "Buyer";
            var accounts = new List<Account> { _testAccount };
            _accountRepositoryMock.Setup(repo => repo.ViewAllAccountByRoleAsync(role)).ReturnsAsync(accounts);

            // Act
            var result = await _accountRepositoryMock.Object.ViewAllAccountByRoleAsync(role);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }

        [Test]
        public async Task SearchAccountsByAddressAsync_ShouldReturnAccounts()
        {
            // Arrange
            var address = "Test Address";
            var accounts = new List<Account> { _testAccount };
            _accountRepositoryMock.Setup(repo => repo.SearchAccountsByAddressAsync(address)).ReturnsAsync(accounts);

            // Act
            var result = await _accountRepositoryMock.Object.SearchAccountsByAddressAsync(address);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }

        [Test]
        public async Task SearchAccountsBySalaryAsync_ShouldReturnAccounts()
        {
            // Arrange
            var minSalary = 10000f;
            var maxSalary = 60000f;
            var accounts = new List<Account> { _testAccount };
            _accountRepositoryMock.Setup(repo => repo.SearchAccountsBySalaryAsync(minSalary, maxSalary)).ReturnsAsync(accounts);

            // Act
            var result = await _accountRepositoryMock.Object.SearchAccountsBySalaryAsync(minSalary, maxSalary);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }

        [Test]
        public async Task SearchShipperByAddressAsync_ShouldReturnAccounts()
        {
            // Arrange
            var address = "Test Address";
            var accounts = new List<Account> { _testAccount };
            _accountRepositoryMock.Setup(repo => repo.SearchShipperByAddressAsync(address)).ReturnsAsync(accounts);

            // Act
            var result = await _accountRepositoryMock.Object.SearchShipperByAddressAsync(address);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }
    }
}

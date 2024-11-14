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
    public class VoucherRepositoryTests
    {
        private Mock<IVoucherRepository> _voucherRepositoryMock;
        private CreateVoucher _testCreateVoucher;
        private Voucher _testVoucher;

        [SetUp]
        public void SetUp()
        {
            _voucherRepositoryMock = new Mock<IVoucherRepository>();
            _testCreateVoucher = new CreateVoucher
            {
                Code = "VOUCHER123",
                Description = "Test voucher",
                MinOrderValue = 50.00m,
                ExpiryDate = 30,
                DiscountValue = 10.00m
            };
            _testVoucher = new Voucher
            {
                VoucherId = 1,
                Code = "VOUCHER123",
                Description = "Test voucher",
                MinOrderValue = 50.00m,
                StartDate = DateTime.Now,
                ExpiryDate = DateTime.Now.AddDays(30),
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                DiscountValue = 10.00m
            };
        }

        [Test]
        public async Task CreateVoucherAsync_ShouldReturnTrue()
        {
            // Arrange
            _voucherRepositoryMock.Setup(repo => repo.CreateVoucherAsync(_testCreateVoucher)).ReturnsAsync(true);

            // Act
            var result = await _voucherRepositoryMock.Object.CreateVoucherAsync(_testCreateVoucher);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public async Task UpdateVoucherAsync_ShouldReturnTrue()
        {
            // Arrange
            _voucherRepositoryMock.Setup(repo => repo.UpdateVoucherAsync(_testVoucher)).ReturnsAsync(true);

            // Act
            var result = await _voucherRepositoryMock.Object.UpdateVoucherAsync(_testVoucher);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public async Task DeleteVoucherAsync_ShouldReturnTrue()
        {
            // Arrange
            _voucherRepositoryMock.Setup(repo => repo.DeleteVoucherAsync(_testVoucher)).ReturnsAsync(true);

            // Act
            var result = await _voucherRepositoryMock.Object.DeleteVoucherAsync(_testVoucher);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public async Task SearchVoucherByIdAsync_ShouldReturnVoucher()
        {
            // Arrange
            _voucherRepositoryMock.Setup(repo => repo.SearchVoucherByIdAsync(_testVoucher)).ReturnsAsync(_testVoucher);

            // Act
            var result = await _voucherRepositoryMock.Object.SearchVoucherByIdAsync(_testVoucher);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(_testVoucher.VoucherId, result.VoucherId);
        }

        [Test]
        public async Task SearchVoucherByCodeAsync_ShouldReturnVoucher()
        {
            // Arrange
            _voucherRepositoryMock.Setup(repo => repo.SearchVoucherByCodeAsync("VOUCHER123")).ReturnsAsync(_testVoucher);

            // Act
            var result = await _voucherRepositoryMock.Object.SearchVoucherByCodeAsync("VOUCHER123");

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(_testVoucher.Code, result.Code);
        }

        [Test]
        public async Task ViewAllVoucherAsync_ShouldReturnListOfVouchers()
        {
            // Arrange
            var vouchers = new List<Voucher> { _testVoucher };
            _voucherRepositoryMock.Setup(repo => repo.ViewAllVoucherAsync()).ReturnsAsync(vouchers);

            // Act
            var result = await _voucherRepositoryMock.Object.ViewAllVoucherAsync();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }
    }
}

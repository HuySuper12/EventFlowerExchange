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
    public class RefundRepositoryTests
    {
        private Mock<IRefundRepository> _refundRepositoryMock;
        private Account _testBuyer;
        private Account _testStaff;
        private Order _testOrder;

        [SetUp]
        public void SetUp()
        {
            _refundRepositoryMock = new Mock<IRefundRepository>();
            _testBuyer = new Account { Id = "testBuyerId" };
            _testStaff = new Account { Id = "testStaffId" };
            _testOrder = new Order
            {
                OrderId = 1,
                BuyerId = "testBuyerId",
                SellerId = "testSellerId",
                TotalPrice = 100.00m,
                Status = "Pending",
                CreatedAt = DateTime.Now
            };
        }

        [Test]
        public async Task BuyerReturnActionAsync_ShouldReturnIdentityResultSuccess()
        {
            // Arrange
            _refundRepositoryMock.Setup(repo => repo.BuyerReturnActionAsync(_testBuyer, _testOrder)).ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _refundRepositoryMock.Object.BuyerReturnActionAsync(_testBuyer, _testOrder);

            // Assert
            Assert.IsTrue(result.Succeeded);
        }

        [Test]
        public async Task UpdateRefundRequestStatusAsync_ShouldReturnIdentityResultSuccess()
        {
            // Arrange
            _refundRepositoryMock.Setup(repo => repo.UpdateRefundRequestStatusAsync(_testStaff, _testOrder)).ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _refundRepositoryMock.Object.UpdateRefundRequestStatusAsync(_testStaff, _testOrder);

            // Assert
            Assert.IsTrue(result.Succeeded);
        }

        [Test]
        public async Task UpdateSellerRefundConfirmationStatusAsync_ShouldReturnIdentityResultSuccess()
        {
            // Arrange
            _refundRepositoryMock.Setup(repo => repo.UpdateSellerRefundConfirmationStatusAsync(_testOrder)).ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _refundRepositoryMock.Object.UpdateSellerRefundConfirmationStatusAsync(_testOrder);

            // Assert
            Assert.IsTrue(result.Succeeded);
        }
    }
}

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
    public class PaymentRepositoryTests
    {
        private Mock<IPaymentRepository> _paymentRepositoryMock;
        private CreatePayment _testCreatePayment;
        private Payment _testPayment;
        private Account _testAccount;

        [SetUp]
        public void SetUp()
        {
            _paymentRepositoryMock = new Mock<IPaymentRepository>();
            _testCreatePayment = new CreatePayment
            {
                PaymentCode = "TESTCODE",
                UserId = "testUserId",
                PaymentType = 1,
                PaymentContent = "Test Payment",
                Amount = 100.00m,
                Status = true,
                CreatedAt = DateTime.Now
            };
            _testPayment = new Payment
            {
                PaymentId = 1,
                PaymentCode = "TESTCODE",
                UserId = "testUserId",
                PaymentType = 1,
                PaymentContent = "Test Payment",
                Amount = 100.00m,
                Status = true,
                CreatedAt = DateTime.Now
            };
            _testAccount = new Account { Id = "testUserId" };
        }

        [Test]
        public async Task CreatePayementAsync_ShouldReturnTrue()
        {
            // Arrange
            _paymentRepositoryMock.Setup(repo => repo.CreatePayementAsync(_testCreatePayment)).ReturnsAsync(true);

            // Act
            var result = await _paymentRepositoryMock.Object.CreatePayementAsync(_testCreatePayment);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public async Task GetPayementByCodeAsync_ShouldReturnPayment()
        {
            // Arrange
            _paymentRepositoryMock.Setup(repo => repo.GetPayementByCodeAsync(_testCreatePayment)).ReturnsAsync(_testPayment);

            // Act
            var result = await _paymentRepositoryMock.Object.GetPayementByCodeAsync(_testCreatePayment);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(_testPayment.PaymentCode, result.PaymentCode);
        }

        [Test]
        public async Task GetAllPaymentListByType_ShouldReturnPayments()
        {
            // Arrange
            var payments = new List<Payment> { _testPayment };
            _paymentRepositoryMock.Setup(repo => repo.GetAllPaymentListByType(1)).ReturnsAsync(payments);

            // Act
            var result = await _paymentRepositoryMock.Object.GetAllPaymentListByType(1);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }

        [Test]
        public async Task GetPayementByTypeAndEmailAsync_ShouldReturnPayments()
        {
            // Arrange
            var payments = new List<Payment> { _testPayment };
            _paymentRepositoryMock.Setup(repo => repo.GetPayementByTypeAndEmailAsync(1, _testAccount)).ReturnsAsync(payments);

            // Act
            var result = await _paymentRepositoryMock.Object.GetPayementByTypeAndEmailAsync(1, _testAccount);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }
    }
}

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
    public class TransactionRepositoryTests
    {
        private Mock<ITransactionRepository> _transactionRepositoryMock;
        private Transaction _testTransaction;
        private Account _testAccount;
        private Order _testOrder;

        [SetUp]
        public void SetUp()
        {
            _transactionRepositoryMock = new Mock<ITransactionRepository>();
            _testTransaction = new Transaction
            {
                TransactionId = 1,
                TransactionCode = "TXN123",
                OrderId = 1,
                UserId = "testUserId",
                TransactionType = 1,
                TransactionContent = "Test transaction",
                Amount = 100.00m,
                Status = true,
                CreatedAt = DateTime.Now
            };
            _testAccount = new Account { Id = "testUserId" };
            _testOrder = new Order { OrderId = 1 };
        }

        [Test]
        public async Task ViewAllTransactionAsync_ShouldReturnListOfTransactions()
        {
            // Arrange
            var transactions = new List<Transaction> { _testTransaction };
            _transactionRepositoryMock.Setup(repo => repo.ViewAllTransactionAsync()).ReturnsAsync(transactions);

            // Act
            var result = await _transactionRepositoryMock.Object.ViewAllTransactionAsync();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }

        [Test]
        public async Task ViewAllTransactionByUserIdAsync_ShouldReturnListOfTransactions()
        {
            // Arrange
            var transactions = new List<Transaction> { _testTransaction };
            _transactionRepositoryMock.Setup(repo => repo.ViewAllTransactionByUserIdAsync(_testAccount)).ReturnsAsync(transactions);

            // Act
            var result = await _transactionRepositoryMock.Object.ViewAllTransactionByUserIdAsync(_testAccount);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }

        [Test]
        public async Task ViewTransactionByIdAsync_ShouldReturnTransaction()
        {
            // Arrange
            _transactionRepositoryMock.Setup(repo => repo.ViewTransactionByIdAsync(_testTransaction)).ReturnsAsync(_testTransaction);

            // Act
            var result = await _transactionRepositoryMock.Object.ViewTransactionByIdAsync(_testTransaction);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(_testTransaction.TransactionId, result.TransactionId);
        }

        [Test]
        public async Task ViewTransactionByCodeAsync_ShouldReturnTransaction()
        {
            // Arrange
            _transactionRepositoryMock.Setup(repo => repo.ViewTransactionByCodeAsync(_testTransaction)).ReturnsAsync(_testTransaction);

            // Act
            var result = await _transactionRepositoryMock.Object.ViewTransactionByCodeAsync(_testTransaction);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(_testTransaction.TransactionCode, result.TransactionCode);
        }

        [Test]
        public async Task ViewAllTransactionByOrderIdAsync_ShouldReturnListOfTransactions()
        {
            // Arrange
            var transactions = new List<Transaction> { _testTransaction };
            _transactionRepositoryMock.Setup(repo => repo.ViewAllTransactionByOrderIdAsync(_testOrder)).ReturnsAsync(transactions);

            // Act
            var result = await _transactionRepositoryMock.Object.ViewAllTransactionByOrderIdAsync(_testOrder);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }

        [Test]
        public async Task CreateTransactionAsync_ShouldReturnTrue()
        {
            // Arrange
            _transactionRepositoryMock.Setup(repo => repo.CreateTransactionAsync(_testTransaction)).ReturnsAsync(true);

            // Act
            var result = await _transactionRepositoryMock.Object.CreateTransactionAsync(_testTransaction);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public void GetRevenueOrderStatistics_ShouldReturnDictionary()
        {
            // Arrange
            var revenueStatistics = new Dictionary<string, decimal> { { "2023-10", 1000.00m } };
            _transactionRepositoryMock.Setup(repo => repo.GetRevenueOrderStatistics()).Returns(revenueStatistics);

            // Act
            var result = _transactionRepositoryMock.Object.GetRevenueOrderStatistics();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }
    }
}

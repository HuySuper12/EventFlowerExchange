using NUnit.Framework;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using SWP391.EventFlowerExchange.Domain.Entities;
using SWP391.EventFlowerExchange.Infrastructure;
using SWP391.EventFlowerExchange.Domain.ObjectValues;

namespace SWP391.EventFlowerExchange.Tests
{
    [TestFixture]
    public class DeliveryLogRepositoryTests
    {
        private Mock<IDeliveryLogRepository> _deliveryLogRepositoryMock;
        private Account _testAccount;
        private Order _testOrder;
        private DeliveryLog _testDeliveryLog;

        [SetUp]
        public void SetUp()
        {
            _deliveryLogRepositoryMock = new Mock<IDeliveryLogRepository>();
            _testAccount = new Account { Id = "testUserId" };
            _testOrder = new Order { OrderId = 1 };
            _testDeliveryLog = new DeliveryLog { LogId = 1, OrderId = 1, DeliveryPersonId = "testUserId" };
        }

        [Test]
        public async Task ViewAllDeliveryLogAsync_ShouldReturnDeliveryLogs()
        {
            // Arrange
            var deliveryLogs = new List<DeliveryLog> { _testDeliveryLog };
            _deliveryLogRepositoryMock.Setup(repo => repo.ViewAllDeliveryLogAsync()).ReturnsAsync(deliveryLogs);

            // Act
            var result = await _deliveryLogRepositoryMock.Object.ViewAllDeliveryLogAsync();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }

        [Test]
        public async Task ViewDeliveryLogByShipperIdAsync_ShouldReturnDeliveryLogs()
        {
            // Arrange
            var deliveryLogs = new List<DeliveryLog> { _testDeliveryLog };
            _deliveryLogRepositoryMock.Setup(repo => repo.ViewDeliveryLogByShipperIdAsync(_testAccount)).ReturnsAsync(deliveryLogs);

            // Act
            var result = await _deliveryLogRepositoryMock.Object.ViewDeliveryLogByShipperIdAsync(_testAccount);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }

        [Test]
        public async Task ViewDeliveryLogByOrderIdAsync_ShouldReturnDeliveryLog()
        {
            // Arrange
            _deliveryLogRepositoryMock.Setup(repo => repo.ViewDeliveryLogByOrderIdAsync(_testOrder)).ReturnsAsync(_testDeliveryLog);

            // Act
            var result = await _deliveryLogRepositoryMock.Object.ViewDeliveryLogByOrderIdAsync(_testOrder);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(_testDeliveryLog.LogId, result.LogId);
        }

        [Test]
        public async Task CreateDeliveryLogAsync_ShouldReturnTrue()
        {
            // Arrange
            _deliveryLogRepositoryMock.Setup(repo => repo.CreateDeliveryLogAsync(_testDeliveryLog)).ReturnsAsync(true);

            // Act
            var result = await _deliveryLogRepositoryMock.Object.CreateDeliveryLogAsync(_testDeliveryLog);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public async Task UpdateDeliveryLogStatusAsync_ShouldReturnTrue()
        {
            // Arrange
            _deliveryLogRepositoryMock.Setup(repo => repo.UpdateDeliveryLogStatusAsync(_testDeliveryLog)).ReturnsAsync(true);

            // Act
            var result = await _deliveryLogRepositoryMock.Object.UpdateDeliveryLogStatusAsync(_testDeliveryLog);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public async Task ViewDeliveryTimeAsync_ShouldReturnDeliveryTime()
        {
            // Arrange
            var deliveryTime = new DeliveryTime { TakeOverTime = DateTime.Now };
            _deliveryLogRepositoryMock.Setup(repo => repo.ViewDeliveryTimeAsync(_testOrder)).ReturnsAsync(deliveryTime);

            // Act
            var result = await _deliveryLogRepositoryMock.Object.ViewDeliveryTimeAsync(_testOrder);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(deliveryTime.TakeOverTime, result.TakeOverTime);
        }

        [Test]
        public async Task ViewDeliveryLogDeliveringByShipperIdAsync_ShouldReturnDeliveryLog()
        {
            // Arrange
            _deliveryLogRepositoryMock.Setup(repo => repo.ViewDeliveryLogDeliveringByShipperIdAsync(_testDeliveryLog)).ReturnsAsync(_testDeliveryLog);

            // Act
            var result = await _deliveryLogRepositoryMock.Object.ViewDeliveryLogDeliveringByShipperIdAsync(_testDeliveryLog);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(_testDeliveryLog.LogId, result.LogId);
        }

        [Test]
        public async Task CheckShipperIsFree_ShouldReturnTrue()
        {
            // Arrange
            _deliveryLogRepositoryMock.Setup(repo => repo.CheckShipperIsFree(_testAccount)).ReturnsAsync(true);

            // Act
            var result = await _deliveryLogRepositoryMock.Object.CheckShipperIsFree(_testAccount);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public async Task ViewDeliveryLogDeliveringByOrderIdAsync_ShouldReturnDeliveryLog()
        {
            // Arrange
            _deliveryLogRepositoryMock.Setup(repo => repo.ViewDeliveryLogDeliveringByOrderIdAsync(_testOrder)).ReturnsAsync(_testDeliveryLog);

            // Act
            var result = await _deliveryLogRepositoryMock.Object.ViewDeliveryLogDeliveringByOrderIdAsync(_testOrder);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(_testDeliveryLog.LogId, result.LogId);
        }
    }
}

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
    public class NotificationRepositoryTests
    {
        private Mock<INotificationRepository> _notificationRepositoryMock;
        private Account _testAccount;
        private Notification _testNotification;
        private CreateNotification _testCreateNotification;
        private ShopNotification _testShopNotification;
        private CreateShopNotification _testCreateShopNotification;

        [SetUp]
        public void SetUp()
        {
            _notificationRepositoryMock = new Mock<INotificationRepository>();
            _testAccount = new Account { Id = "testUserId" };
            _testNotification = new Notification { NotificationId = 1, UserId = "testUserId" };
            _testCreateNotification = new CreateNotification { UserEmail = "user@example.com", Content = "Test content" };
            _testShopNotification = new ShopNotification { ShopNotificationId = 1, FollowerId = "testUserId", SellerId = "testSellerId" };
            _testCreateShopNotification = new CreateShopNotification { FollowerẸmail = "follower@example.com", SellerEmail = "seller@example.com", Content = "Test shop content" };
        }

        [Test]
        public async Task ViewAllNotificationAsync_ShouldReturnNotifications()
        {
            // Arrange
            var notifications = new List<Notification> { _testNotification };
            _notificationRepositoryMock.Setup(repo => repo.ViewAllNotificationAsync()).ReturnsAsync(notifications);

            // Act
            var result = await _notificationRepositoryMock.Object.ViewAllNotificationAsync();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }

        [Test]
        public async Task ViewAllNotificationByUserIdAsync_ShouldReturnNotifications()
        {
            // Arrange
            var notifications = new List<Notification> { _testNotification };
            _notificationRepositoryMock.Setup(repo => repo.ViewAllNotificationByUserIdAsync(_testAccount)).ReturnsAsync(notifications);

            // Act
            var result = await _notificationRepositoryMock.Object.ViewAllNotificationByUserIdAsync(_testAccount);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }

        [Test]
        public async Task ViewNotificationByIdAsync_ShouldReturnNotification()
        {
            // Arrange
            _notificationRepositoryMock.Setup(repo => repo.ViewNotificationByIdAsync(_testNotification)).ReturnsAsync(_testNotification);

            // Act
            var result = await _notificationRepositoryMock.Object.ViewNotificationByIdAsync(_testNotification);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(_testNotification.NotificationId, result.NotificationId);
        }

        [Test]
        public async Task CreateNotificationAsync_ShouldReturnIdentityResultSuccess()
        {
            // Arrange
            _notificationRepositoryMock.Setup(repo => repo.CreateNotificationAsync(_testCreateNotification)).ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _notificationRepositoryMock.Object.CreateNotificationAsync(_testCreateNotification);

            // Assert
            Assert.IsTrue(result.Succeeded);
        }

        [Test]
        public async Task CountNotificationsByEmailAsync_ShouldReturnCount()
        {
            // Arrange
            _notificationRepositoryMock.Setup(repo => repo.CountNotificationsByEmailAsync(_testAccount)).ReturnsAsync(5);

            // Act
            var result = await _notificationRepositoryMock.Object.CountNotificationsByEmailAsync(_testAccount);

            // Assert
            Assert.AreEqual(5, result);
        }

        [Test]
        public async Task ViewAllShopNotificationAsync_ShouldReturnShopNotifications()
        {
            // Arrange
            var shopNotifications = new List<ShopNotification> { _testShopNotification };
            _notificationRepositoryMock.Setup(repo => repo.ViewAllShopNotificationAsync()).ReturnsAsync(shopNotifications);

            // Act
            var result = await _notificationRepositoryMock.Object.ViewAllShopNotificationAsync();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }

        [Test]
        public async Task ViewAllShopNotificationByUserIdAsync_ShouldReturnShopNotifications()
        {
            // Arrange
            var shopNotifications = new List<ShopNotification> { _testShopNotification };
            _notificationRepositoryMock.Setup(repo => repo.ViewAllShopNotificationByUserIdAsync(_testAccount)).ReturnsAsync(shopNotifications);

            // Act
            var result = await _notificationRepositoryMock.Object.ViewAllShopNotificationByUserIdAsync(_testAccount);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }

        [Test]
        public async Task ViewShopNotificationByIdAsync_ShouldReturnShopNotification()
        {
            // Arrange
            _notificationRepositoryMock.Setup(repo => repo.ViewShopNotificationByIdAsync(_testShopNotification)).ReturnsAsync(_testShopNotification);

            // Act
            var result = await _notificationRepositoryMock.Object.ViewShopNotificationByIdAsync(_testShopNotification);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(_testShopNotification.ShopNotificationId, result.ShopNotificationId);
        }

        [Test]
        public async Task CreateShopNotificationAsync_ShouldReturnIdentityResultSuccess()
        {
            // Arrange
            _notificationRepositoryMock.Setup(repo => repo.CreateShopNotificationAsync(_testCreateShopNotification)).ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _notificationRepositoryMock.Object.CreateShopNotificationAsync(_testCreateShopNotification);

            // Assert
            Assert.IsTrue(result.Succeeded);
        }

        [Test]
        public async Task CountShopNotificationByEmailAsync_ShouldReturnCount()
        {
            // Arrange
            _notificationRepositoryMock.Setup(repo => repo.CountShopNotificationByEmailAsync(_testAccount)).ReturnsAsync(5);

            // Act
            var result = await _notificationRepositoryMock.Object.CountShopNotificationByEmailAsync(_testAccount);

            // Assert
            Assert.AreEqual(5, result);
        }
    }
}

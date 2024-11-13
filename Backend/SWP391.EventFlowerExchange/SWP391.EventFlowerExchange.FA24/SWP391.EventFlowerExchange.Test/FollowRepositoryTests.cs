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
    public class FollowRepositoryTests
    {
        private Mock<IFollowRepository> _followRepositoryMock;
        private Account _testAccount;
        private CreateFollower _testCreateFollower;
        private ShopNotification _testShopNotification;
        private Account _testSeller;

        [SetUp]
        public void SetUp()
        {
            _followRepositoryMock = new Mock<IFollowRepository>();
            _testAccount = new Account { Id = "testUserId" };
            _testCreateFollower = new CreateFollower { FollowerEmail = "follower@example.com", SellerEmail = "seller@example.com" };
            _testShopNotification = new ShopNotification { ShopNotificationId = 1, FollowerId = "testUserId", SellerId = "testSellerId" };
            _testSeller = new Account { Id = "testSellerId" };
        }

        [Test]
        public async Task GetFollowerListAsync_ShouldReturnFollowers()
        {
            // Arrange
            var followers = new List<Follow> { new Follow { FollowId = 1, FollowerId = "testUserId", SellerId = "testSellerId" } };
            _followRepositoryMock.Setup(repo => repo.GetFollowerListAsync(_testAccount)).ReturnsAsync(followers);

            // Act
            var result = await _followRepositoryMock.Object.GetFollowerListAsync(_testAccount);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }

        [Test]
        public async Task AddNewFollowerAsync_ShouldReturnIdentityResultSuccess()
        {
            // Arrange
            _followRepositoryMock.Setup(repo => repo.AddNewFollowerAsync(_testCreateFollower)).ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _followRepositoryMock.Object.AddNewFollowerAsync(_testCreateFollower);

            // Assert
            Assert.IsTrue(result.Succeeded);
        }

        [Test]
        public async Task RemoveFollowerAsync_ShouldReturnIdentityResultSuccess()
        {
            // Arrange
            _followRepositoryMock.Setup(repo => repo.RemoveFollowerAsync(_testShopNotification)).ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _followRepositoryMock.Object.RemoveFollowerAsync(_testShopNotification);

            // Assert
            Assert.IsTrue(result.Succeeded);
        }

        [Test]
        public async Task GetCountFollowByUserEmailAsync_ShouldReturnCount()
        {
            // Arrange
            _followRepositoryMock.Setup(repo => repo.GetCountFollowByUserEmailAsync(_testAccount)).ReturnsAsync(5);

            // Act
            var result = await _followRepositoryMock.Object.GetCountFollowByUserEmailAsync(_testAccount);

            // Assert
            Assert.AreEqual(5, result);
        }

        [Test]
        public async Task CheckFollowByUserEmailAsync_ShouldReturnIdentityResultSuccess()
        {
            // Arrange
            _followRepositoryMock.Setup(repo => repo.CheckFollowByUserEmailAsync(_testAccount, _testSeller)).ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _followRepositoryMock.Object.CheckFollowByUserEmailAsync(_testAccount, _testSeller);

            // Assert
            Assert.IsTrue(result.Succeeded);
        }
    }
}

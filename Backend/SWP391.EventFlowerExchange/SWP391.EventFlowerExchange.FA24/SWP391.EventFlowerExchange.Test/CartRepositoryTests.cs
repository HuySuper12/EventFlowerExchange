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
    public class CartRepositoryTests
    {
        private Mock<ICartRepository> _cartRepositoryMock;
        private Account _testAccount;
        private CartItem _testCartItem;

        [SetUp]
        public void SetUp()
        {
            _cartRepositoryMock = new Mock<ICartRepository>();
            _testAccount = new Account { Id = "testUserId" };
            _testCartItem = new CartItem { CartId = 1, ProductId = 1, BuyerId = "testUserId" };
        }

        [Test]
        public async Task ViewAllCartItemByUserIdAsync_ShouldReturnCartItems()
        {
            // Arrange
            var cartItems = new List<GetCartItem> { new GetCartItem { CartId = 1, ProductId = 1, BuyerId = "testUserId" } };
            _cartRepositoryMock.Setup(repo => repo.ViewAllCartItemByUserIdAsync(_testAccount)).ReturnsAsync(cartItems);

            // Act
            var result = await _cartRepositoryMock.Object.ViewAllCartItemByUserIdAsync(_testAccount);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }

        [Test]
        public async Task CreateCartAsync_ShouldReturnIdentityResult()
        {
            // Arrange
            var identityResult = IdentityResult.Success;
            _cartRepositoryMock.Setup(repo => repo.CreateCartAsync(_testAccount)).ReturnsAsync(identityResult);

            // Act
            var result = await _cartRepositoryMock.Object.CreateCartAsync(_testAccount);

            // Assert
            Assert.IsTrue(result.Succeeded);
        }

        [Test]
        public async Task CreateCartItemAsync_ShouldReturnIdentityResult()
        {
            // Arrange
            var identityResult = IdentityResult.Success;
            _cartRepositoryMock.Setup(repo => repo.CreateCartItemAsync(_testCartItem)).ReturnsAsync(identityResult);

            // Act
            var result = await _cartRepositoryMock.Object.CreateCartItemAsync(_testCartItem);

            // Assert
            Assert.IsTrue(result.Succeeded);
        }

        [Test]
        public async Task ViewAllCartAsync_ShouldReturnCarts()
        {
            // Arrange
            var carts = new List<Cart> { new Cart { CartId = 1, BuyerId = "testUserId" } };
            _cartRepositoryMock.Setup(repo => repo.ViewAllCartAsync()).ReturnsAsync(carts);

            // Act
            var result = await _cartRepositoryMock.Object.ViewAllCartAsync();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }

        [Test]
        public async Task RemoveItemFromCartAsync_ShouldReturnIdentityResult()
        {
            // Arrange
            var identityResult = IdentityResult.Success;
            _cartRepositoryMock.Setup(repo => repo.RemoveItemFromCartAsync(_testCartItem)).ReturnsAsync(identityResult);

            // Act
            var result = await _cartRepositoryMock.Object.RemoveItemFromCartAsync(_testCartItem);

            // Assert
            Assert.IsTrue(result.Succeeded);
        }

        [Test]
        public async Task ViewCartItemDetailAsync_ShouldReturnCartItem()
        {
            // Arrange
            _cartRepositoryMock.Setup(repo => repo.ViewCartItemDetailAsync(_testCartItem)).ReturnsAsync(_testCartItem);

            // Act
            var result = await _cartRepositoryMock.Object.ViewCartItemDetailAsync(_testCartItem);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(_testCartItem.CartId, result.CartId);
        }

        [Test]
        public async Task RemoveCartItemToCreateOrderAsync_ShouldReturnTrue()
        {
            // Arrange
            _cartRepositoryMock.Setup(repo => repo.RemoveCartItemToCreateOrderAsync(_testCartItem)).ReturnsAsync(true);

            // Act
            var result = await _cartRepositoryMock.Object.RemoveCartItemToCreateOrderAsync(_testCartItem);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public async Task GetCountCartItemByUserIdAsync_ShouldReturnCount()
        {
            // Arrange
            var count = 5;
            _cartRepositoryMock.Setup(repo => repo.GetCountCartItemByUserIdAsync(_testAccount)).ReturnsAsync(count);

            // Act
            var result = await _cartRepositoryMock.Object.GetCountCartItemByUserIdAsync(_testAccount);

            // Assert
            Assert.AreEqual(count, result);
        }
    }
}

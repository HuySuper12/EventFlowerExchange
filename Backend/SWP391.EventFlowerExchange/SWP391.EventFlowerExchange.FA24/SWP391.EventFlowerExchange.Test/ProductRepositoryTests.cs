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
    public class ProductRepositoryTests
    {
        private Mock<IProductRepository> _productRepositoryMock;
        private CreateProduct _testCreateProduct;
        private GetProduct _testGetProduct;
        private Account _testAccount;

        [SetUp]
        public void SetUp()
        {
            _productRepositoryMock = new Mock<IProductRepository>();
            _testCreateProduct = new CreateProduct
            {
                SellerEmail = "seller@example.com",
                ProductName = "Test Product",
                FreshnessDuration = 10,
                ComboType = "Single",
                Quantity = 5,
                Price = 100.00m,
                Description = "Test Description",
                Category = "Test Category",
                ListImage = new List<string> { "image1.jpg", "image2.jpg" }
            };
            _testGetProduct = new GetProduct
            {
                ProductId = 1,
                ProductName = "Test Product",
                FreshnessDuration = 10,
                ComboType = "Single",
                Quantity = 5,
                Price = 100.00m,
                Description = "Test Description",
                Category = "Test Category",
                CreatedAt = DateTime.Now
            };
            _testAccount = new Account { Id = "testUserId" };
        }

        [Test]
        public async Task GetEnableProductListAsync_ShouldReturnProducts()
        {
            // Arrange
            var products = new List<GetProduct?> { _testGetProduct };
            _productRepositoryMock.Setup(repo => repo.GetEnableProductListAsync()).ReturnsAsync(products);

            // Act
            var result = await _productRepositoryMock.Object.GetEnableProductListAsync();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }

        [Test]
        public async Task CreateNewProductAsync_ShouldReturnTrue()
        {
            // Arrange
            _productRepositoryMock.Setup(repo => repo.CreateNewProductAsync(_testCreateProduct, _testAccount)).ReturnsAsync(true);

            // Act
            var result = await _productRepositoryMock.Object.CreateNewProductAsync(_testCreateProduct, _testAccount);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public async Task RemoveProductAsync_ShouldReturnTrue()
        {
            // Arrange
            _productRepositoryMock.Setup(repo => repo.RemoveProductAsync(_testGetProduct)).ReturnsAsync(true);

            // Act
            var result = await _productRepositoryMock.Object.RemoveProductAsync(_testGetProduct);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public async Task UpdateProductAsync_ShouldReturnTrue()
        {
            // Arrange
            _productRepositoryMock.Setup(repo => repo.UpdateProductAsync(_testGetProduct)).ReturnsAsync(true);

            // Act
            var result = await _productRepositoryMock.Object.UpdateProductAsync(_testGetProduct);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public async Task SearchProductByIdAsync_ShouldReturnProduct()
        {
            // Arrange
            _productRepositoryMock.Setup(repo => repo.SearchProductByIdAsync(_testGetProduct)).ReturnsAsync(_testGetProduct);

            // Act
            var result = await _productRepositoryMock.Object.SearchProductByIdAsync(_testGetProduct);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(_testGetProduct.ProductId, result.ProductId);
        }

        [Test]
        public async Task SearchProductByNameAsync_ShouldReturnProducts()
        {
            // Arrange
            var products = new List<GetProduct?> { _testGetProduct };
            _productRepositoryMock.Setup(repo => repo.SearchProductByNameAsync("Test Product")).ReturnsAsync(products);

            // Act
            var result = await _productRepositoryMock.Object.SearchProductByNameAsync("Test Product");

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }

        [Test]
        public async Task GetEnableProductListBySellerEmailAsync_ShouldReturnProducts()
        {
            // Arrange
            var products = new List<GetProduct?> { _testGetProduct };
            _productRepositoryMock.Setup(repo => repo.GetEnableProductListBySellerEmailAsync(_testAccount)).ReturnsAsync(products);

            // Act
            var result = await _productRepositoryMock.Object.GetEnableProductListBySellerEmailAsync(_testAccount);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }

        [Test]
        public async Task GetDisableProductListBySellerEmailAsync_ShouldReturnProducts()
        {
            // Arrange
            var products = new List<GetProduct?> { _testGetProduct };
            _productRepositoryMock.Setup(repo => repo.GetDisableProductListBySellerEmailAsync(_testAccount)).ReturnsAsync(products);

            // Act
            var result = await _productRepositoryMock.Object.GetDisableProductListBySellerEmailAsync(_testAccount);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }

        [Test]
        public async Task GetExpiredProductListBySellerEmailAsync_ShouldReturnProducts()
        {
            // Arrange
            var products = new List<GetProduct?> { _testGetProduct };
            _productRepositoryMock.Setup(repo => repo.GetExpiredProductListBySellerEmailAsync(_testAccount)).ReturnsAsync(products);

            // Act
            var result = await _productRepositoryMock.Object.GetExpiredProductListBySellerEmailAsync(_testAccount);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }

        [Test]
        public async Task SearchProductImageByIdAsync_ShouldReturnImageProduct()
        {
            // Arrange
            var imageProduct = new ImageProduct { Id = 1, ProductId = 1, LinkImage = "image1.jpg" };
            _productRepositoryMock.Setup(repo => repo.SearchProductImageByIdAsync(_testGetProduct)).ReturnsAsync(imageProduct);

            // Act
            var result = await _productRepositoryMock.Object.SearchProductImageByIdAsync(_testGetProduct);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(imageProduct.Id, result.Id);
        }

        [Test]
        public async Task GetAllOrdersAndRatingBySellerEmail_ShouldReturnProductStatistics()
        {
            // Arrange
            var productStatistics = new ProductStatistics { Order = 10, Rating = 4.5, EnableProducts = 5, SoldOut = 2, AllProduct = 7 };
            _productRepositoryMock.Setup(repo => repo.GetAllOrdersAndRatingBySellerEmail(_testAccount)).ReturnsAsync(productStatistics);

            // Act
            var result = await _productRepositoryMock.Object.GetAllOrdersAndRatingBySellerEmail(_testAccount);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(productStatistics.Order, result.Order);
        }
    }
}

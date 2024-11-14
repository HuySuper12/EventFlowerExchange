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
    public class OrderRepositoryTests
    {
        private Mock<IOrderRepository> _orderRepositoryMock;
        private Account _testAccount;
        private Order _testOrder;
        private GetProduct _testProduct;
        private DeliveryInformation _testDeliveryInformation;
        private Voucher _testVoucher;
        private CreateOrderBySeller _testCreateOrderBySeller;

        [SetUp]
        public void SetUp()
        {
            _orderRepositoryMock = new Mock<IOrderRepository>();
            _testAccount = new Account { Id = "testUserId" };
            _testOrder = new Order { OrderId = 1, BuyerId = "testUserId" };
            _testProduct = new GetProduct { ProductId = 1, ProductName = "Test Product" };
            _testDeliveryInformation = new DeliveryInformation { Email = "user@example.com", PhoneNumber = "1234567890", Address = "Test Address", Product = new List<int> { 1 }, VoucherCode = "TESTVOUCHER" };
            _testVoucher = new Voucher { VoucherId = 1, Code = "TESTVOUCHER" };
            _testCreateOrderBySeller = new CreateOrderBySeller { SellerEmail = "seller@example.com" };
        }

        [Test]
        public async Task ViewAllOrderAsync_ShouldReturnOrders()
        {
            // Arrange
            var orders = new List<Order> { _testOrder };
            _orderRepositoryMock.Setup(repo => repo.ViewAllOrderAsync()).ReturnsAsync(orders);

            // Act
            var result = await _orderRepositoryMock.Object.ViewAllOrderAsync();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }

        [Test]
        public async Task ViewOrderDetailAsync_ShouldReturnOrderDetails()
        {
            // Arrange
            var orderDetails = new List<GetProduct> { _testProduct };
            _orderRepositoryMock.Setup(repo => repo.ViewOrderDetailAsync(_testOrder)).ReturnsAsync(orderDetails);

            // Act
            var result = await _orderRepositoryMock.Object.ViewOrderDetailAsync(_testOrder);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }

        [Test]
        public async Task SearchOrderByOrderIdAsync_ShouldReturnOrder()
        {
            // Arrange
            _orderRepositoryMock.Setup(repo => repo.SearchOrderByOrderIdAsync(_testOrder)).ReturnsAsync(_testOrder);

            // Act
            var result = await _orderRepositoryMock.Object.SearchOrderByOrderIdAsync(_testOrder);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(_testOrder.OrderId, result.OrderId);
        }

        [Test]
        public async Task ViewOrderByBuyerIdAsync_ShouldReturnOrders()
        {
            // Arrange
            var orders = new List<Order> { _testOrder };
            _orderRepositoryMock.Setup(repo => repo.ViewOrderByBuyerIdAsync(_testAccount)).ReturnsAsync(orders);

            // Act
            var result = await _orderRepositoryMock.Object.ViewOrderByBuyerIdAsync(_testAccount);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }

        [Test]
        public async Task ViewOrderBySellerIdAsync_ShouldReturnOrders()
        {
            // Arrange
            var orders = new List<Order> { _testOrder };
            _orderRepositoryMock.Setup(repo => repo.ViewOrderBySellerIdAsync(_testAccount)).ReturnsAsync(orders);

            // Act
            var result = await _orderRepositoryMock.Object.ViewOrderBySellerIdAsync(_testAccount);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }

        [Test]
        public async Task ViewOrderByShipperIdAsync_ShouldReturnOrders()
        {
            // Arrange
            var orders = new List<Order> { _testOrder };
            _orderRepositoryMock.Setup(repo => repo.ViewOrderByShipperIdAsync(_testAccount)).ReturnsAsync(orders);

            // Act
            var result = await _orderRepositoryMock.Object.ViewOrderByShipperIdAsync(_testAccount);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }

        [Test]
        public async Task ViewOrderByStatusAsync_ShouldReturnOrders()
        {
            // Arrange
            var orders = new List<Order> { _testOrder };
            _orderRepositoryMock.Setup(repo => repo.ViewOrderByStatusAsync(_testOrder)).ReturnsAsync(orders);

            // Act
            var result = await _orderRepositoryMock.Object.ViewOrderByStatusAsync(_testOrder);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }

        [Test]
        public async Task CreateOrderAsync_ShouldReturnTrue()
        {
            // Arrange
            _orderRepositoryMock.Setup(repo => repo.CreateOrderAsync(_testDeliveryInformation, _testAccount, new List<int> { 1 }, _testVoucher)).ReturnsAsync(true);

            // Act
            var result = await _orderRepositoryMock.Object.CreateOrderAsync(_testDeliveryInformation, _testAccount, new List<int> { 1 }, _testVoucher);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public async Task CreateOrderBySellerAsync_ShouldReturnTrue()
        {
            // Arrange
            _orderRepositoryMock.Setup(repo => repo.CreateOrderBySellerAsync(_testCreateOrderBySeller, _testAccount, _testProduct)).ReturnsAsync(true);

            // Act
            var result = await _orderRepositoryMock.Object.CreateOrderBySellerAsync(_testCreateOrderBySeller, _testAccount, _testProduct);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public async Task UpdateOrderStatusAsync_ShouldReturnTrue()
        {
            // Arrange
            _orderRepositoryMock.Setup(repo => repo.UpdateOrderStatusAsync(_testOrder)).ReturnsAsync(true);

            // Act
            var result = await _orderRepositoryMock.Object.UpdateOrderStatusAsync(_testOrder);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public void GetMonthlyOrderStatistics_ShouldReturnStatistics()
        {
            // Arrange
            var statistics = new Dictionary<string, int> { { "January", 10 } };
            _orderRepositoryMock.Setup(repo => repo.GetMonthlyOrderStatistics()).Returns(statistics);

            // Act
            var result = _orderRepositoryMock.Object.GetMonthlyOrderStatistics();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }

        [Test]
        public void CheckFeeShipForOrderEvent_ShouldReturnFee()
        {
            // Arrange
            var fee = 10.0m;
            _orderRepositoryMock.Setup(repo => repo.CheckFeeShipForOrderEvent("Test Address")).Returns(fee);

            // Act
            var result = _orderRepositoryMock.Object.CheckFeeShipForOrderEvent("Test Address");

            // Assert
            Assert.AreEqual(fee, result);
        }

        [Test]
        public void CheckFeeShipForOrderBatch_ShouldReturnFee()
        {
            // Arrange
            var fee = 15.0m;
            _orderRepositoryMock.Setup(repo => repo.CheckFeeShipForOrderBatch("Test Address")).Returns(fee);

            // Act
            var result = _orderRepositoryMock.Object.CheckFeeShipForOrderBatch("Test Address");

            // Assert
            Assert.AreEqual(fee, result);
        }

        [Test]
        public async Task CheckFeeShipEventOrBatchAsync_ShouldReturnTrue()
        {
            // Arrange
            _orderRepositoryMock.Setup(repo => repo.CheckFeeShipEventOrBatchAsync(new List<int> { 1 })).ReturnsAsync(true);

            // Act
            var result = await _orderRepositoryMock.Object.CheckFeeShipEventOrBatchAsync(new List<int> { 1 });

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public async Task DivideProductHasSameSellerAsync_ShouldReturnString()
        {
            // Arrange
            var resultString = "Test Result";
            _orderRepositoryMock.Setup(repo => repo.DivideProductHasSameSellerAsync(new List<int> { 1 })).ReturnsAsync(resultString);

            // Act
            var result = await _orderRepositoryMock.Object.DivideProductHasSameSellerAsync(new List<int> { 1 });

            // Assert
            Assert.AreEqual(resultString, result);
        }

        [Test]
        public async Task CheckOutOrderAsync_ShouldReturnCheckOutAfter()
        {
            // Arrange
            var checkOutAfter = new CheckOutAfter();
            _orderRepositoryMock.Setup(repo => repo.CheckOutOrderAsync("Test Address", new List<int> { 1 }, _testVoucher)).ReturnsAsync(checkOutAfter);

            // Act
            var result = await _orderRepositoryMock.Object.CheckOutOrderAsync("Test Address", new List<int> { 1 }, _testVoucher);

            // Assert
            Assert.IsNotNull(result);
        }

        [Test]
        public async Task SearchOrderItemByProductAsync_ShouldReturnOrders()
        {
            // Arrange
            var orders = new List<Order> { _testOrder };
            _orderRepositoryMock.Setup(repo => repo.SearchOrderItemByProductAsync(_testProduct)).ReturnsAsync(orders);

            // Act
            var result = await _orderRepositoryMock.Object.SearchOrderItemByProductAsync(_testProduct);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }

        [Test]
        public async Task SearchOrderItemByProductIdAsync_ShouldReturnOrderItem()
        {
            // Arrange
            var orderItem = new OrderItem();
            _orderRepositoryMock.Setup(repo => repo.SearchOrderItemByProductIdAsync(_testProduct)).ReturnsAsync(orderItem);

            // Act
            var result = await _orderRepositoryMock.Object.SearchOrderItemByProductIdAsync(_testProduct);

            // Assert
            Assert.IsNotNull(result);
        }
    }
}

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
    public class RequestRepositoryTests
    {
        private Mock<IRequestRepository> _requestRepositoryMock;
        private CreateRequest _testCreateRequest;
        private Request _testRequest;
        private Account _testAccount;

        [SetUp]
        public void SetUp()
        {
            _requestRepositoryMock = new Mock<IRequestRepository>();
            _testCreateRequest = new CreateRequest
            {
                RequestId = 1,
                UserId = "testUserId",
                RequestType = "Withdraw",
                Amount = 100.00m,
                Status = "Pending",
                CreatedAt = DateTime.Now,
                Reason = "Test reason"
            };
            _testRequest = new Request
            {
                RequestId = 1,
                UserId = "testUserId",
                RequestType = "Withdraw",
                Amount = 100.00m,
                Status = "Pending",
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                Reason = "Test reason"
            };
            _testAccount = new Account { Id = "testUserId" };
        }

        [Test]
        public async Task CreateRequestAsync_ShouldReturnTrue()
        {
            // Arrange
            _requestRepositoryMock.Setup(repo => repo.CreateRequestAsync(_testCreateRequest)).ReturnsAsync(true);

            // Act
            var result = await _requestRepositoryMock.Object.CreateRequestAsync(_testCreateRequest);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public async Task UpdateRequestAsync_ShouldReturnTrue()
        {
            // Arrange
            _requestRepositoryMock.Setup(repo => repo.UpdateRequestAsync(_testRequest)).ReturnsAsync(true);

            // Act
            var result = await _requestRepositoryMock.Object.UpdateRequestAsync(_testRequest);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public async Task GetListRequestsAsync_ShouldReturnListOfRequests()
        {
            // Arrange
            var requests = new List<Request?> { _testRequest };
            _requestRepositoryMock.Setup(repo => repo.GetListRequestsAsync("testUserId")).ReturnsAsync(requests);

            // Act
            var result = await _requestRepositoryMock.Object.GetListRequestsAsync("testUserId");

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }

        [Test]
        public async Task GeRequestByIdAsync_ShouldReturnRequest()
        {
            // Arrange
            _requestRepositoryMock.Setup(repo => repo.GeRequestByIdAsync(1)).ReturnsAsync(_testRequest);

            // Act
            var result = await _requestRepositoryMock.Object.GeRequestByIdAsync(1);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(_testRequest.RequestId, result.RequestId);
        }

        [Test]
        public async Task GetRequestByProductIdAsync_ShouldReturnRequest()
        {
            // Arrange
            _requestRepositoryMock.Setup(repo => repo.GetRequestByProductIdAsync(1)).ReturnsAsync(_testRequest);

            // Act
            var result = await _requestRepositoryMock.Object.GetRequestByProductIdAsync(1);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(_testRequest.RequestId, result.RequestId);
        }

        [Test]
        public async Task GetListRequestsByEmailAndTypeAsync_ShouldReturnListOfRequests()
        {
            // Arrange
            var requests = new List<Request?> { _testRequest };
            _requestRepositoryMock.Setup(repo => repo.GetListRequestsByEmailAndTypeAsync("Withdraw", _testAccount)).ReturnsAsync(requests);

            // Act
            var result = await _requestRepositoryMock.Object.GetListRequestsByEmailAndTypeAsync("Withdraw", _testAccount);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }
    }
}

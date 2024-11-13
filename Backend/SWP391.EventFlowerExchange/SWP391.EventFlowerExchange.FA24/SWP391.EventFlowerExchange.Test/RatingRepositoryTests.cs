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
    public class RatingRepositoryTests
    {
        private Mock<IRatingRepository> _ratingRepositoryMock;
        private Account _testAccount;
        private CreateRating _testCreateRating;
        private Order _testOrder;
        private Review _testReview;

        [SetUp]
        public void SetUp()
        {
            _ratingRepositoryMock = new Mock<IRatingRepository>();
            _testAccount = new Account { Id = "testUserId" };
            _testCreateRating = new CreateRating
            {
                OrderId = 1,
                BuyerEmail = "buyer@example.com",
                Rating = 5,
                Comment = "Great product!"
            };
            _testOrder = new Order
            {
                OrderId = 1,
                BuyerId = "testUserId",
                TotalPrice = 100.00m,
                Status = "Completed",
                CreatedAt = DateTime.Now
            };
            _testReview = new Review
            {
                ReviewId = 1,
                OrderId = 1,
                BuyerId = "testUserId",
                Rating = 5,
                Comment = "Great product!",
                CreatedAt = DateTime.Now
            };
        }

        [Test]
        public async Task ViewAllRatingByUserIdAsync_ShouldReturnReviews()
        {
            // Arrange
            var reviews = new List<Review> { _testReview };
            _ratingRepositoryMock.Setup(repo => repo.ViewAllRatingByUserIdAsync(_testAccount)).ReturnsAsync(reviews);

            // Act
            var result = await _ratingRepositoryMock.Object.ViewAllRatingByUserIdAsync(_testAccount);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }

        [Test]
        public async Task PostRatingAsync_ShouldReturnIdentityResultSuccess()
        {
            // Arrange
            _ratingRepositoryMock.Setup(repo => repo.PostRatingAsync(_testCreateRating)).ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _ratingRepositoryMock.Object.PostRatingAsync(_testCreateRating);

            // Assert
            Assert.IsTrue(result.Succeeded);
        }

        [Test]
        public async Task ViewRatingByOrderIdAsync_ShouldReturnReview()
        {
            // Arrange
            _ratingRepositoryMock.Setup(repo => repo.ViewRatingByOrderIdAsync(_testOrder)).ReturnsAsync(_testReview);

            // Act
            var result = await _ratingRepositoryMock.Object.ViewRatingByOrderIdAsync(_testOrder);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(_testReview.ReviewId, result.ReviewId);
        }

        
    }
}

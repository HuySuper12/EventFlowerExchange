//using Microsoft.AspNetCore.Identity;
//using Moq;
//using SWP391.EventFlowerExchange.Domain.Entities;
//using SWP391.EventFlowerExchange.Domain.ObjectValues;
//using SWP391.EventFlowerExchange.Infrastructure;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;
//namespace SWP391.EventFlowerExchange.Test
//{
//    [TestFixture]
//    public class MessageRepositoryTests
//    {
//        private Mock<IMessageRepository> _messageRepositoryMock;
//        private Account _testSender;
//        private Account _testReceiver;
//        private CreateMessage _testCreateMessage;
//        private Message _testMessage;

//        [SetUp]
//        public void SetUp()
//        {
//            _messageRepositoryMock = new Mock<IMessageRepository>();
//            _testSender = new Account { Id = "testSenderId" };
//            _testReceiver = new Account { Id = "testReceiverId" };
//            _testCreateMessage = new CreateMessage { SenderEmail = "sender@example.com", ReveiverEmail = "receiver@example.com", Contents = "Test message" };
//            _testMessage = new Message { MessageId = 1, SenderId = "testSenderId", ReceiverId = "testReceiverId", Contents = "Test message" };
//        }

//        [Test]
//        public async Task CreateMessageAsync_ShouldReturnTrue()
//        {
//            // Arrange
//            _messageRepositoryMock.Setup(repo => repo.CreateMessageAsync(_testCreateMessage)).ReturnsAsync(true);

//            // Act
//            var result = await _messageRepositoryMock.Object.CreateMessageAsync(_testCreateMessage);

//            // Assert
//            Assert.IsTrue(result);
//        }

//        [Test]
//        public async Task GetMessagesByReceiverIdAsync_ShouldReturnMessages()
//        {
//            // Arrange
//            var messages = new List<Message> { _testMessage };
//            _messageRepositoryMock.Setup(repo => repo.GetMessagesByReceiverIdAsync(_testSender, _testReceiver)).ReturnsAsync(messages);

//            // Act
//            var result = await _messageRepositoryMock.Object.GetMessagesByReceiverIdAsync(_testSender, _testReceiver);

//            // Assert
//            Assert.IsNotNull(result);
//            Assert.AreEqual(1, result.Count);
//        }
//    }
//}

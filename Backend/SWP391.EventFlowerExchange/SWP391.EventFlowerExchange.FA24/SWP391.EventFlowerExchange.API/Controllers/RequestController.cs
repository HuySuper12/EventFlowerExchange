using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SWP391.EventFlowerExchange.Application;
using SWP391.EventFlowerExchange.Domain.Entities;
using SWP391.EventFlowerExchange.Domain.ObjectValues;

namespace SWP391.EventFlowerExchange.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RequestController : ControllerBase
    {
        private IRequestService _service;
        private IAccountService _accountService;
        private IProductService _productService;
        private INotificationService _notificationService;
        private IFollowService _followService;

        public RequestController(IRequestService service, IAccountService accountService, IProductService productService, INotificationService notificationService, IFollowService followService)
        {
            _service = service;
            _accountService = accountService;
            _productService = productService;
            _notificationService = notificationService;
            _followService = followService;
        }

        [HttpGet("GetRequestList/{type}")]
        //[Authorize]
        public async Task<IActionResult> GetAllRequestList(string type)
        {
            return Ok(await _service.GetListRequestsFromAPIAsync(type));
        }

        [HttpGet("GetRequestListBy/{type},{email}")]
        //[Authorize]
        public async Task<IActionResult> GetListRequestsByEmailAndType(string type, string email)
        {
            var account = await _accountService.GetUserByEmailFromAPIAsync(new Account() { Email = email });
            return Ok(await _service.GetListRequestsByEmailAndTypeAsync(type, account));
        }

        [HttpGet("GetRequestById")]
        //[Authorize]
        public async Task<IActionResult> GetRequestById(int id)
        {
            return Ok(await _service.GetRequestByIdFromAPIAsync(id));
        }

        [HttpPost("CreateRequest_Withdraw")]
        //[Authorize(Roles = ApplicationRoles.Seller)]
        public async Task<ActionResult<bool>> CreateNewRequest(RequestPayment value)
        {
            var account = await _accountService.GetUserByEmailFromAPIAsync(new Account() { Email = value.UserEmail });
            var convert = new CreateRequest()
            {
                Amount = value.Amount,
                CreatedAt = DateTime.Now,
                RequestType = value.RequestType,
                UserId = account.Id,
                Status = "Pending"
            };
            var request = await _service.CreateRequestFromAPIAsync(convert);
            return Ok(request);
        }

        [HttpPut("UpdateRequest")]
        //[Authorize]
        public async Task<ActionResult<bool>> UpdateRequest(CreateRequest value)
        {
            var product = await _productService.SearchProductByIdFromAPIAsync(new GetProduct() { ProductId = (int)value.ProductId });
            var seller = await _accountService.GetUserByIdFromAPIAsync(new Account() { Id = product.SellerId });


            if (value.RequestType == "Post")
            {
                value.PaymentId = null;
                value.Amount = null;

                if (product != null)
                {
                    product.Status = "Enable";
                    if (value.Status.ToLower().Contains("Rejected".ToLower()))
                    {
                        product.Status = value.Status;
                    }
                    var check = await _productService.UpdateProductFromAPIAsync(product);
                    if (check)
                    {
                        var followerList = await _followService.GetFollowerListFromApiAsync(seller);

                        //Thông báo cho chủ shop
                        var sellerNotification = new CreateNotification()
                        {
                            UserEmail = seller.Email,
                            Content = $"Your product post has been accepted."
                        };
                        await _notificationService.CreateNotificationFromApiAsync(sellerNotification);


                        //Thông báo cho followers
                        foreach (var item in followerList)
                        {
                            var follower = await _accountService.GetUserByIdFromAPIAsync(new Account() { Id = item.FollowerId });
                            var followerNotification = new CreateShopNotification()
                            {
                                FollowerẸmail = follower.Email,
                                SellerEmail = seller.Email,
                                ProductId = product.ProductId,
                                Content = $"{seller.Name} has added a new product in the shop you followed "
                            };
                            await _notificationService.CreateShopNotificationFromApiAsync(followerNotification);

                        }
                    }
                }
            }
            else if (value.RequestType == "Withdraw")
            {
                value.ProductId = null;
            }

            var request = await _service.GetRequestByProductIdFromAPIAsync((int)value.ProductId);
            request.Status = value.Status;
            request.Amount = value.Amount;
            request.RequestType = value.RequestType;
            request.PaymentId = value.PaymentId;
            request.Status = value.Status;
            request.UpdatedAt = DateTime.Now;

            await _service.UpdateRequestFromAPIAsync(request);



            return true;

        }
    }
}

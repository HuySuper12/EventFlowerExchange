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

        [HttpPost("CreateRequest")]
        //[Authorize(Roles = ApplicationRoles.Seller)]
        public async Task<ActionResult<bool>> CreateRequest(CreateRequest value)
        {
            bool request = false;
            switch (value.RequestType)
            {
                case "Report":
                    {
                        value.RequestId = null;
                        value.Amount = null;
                        value.PaymentId = null;
                        request = await _service.CreateRequestFromAPIAsync(value);
                        break;
                    }
                case "Refund":
                    {
                        value.RequestId = null;
                        value.Amount = null;
                        value.PaymentId = null;
                        request = await _service.CreateRequestFromAPIAsync(value);
                        break;
                    }
            }

            return Ok(request);
        }
    }
}

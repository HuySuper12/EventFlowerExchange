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

        public RequestController(IRequestService service, IAccountService accountService)
        {
            _service = service;
            _accountService = accountService;
        }

        [HttpGet("GetRequestList")]
        //[Authorize]
        public async Task<IActionResult> GetAllRequestList(string type)
        {
            return Ok(await _service.GetListRequestsFromAPIAsync(type));
        }

        [HttpGet("GetRequestByUserId")]
        //[Authorize]
        public async Task<IActionResult> GetRequestByUserId(string id)
        {
            return Ok(await _service.GetRequestByUserIdFromAPIAsync(id));
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
        [Authorize]
        public async Task<ActionResult<bool>> UpdateRequest(CreateRequest value)
        {
            if (value.RequestType == "Post")
            {
                value.PaymentId = null;
                value.Amount = null;

            }
            else if (value.RequestType == "Withdraw")
            {
                value.ProductId = null;
            }
            var request = await _service.GetRequestByUserIdFromAPIAsync(value.UserId);
            request.Status = value.Status;
            request.Amount = value.Amount;
            request.CreatedAt = value.CreatedAt;
            request.RequestType = value.RequestType;
            request.PaymentId = value.PaymentId;
            request.Status = value.Status;
            request.UpdatedAt = DateTime.Now;

            return await _service.UpdateRequestFromAPIAsync(request);
        }
    }
}

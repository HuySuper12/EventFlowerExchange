using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SWP391.EventFlowerExchange.Application;
using SWP391.EventFlowerExchange.Domain.Entities;
using SWP391.EventFlowerExchange.Domain.ObjectValues;

namespace SWP391.EventFlowerExchange.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VNPAYController : ControllerBase
    {

        private IVnPayService _vnPayservice;
        private IAccountService _accountService;
        private IRequestService _requestService;
        private INotificationService _notification;


        public VNPAYController(IVnPayService vnPayservice, IAccountService account, IRequestService requestService, INotificationService notificationService)
        {
            _vnPayservice = vnPayservice;
            _accountService = account;
            _requestService = requestService;
            _notification = notificationService;
        }

        [EnableCors("MyCors")]
        [HttpPost("create-payment-link")]
        public IActionResult CreatePaymentLink(VnPayRequest model)
        {
            if (model == null || !ModelState.IsValid)
            {
                return BadRequest("Invalid payment request.");
            }
            string paymentURL = _vnPayservice.CreatePaymentUrl(HttpContext, model);
            return Ok(paymentURL);
        }


    }
}

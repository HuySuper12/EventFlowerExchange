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

        public VNPAYController(IVnPayService vnPayservice, IAccountService account, IRequestService requestService)
        {
            _vnPayservice = vnPayservice;
            _accountService = account;
            _requestService = requestService;
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

        [HttpGet("payment-callback")]
        public async Task<IActionResult> PaymentCallback()
        {
            var response = await _vnPayservice.PaymentExecute(Request.Query);

            if (response == null || response.ResponseCode != "00" || response.Status != true)
            {
                response.Status = false;
                await _vnPayservice.CreatePaymentFromAPIAsync(response);
                return Redirect("https://event-flower-exchange.vercel.app/");
            }
            var account = await _accountService.GetUserByIdFromAPIAsync(new Account() { Id = response.UserId });

            if (response.PaymentType == 1) //NAP TIEN
            {

                account.Balance = response.Amount + account.Balance;
                response.PaymentContent = $"Nạp tiền vào ví của {account.Name}";
                response.PaymentType = 1; //1: Nạp tiền, 2: Rút tiền

                // Here you can save the order to the database if needed
                await _vnPayservice.CreatePaymentFromAPIAsync(response);
                await _accountService.UpdateAccountFromAPIAsync(account);
            }
            else //RUT TIEN
            {
                await _vnPayservice.CreatePaymentFromAPIAsync(response);
                var payment = await _vnPayservice.GetPayementByCodeFromAPIAsync(response);
                var request = await _requestService.GetRequestByIdFromAPIAsync((int)response.RequestId);
                request.Status = "Success";
                request.PaymentId = payment.PaymentId;
                request.UpdatedAt = response.CreatedAt;
                response.PaymentContent = $"Rút tiền khỏi ví của {account.Name}";
                await _requestService.UpdateRequestFromAPIAsync(request);

                account.Balance = account.Balance - response.Amount;
                await _accountService.UpdateAccountFromAPIAsync(account);

            }
            return Redirect("https://anime47.tv/xem-phim-kekkon-yubiwa-monogatari-ep-02/204546.html");
        }

    }
}

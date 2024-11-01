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
    public class VoucherController : ControllerBase
    {
        private IVoucherService _service;
        public VoucherController(IVoucherService service)
        {
            _service = service;
        }

        [HttpGet("GetAllVoucher")]
        //[Authorize]
        public async Task<IActionResult> GetAllVoucher()
        {
            return Ok(await _service.ViewAllVoucherFromAPIAsync());
        }

    }
}

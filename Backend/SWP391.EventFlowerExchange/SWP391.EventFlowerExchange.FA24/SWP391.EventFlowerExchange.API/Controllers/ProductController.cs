using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SWP391.EventFlowerExchange.Application;
using SWP391.EventFlowerExchange.Domain.Entities;
using SWP391.EventFlowerExchange.Domain.ObjectValues;
using SWP391.EventFlowerExchange.Infrastructure;

namespace SWP391.EventFlowerExchange.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private IProductService _service;
        private IAccountService _account;
        private IConfiguration _config;
        private IRequestService _requestService;

        public ProductController(IProductService service, IConfiguration config, IAccountService account, IRequestService requestService)
        {
            _service = service;
            _account = account;
            _config = config;
            _requestService = requestService;
        }


        [HttpGet("GetProductList/Enable")]
        //[Authorize]
        public async Task<IActionResult> GetAllEnableProductList()
        {
            return Ok(await _service.GetEnableProductListFromAPIAsync());

        }

        [HttpGet("GetProductList/Disable")]
        //[Authorize]
        public async Task<IActionResult> GetAllDisableProductList()
        {
            return Ok(await _service.GetDisableProductListFromAPIAsync());
        }

        [HttpGet("GetProductList/InProgress")]
        //[Authorize(Roles = ApplicationRoles.Admin)]
        public async Task<IActionResult> GetAllInProgressProductList()
        {
            return Ok(await _service.GetInProgressProductListFromAPIAsync());
        }

        [HttpGet("GetProductList/Rejected")]
        //[Authorize(Roles = ApplicationRoles.Seller + "," + ApplicationRoles.Admin)]
        public async Task<IActionResult> GetAllRejectedProductList()
        {
            return Ok(await _service.GetRejectedProductListFromAPIAsync());
        }

        [HttpGet("GetProductList/Latest")]
        public async Task<IActionResult> GetLatestProductList()
        {
            var products = await _service.GetLatestProductsFromAPIAsync();
            if (products == null || !products.Any())
            {
                return NotFound();
            }
            return Ok(products);
        }

        [HttpGet("GetProductList/Oldest")]
        public async Task<IActionResult> GetOldestProductList()
        {
            var products = await _service.GetOldestProductsFromAPIAsync();
            if (products == null || !products.Any())
            {
                return NotFound();
            }
            return Ok(products);
        }
    }
}

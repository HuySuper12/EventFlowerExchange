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
        public async Task<IActionResult> GetLatestProducts()
        {
            var products = await _service.GetLatestProductsFromAPIAsync();
            if (products == null || !products.Any())
            {
                return NotFound();
            }
            return Ok(products);
        }

        [HttpGet("GetProductList/Oldest")]
        public async Task<IActionResult> GetOldestProducts()
        {
            var products = await _service.GetOldestProductsFromAPIAsync();
            if (products == null || !products.Any())
            {
                return NotFound();
            }
            return Ok(products);
        }


        //BỔ SUNG API
        [HttpGet("GetProductList/EnableAndDisable")]
        //[Authorize]
        public async Task<IActionResult> GetEnableAndDisableProductList()
        {

            return Ok(await _service.GetEnableAndDisableProductListFromAPIAsync());

        }

        [HttpGet("GetProductList/Enable/Seller")]
        //[Authorize]
        public async Task<IActionResult> GetEnableProductListBySellerEmail(string email)
        {
            var acc = await _account.GetUserByEmailFromAPIAsync(new Account() { Email = email });
            return Ok(await _service.GetEnableProductListBySellerEmailFromAPIAsync(acc));

        }


        [HttpGet("GetProductList/Disable/Seller")]
        //[Authorize]
        public async Task<IActionResult> GetDisableProductListBySellerEmail(string email)
        {
            var acc = await _account.GetUserByEmailFromAPIAsync(new Account() { Email = email });
            return Ok(await _service.GetDisableProductListBySellerEmailFromAPIAsync(acc));
        }


        [HttpGet("GetProductList/InProgress/Seller")]
        //[Authorize(Roles = ApplicationRoles.Admin)]
        public async Task<IActionResult> GetInProgressProductListBySellerEmail(string email)
        {
            var acc = await _account.GetUserByEmailFromAPIAsync(new Account() { Email = email });
            return Ok(await _service.GetInProgressProductListBySellerEmailFromAPIAsync(acc));
        }


        [HttpGet("GetProductList/Rejected/Seller")]
        //[Authorize(Roles = ApplicationRoles.Seller + "," + ApplicationRoles.Admin)]
        public async Task<IActionResult> GetRejectedProductListBySellerEmail(string email)
        {
            var acc = await _account.GetUserByEmailFromAPIAsync(new Account() { Email = email });
            return Ok(await _service.GetRejectedProductListBySellerEmailFromAPIAsync(acc));
        }

        [HttpGet("SearchProduct/{id:int}")]
        public async Task<IActionResult> SearchProductByID(int id)
        {
            GetProduct product = new GetProduct() { ProductId = id };
            var checkProduct = await _service.SearchProductByIdFromAPIAsync(product);
            if (checkProduct == null)
            {
                return NotFound();
            }
            return Ok(checkProduct);
        }

        [HttpGet("SearchProduct/{name}")]
        public async Task<IActionResult> SearchProductByName(string name)
        {
            var checkProduct = await _service.SearchProductByNameFromAPIAsync(name);
            if (checkProduct == null)
            {
                return NotFound();
            }
            return Ok(checkProduct);
        }

        [HttpPost("CreateProduct")]
        //[Authorize(Roles = ApplicationRoles.Seller)]
        public async Task<ActionResult<bool>> CreateNewProduct(CreateProduct product)
        {
            var account = await _account.GetUserByEmailFromAPIAsync(new Account() { Email = product.SellerEmail });
            var check = await _service.CreateNewProductFromAPIAsync(product, account);
            if (check)
            {
                var checkProduct = await _service.SearchProductByNameFromAPIAsync(product.ProductName);
                var request = new Request()
                {
                    Amount = product.Price,

                };
                return true;

            }
            return false;
        }

        [HttpDelete("{id}")]
        //[Authorize(Roles = ApplicationRoles.Seller)]

        public async Task<IActionResult> DeleteProduct(int id)
        {
            GetProduct product = new GetProduct() { ProductId = id };
            var checkProduct = await _service.SearchProductByIdFromAPIAsync(product);
            if (checkProduct == null)
            {
                return BadRequest();
            }
            bool status = await _service.RemoveProductFromAPIAsync(checkProduct);
            return Ok(status);
        }




    }
}

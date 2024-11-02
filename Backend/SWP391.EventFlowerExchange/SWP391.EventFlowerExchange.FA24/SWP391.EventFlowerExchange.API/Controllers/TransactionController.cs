using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SWP391.EventFlowerExchange.Application;
using SWP391.EventFlowerExchange.Domain.Entities;
using SWP391.EventFlowerExchange.Domain.ObjectValues;

namespace SWP391.EventFlowerExchange.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private ITransactionService _service;
        private IAccountService _accountService;

        public TransactionController(ITransactionService service, IAccountService accountService)
        {
            _service = service;
            _accountService = accountService;
        }

        [HttpGet("GetRevenueOrderStatistics")]
        //[Authorize(Roles = ApplicationRoles.Manager)]
        public ActionResult<List<StatisticSystem>> GetRevenueOrderStatistics()
        {
            var result = _service.GetRevenueOrderStatisticsFromAPI();
            List<StatisticSystem> list = new List<StatisticSystem>();
            if (result != null)
            {
                foreach (var entry in result)
                {
                    StatisticSystem statisticSystem = new StatisticSystem()
                    {
                        Name = entry.Key,       // Key từ Dictionary
                        Total = entry.Value     // Value từ Dictionary
                    };
                    list.Add(statisticSystem);
                }
            }
            return list;
        }

        [HttpGet("ViewAllTransaction")]
        //[Authorize(Roles = ApplicationRoles.Manager)]
        public async Task<IActionResult> ViewAllTransactionAsync()
        {
            return Ok(await _service.ViewAllTransactionFromAPIAsync());
        }

        [HttpGet("ViewAllTransactionByEmail")]
        //[Authorize]
        public async Task<IActionResult> ViewAllTransactionByUserIdAsync(string email)
        {
            var account = await _accountService.GetUserByEmailFromAPIAsync(new Account() { Email = email });
            if (account != null)
            {
                return Ok(await _service.ViewAllTransactionByUserIdFromAPIAsync(account));
            }
            return BadRequest("Not found");
        }


    }
}

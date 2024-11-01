using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SWP391.EventFlowerExchange.Application;
using SWP391.EventFlowerExchange.Domain.Entities;
using SWP391.EventFlowerExchange.Domain.ObjectValues;
using SWP391.EventFlowerExchange.Infrastructure;

namespace SWP391.EventFlowerExchange.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RefundController : ControllerBase
    {
        private readonly IRefundService refundService;
        private readonly IAccountService accountService;
        private readonly IProductService productService;
        private readonly IOrderService orderService;
        private readonly IDeliveryLogService deliveryLogService;
        private readonly INotificationService noti;

        public RefundController(IRefundService refundService, IAccountService accountService, IProductService productService, IOrderService orderService, IDeliveryLogService deliveryLogService, INotificationService noti)
        {
            this.refundService = refundService;
            this.accountService = accountService;
            this.productService = productService;
            this.orderService = orderService;
            this.deliveryLogService = deliveryLogService;
            this.noti = noti;
        }

        [HttpPost("BuyerReturnAction")]
        //[Authorize(Roles = ApplicationRoles.Buyer)]
        public async Task<ActionResult<bool>> BuyerReturnAction(int orderId)
        {
            var getOrder = new Order { OrderId = orderId };
            var order = await orderService.SearchOrderByOrderIdFromAPIAsync(getOrder);

            var getBuyer = new Account { Id = order.BuyerId };
            var buyer = await accountService.GetUserByIdFromAPIAsync(getBuyer);

            if (buyer != null && order != null)
            {
                var result = await refundService.BuyerReturnActionFromApiAsync(buyer, order);
                if (result.Succeeded)
                {
                    return true;
                }
                return false;
            }
            return false;
        }

        

    }
}

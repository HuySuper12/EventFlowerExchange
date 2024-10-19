using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using SWP391.EventFlowerExchange.Domain;
using SWP391.EventFlowerExchange.Domain.ObjectValues;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWP391.EventFlowerExchange.Infrastructure
{
    public class CartRepository : ICartRepository
    {
        private Swp391eventFlowerExchangePlatformContext _context;

        public CartRepository(Swp391eventFlowerExchangePlatformContext context)
        {
            _context = context;
        }

        public async Task<IdentityResult> CreateCartAsync(Account account)
        {
            _context = new Swp391eventFlowerExchangePlatformContext();

            // Tạo giỏ hàng mới
            var newCart = new Cart
            {
                BuyerId = account.Id,
            };

            await _context.Carts.AddAsync(newCart);
            int result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                return IdentityResult.Success;
            }

            return IdentityResult.Failed();
        }

        public async Task<IdentityResult> CreateCartItemAsync(CartItem cartItem)
        {
            _context = new Swp391eventFlowerExchangePlatformContext();

            // Nếu sản phẩm chưa có, thêm sản phẩm mới
            var newItem = new CartItem
            {
                CartId= cartItem.CartId, 
                BuyerId = cartItem.BuyerId,
                ProductId = cartItem.ProductId,
                Quantity = cartItem.Quantity,
                Price = cartItem.Price,
                ProductImage = cartItem.ProductImage,
                CreatedAt = DateTime.UtcNow
            };

            await _context.CartItems.AddAsync(newItem);
            int result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                return IdentityResult.Success;
            }

            return IdentityResult.Failed();
        }

        public async Task<IdentityResult> RemoveItemFromCartAsync(CartItem cartItem)
        {
            _context = new Swp391eventFlowerExchangePlatformContext();

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }

        public async Task<List<Cart>> ViewAllCartAsync()
        {
            _context = new Swp391eventFlowerExchangePlatformContext();

            return await _context.Carts.ToListAsync();
        }

        public async Task<List<CartItem>> ViewAllCartItemByUserIdAsync(Account account)
        {
            _context = new Swp391eventFlowerExchangePlatformContext();

            var cart = await _context.CartItems.Where(x => x.BuyerId == account.Id).ToListAsync();
            if (cart != null)
            {
                return cart;
            }

            return null;
        }


    }
}

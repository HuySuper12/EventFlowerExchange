using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SWP391.EventFlowerExchange.Domain;
using SWP391.EventFlowerExchange.Domain.Entities;
using SWP391.EventFlowerExchange.Domain.ObjectValues;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWP391.EventFlowerExchange.Infrastructure
{
    public class FollowRepository : IFollowRepository
    {
        private Swp391eventFlowerExchangePlatformContext _context;

        public FollowRepository(Swp391eventFlowerExchangePlatformContext context)
        {
            _context = context;
        }

        public async Task<IdentityResult> AddNewFollowerAsync(CreateFollower follower)
        {
            _context = new Swp391eventFlowerExchangePlatformContext();

            var foAccount = _context.Accounts.FirstOrDefault(x => x.Id == follower.FollowerEmail);

            var noti = new ShopNotification
            {
                SellerId = follower.SellerEmail,        //FollowerEmail chứa giá trị id
                FollowerId = follower.FollowerEmail,    //SellerEmail chứa giá trị id
                Content = $"{foAccount.Name} has followed you.",
                CreatedAt = DateTime.UtcNow,
                Status = "enable"
            };

            var fo = new Follow
            {
                FollowerId = follower.FollowerEmail,        // FollowerEmail chứa giá trị id
                SellerId = follower.SellerEmail             // SellerEmail chứa giá trị id
            };
            
            await _context.ShopNotifications.AddAsync(noti);
            await _context.Follows.AddAsync(fo);

            int result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                return IdentityResult.Success;
            }

            return IdentityResult.Failed();
        }

        public async Task<List<Follow>> GetFollowerListAsync(Account account)
        {
            _context = new Swp391eventFlowerExchangePlatformContext();

            var list = await _context.Follows
                .Where(x => x.SellerId == account.Id).ToListAsync();
            if (list != null)
            {
                return list;
            }

            return null;
        }

        public async Task<IdentityResult> RemoveFollowerAsync(ShopNotification follower)
        {
            _context = new Swp391eventFlowerExchangePlatformContext();

            var disableFollower = _context.ShopNotifications
                .FirstOrDefault(x => x.FollowerId == follower.FollowerId && x.SellerId == follower.SellerId 
                && !x.ProductId.HasValue);
            var removeFollower = _context.Follows
                .FirstOrDefault(x => x.SellerId == follower.SellerId && x.FollowerId == follower.FollowerId);

            disableFollower.Status = "disable";
            _context.Follows.Remove(removeFollower);
            await _context.SaveChangesAsync();

            return IdentityResult.Success;   
        }
    }
}

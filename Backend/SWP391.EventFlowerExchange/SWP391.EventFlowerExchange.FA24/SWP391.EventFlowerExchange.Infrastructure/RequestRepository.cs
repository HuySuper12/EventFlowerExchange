using SWP391.EventFlowerExchange.Domain.Entities;
using SWP391.EventFlowerExchange.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SWP391.EventFlowerExchange.Domain.ObjectValues;
using Microsoft.EntityFrameworkCore;

namespace SWP391.EventFlowerExchange.Infrastructure
{
    public class RequestRepository : IRequestRepository
    {
        private Swp391eventFlowerExchangePlatformContext _context;

        private Request ConvertCreateRequestToRequest(CreateRequest value)
        {
            Request request = new Request()
            {
                Amount = value.Amount,
                PaymentId = value.PaymentId,
                ProductId = value.ProductId,
                UserId = value.UserId,
                RequestType = value.RequestType,
                Status = "Pending",
                CreatedAt = value.CreatedAt,
            };
            return request;
        }

        public async Task<bool> CreateRequestAsync(CreateRequest value)
        {
            Request request = new Request()
            {
                Amount = value.Amount,
                PaymentId = value.PaymentId,
                ProductId = value.ProductId,
                UserId = value.UserId,
                RequestType = value.RequestType,
                Status = value.Status,
                CreatedAt = value.CreatedAt,

            };
            _context = new Swp391eventFlowerExchangePlatformContext();
            _context.Requests.Add(request);
            await _context.SaveChangesAsync();
            return true;

        }

        public async Task<bool> UpdateRequestAsync(Request value)
        {
            //Request request = new Request()
            //{
            //    Amount = value.Amount,
            //    PaymentId = value.PaymentId,
            //    ProductId = value.ProductId,
            //    UserId = value.UserId,
            //    RequestType = value.RequestType,
            //    Status = value.Status,
            //    CreatedAt = value.CreatedAt,
            //    UpdatedAt = value.UpdatedAt,
            //};
            _context = new Swp391eventFlowerExchangePlatformContext();
            _context.Requests.Update(value);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Request?>> GetListRequestsAsync(string value)
        {
            _context = new Swp391eventFlowerExchangePlatformContext();
            var list = await _context.Requests.Where(p => p.RequestType != null && p.RequestType.ToLower().Contains(value.ToLower())).ToListAsync();
            return list;
        }

        public async Task<Request?> GetLatestRequestByUserIdAsync(string id)
        {
            _context = new Swp391eventFlowerExchangePlatformContext();
            var checkRequest = await _context.Requests.Where(p => p.UserId == id && p.Status == "Pending").OrderByDescending(p => p.CreatedAt).FirstOrDefaultAsync();

            return checkRequest;
        }

        public async Task<Request?> GeRequestByIdAsync(int id)
        {
            _context = new Swp391eventFlowerExchangePlatformContext();
            var checkRequest = await _context.Requests.FindAsync(id);
            return checkRequest;
        }


    }
}

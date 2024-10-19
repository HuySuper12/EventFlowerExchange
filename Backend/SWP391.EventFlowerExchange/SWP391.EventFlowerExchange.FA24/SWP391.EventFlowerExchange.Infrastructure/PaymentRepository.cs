using SWP391.EventFlowerExchange.Domain.Entities;
using SWP391.EventFlowerExchange.Domain.ObjectValues;
using SWP391.EventFlowerExchange.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace SWP391.EventFlowerExchange.Infrastructure
{
    public class PaymentRepository : IPaymentRepository
    {
        private Swp391eventFlowerExchangePlatformContext _context;

        public async Task<bool> CreatePayementAsync(CreatePayment newValue)
        {

            Payment payment = new Payment()
            {
                PaymentContent = newValue.PaymentContent,
                PaymentType = newValue.PaymentType,
                PaymentCode = newValue.PaymentCode,
                Amount = newValue.Amount,
                CreatedAt = newValue.CreatedAt,
                Status = newValue.Status,
                UserId = newValue.UserId,
            };
            _context = new Swp391eventFlowerExchangePlatformContext();
            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Payment> GetPayementByCodeAsync(CreatePayment payment)
        {
            _context = new Swp391eventFlowerExchangePlatformContext();
            var check = await _context.Payments.SingleOrDefaultAsync(p => p.PaymentCode == payment.PaymentCode);
            return check;
        }
    }
}

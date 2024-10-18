using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWP391.EventFlowerExchange.Domain.Entities
{
    public class CreateRequest
    {
        public string? UserId { get; set; }

        public string? RequestType { get; set; }

        public int? PaymentId { get; set; } 

        public decimal? Amount { get; set; }

        public int? ProductId { get; set; } 

        public string? Status { get; set; }

        public DateTime? CreatedAt { get; set; }

    }
}

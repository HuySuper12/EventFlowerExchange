using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWP391.EventFlowerExchange.Domain.Entities
{
    public class CheckOutBefore
    {
        public string? Address { get; set; }
        public string? VoucherCode { get; set; }
        public List<string>? ListProduct { get; set; }
    }
}

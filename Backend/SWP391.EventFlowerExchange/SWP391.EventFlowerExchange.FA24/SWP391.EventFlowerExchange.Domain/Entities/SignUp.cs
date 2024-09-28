using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWP391.EventFlowerExchange.Domain.Entities
{
    public class SignUp
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public int Balance { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword {  get; set; }
    }
}

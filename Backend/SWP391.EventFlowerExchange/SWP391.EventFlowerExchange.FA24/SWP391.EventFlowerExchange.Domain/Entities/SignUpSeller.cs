﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWP391.EventFlowerExchange.Domain.Entities
{
    public class SignUpSeller
    {
        [Required(ErrorMessage = "Name is required.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid Email Address format.")]
        public string Email { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Balance must be a positive number.")]
        public int Balance { get; set; }

        public string Address { get; set; }

        [Phone(ErrorMessage = "Invalid Phone Number format.")]
        public string Phone { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Compare("Password", ErrorMessage = "Confirm Password does not match Password.")]
        [DataType(DataType.Password)]
        public string ConfirmPassword { get; set; }
    }
}

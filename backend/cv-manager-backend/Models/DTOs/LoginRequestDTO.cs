using System.ComponentModel.DataAnnotations;

namespace backend.Models.DTOs
{
    public class LoginRequestDTO
    {
        [Required]
        [EmailAddress]
        [MaxLength(256)]
        public string Email { get; set; }

        [Required]
        [MinLength(8)]
        [MaxLength(100)]
        public string Password { get; set; }
    }
}
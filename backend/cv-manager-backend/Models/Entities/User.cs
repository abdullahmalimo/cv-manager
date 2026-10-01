using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.Models.Entities
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [MaxLength(20)]
        public string Username { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(256)]
        public string Email { get; set; }

        [Required]
        [MaxLength (256)]
        public string PasswordHash { get; set; }

        [Required]
        [MaxLength (20)]
        public string Role { get; set; } = "User";
    }
}

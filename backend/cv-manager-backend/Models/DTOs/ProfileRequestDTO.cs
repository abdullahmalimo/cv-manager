using System.ComponentModel.DataAnnotations;

namespace backend.Models.DTOs
{
    public class ProfileRequestDTO
    {
        [Required]
        [MaxLength(100)]
        public string FullName { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(256)]
        public string ContactEmail { get; set; }

        [Required]
        [MaxLength(20)]
        public string MobileNumber { get; set; }

        [MaxLength(100)]
        public string CityName { get; set; }

        [MaxLength(2000)]
        public string Summary { get; set; }
    }
}
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models.Entities
{
    [Table("Profile")]
    public class Profile
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        [Required]
        [MaxLength(100)]
        public string FullName { get; set; }
        [Required]
        [EmailAddress]
        [MaxLength(256)]
        public string ContactEmail { get; set; }
        [Required]
        [MaxLength(20)]
        public string MobileNumber {  get; set; }
        [MaxLength(100)]
        public string CityName { get; set; }
        [MaxLength(2000)]
        public string Summary { get; set; }
    }
}

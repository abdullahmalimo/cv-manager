using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("PersonalInformation")]
    public class PersonalInformation
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string FullName { get; set; }
        public string CityName { get; set; }
        [EmailAddress]
        public string Email { get; set; }
        [RegularExpression(@"^\d+$", ErrorMessage = "Mobile number must contain only digits.")]
        public string MobileNumber { get; set; }

    }
}

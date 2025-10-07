using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("ExperienceInformation")]
    public class ExperienceInformation
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [MaxLength(20)]
        public string CompanyName { get; set; }
        public string City { get; set; }
        public string CompanyField { get; set; }

        
    }
}

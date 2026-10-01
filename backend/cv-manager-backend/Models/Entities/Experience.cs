using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace backend.Models.Entities
{
    [Table("Experience")]
    public class Experience
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        [Required]
        [MaxLength(100)]
        public string CompanyName { get; set; }
        [Required]
        [MaxLength(50)]
        public string JobTitle { get; set; }
        [MaxLength(1000)]
        public string Description { get; set; }
        [MaxLength(50)]
         public string City { get; set; }
        [Required]
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}

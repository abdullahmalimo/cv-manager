using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Models.Entities
{
    public class Certificate
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; }
        [Required]
        [MaxLength(200)]
        public string Issuer { get; set; }
        [MaxLength(2000)]
        public string Description { get; set; }
        [MaxLength(1000)]
        public string? Url { get; set; }
        [Required]
        public DateTime IssueDate { get; set; }
    }
}

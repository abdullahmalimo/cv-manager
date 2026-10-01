using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Models.DTOs
{
    public class CVResponseDTO
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(100)]
        public string Title { get; set; }

        [MaxLength(100)]
        public string Description { get; set; }

        [MaxLength(100)]
        public string TemplateName { get; set; }

        [Required]
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
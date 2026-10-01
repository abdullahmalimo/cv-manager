using System.ComponentModel.DataAnnotations;

namespace backend.Models.DTOs
{
    public class CVRequestDTO
    {
        [Required]
        [MaxLength(100)]
        public string Title { get; set; }

        [MaxLength(100)]
        public string Description { get; set; }

        [MaxLength(100)]
        public string TemplateName { get; set; }

        [Required]
        public string Content { get; set; }
    }
}
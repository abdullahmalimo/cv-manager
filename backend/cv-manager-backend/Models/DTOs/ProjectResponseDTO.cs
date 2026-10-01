using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Models.DTOs
{
    public class ProjectResponseDTO
    {
        public int Id { get; set; }
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [MaxLength(1000)]
        public string Description { get; set; }

        [MaxLength(500)]
        public string Technologies { get; set; }

        [MaxLength(1000)]
        public string Url { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }
    }
}
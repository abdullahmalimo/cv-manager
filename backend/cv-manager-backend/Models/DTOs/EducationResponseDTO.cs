using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Models.DTOs
{
    public class EducationResponseDTO
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(100)]
        public string Institution { get; set; }

        [Required]
        [MaxLength(100)]
        public string Degree { get; set; }

        [MaxLength(100)]
        public string StudyField { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }
    }
}
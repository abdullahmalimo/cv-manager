using System.ComponentModel.DataAnnotations;

namespace backend.Models.DTOs
{
    public class SkillRequestDTO
    {
        [Required]
        [MaxLength(50)]
        public string Name { get; set; }

        public int? Level { get; set; }
    }
}
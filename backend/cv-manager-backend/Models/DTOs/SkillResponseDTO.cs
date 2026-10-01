using System.ComponentModel.DataAnnotations;

namespace backend.Models.DTOs
{
    public class SkillResponseDTO
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(50)]
        public string Name { get; set; }

        public int? Level { get; set; }
    }
}
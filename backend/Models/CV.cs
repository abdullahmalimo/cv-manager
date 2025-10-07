using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("CV")]
    public class CV
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }

        [ForeignKey("PersonalInformation")]
        public int PersonalInformationId { get; set; }
        public PersonalInformation PersonalInformation { get; set; }
        [ForeignKey("ExperienceInformation")]

        public int ExperienceInformationId { get; set; }
        public ExperienceInformation ExperienceInformation { get; set; }
    }
}

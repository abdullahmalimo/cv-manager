using backend.Models;
using Microsoft.EntityFrameworkCore;
namespace backend.Data
{
    public class CVDbContext : DbContext
    {
        public CVDbContext(DbContextOptions<CVDbContext> options)
            : base(options)
        { }

        public DbSet<CV> CVs { get; set; }
        public DbSet<PersonalInformation> PersonalInformations { get; set; }
        public DbSet<ExperienceInformation> ExperienceInformations { get; set; }
    }
}


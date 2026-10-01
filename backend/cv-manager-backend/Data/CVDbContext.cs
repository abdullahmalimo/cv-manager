using backend.Models.Entities;
using Microsoft.EntityFrameworkCore;
namespace backend.Data
{
    public class CVDbContext : DbContext
    {
        public CVDbContext(DbContextOptions<CVDbContext> options)
            : base(options)
        { }

        public DbSet<CV> CVs { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Skill> Skills { get; set; }
        public DbSet<Experience> Experiences { get; set; }
        public DbSet<Education> Educations { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Certificate> Certificates { get; set; }
        public DbSet<Profile> Profiles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Profile: one User → one Profile
            modelBuilder.Entity<Profile>()
                .HasOne<User>()
                .WithOne()
                .HasForeignKey<Profile>(p => p.UserId);

            // Experience: one User → many Experiences
            modelBuilder.Entity<Experience>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(e => e.UserId);

            // Education: one User → many Educations
            modelBuilder.Entity<Education>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(e => e.UserId);

            // Skill: one User → many Skills
            modelBuilder.Entity<Skill>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(s => s.UserId);

            // Project: one User → many Projects
            modelBuilder.Entity<Project>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(p => p.UserId);

            // Certificate: one User → many Certificates
            modelBuilder.Entity<Certificate>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(c => c.UserId);

            // CV: one User → many CVs
            modelBuilder.Entity<CV>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(cv => cv.UserId);

            // Each email must be unique
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();
        }

    }
}


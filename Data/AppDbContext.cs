using Microsoft.EntityFrameworkCore;
using Oguz_Nyzam.API.Entities;

namespace Oguz_Nyzam.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Role> Roles => Set<Role>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Faculty> Faculties => Set<Faculty>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<Group> Groups => Set<Group>();
    public DbSet<Student> Students => Set<Student>();
    public DbSet<ViolationCategory> ViolationCategories => Set<ViolationCategory>();
    public DbSet<AttendanceRecord> AttendanceRecords => Set<AttendanceRecord>();
    public DbSet<AttendanceDetail> AttendanceDetails => Set<AttendanceDetail>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<AttendanceDetail>()
            .HasOne(d => d.AttendanceRecord)
            .WithMany(r => r.Details)
            .HasForeignKey(d => d.AttendanceRecordId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<AttendanceDetail>()
            .HasOne(d => d.Student)
            .WithMany()
            .HasForeignKey(d => d.StudentId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Role>().HasData(
            new Role { Id = 1, Name = "Admin" },
            new Role { Id = 2, Name = "Dean" },
            new Role { Id = 3, Name = "Deputy Dean" }
        );

        modelBuilder.Entity<ViolationCategory>().HasData(
            new ViolationCategory { Id = 1, Name = "Nyzama gelmedik" },
            new ViolationCategory { Id = 2, Name = "Targetkasy ýok" },
            new ViolationCategory { Id = 3, Name = "Egin eşigi düzüw däl" }
        );
    }
}
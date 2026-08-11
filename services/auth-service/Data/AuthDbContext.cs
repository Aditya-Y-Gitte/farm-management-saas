using AuthService.Models;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Data;

/// <summary>
/// Database context for the Auth Service.
/// Connects to the isolated auth_db PostgreSQL database.
/// </summary>
public class AuthDbContext : DbContext
{
    public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.GoogleId).IsUnique();
            entity.HasIndex(u => u.Email).IsUnique();
            entity.HasIndex(u => u.TenantId);
        });

        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasIndex(rt => rt.TokenHash).IsUnique();
            entity.HasIndex(rt => rt.UserId);
            entity.HasOne(rt => rt.User)
                  .WithMany()
                  .HasForeignKey(rt => rt.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}

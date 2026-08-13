using CatalogApi.Models;
using Microsoft.EntityFrameworkCore;

namespace CatalogApi.Data;

/// <summary>
/// Database context for the Catalog Service.
/// Connects to the isolated catalog_db PostgreSQL database.
/// Applies global query filter for tenant isolation.
/// </summary>
public class CatalogDbContext : DbContext
{
    private readonly string _tenantId;

    public CatalogDbContext(DbContextOptions<CatalogDbContext> options, IHttpContextAccessor httpContextAccessor)
        : base(options)
    {
        // Extract tenant ID from the JWT claims (set by the gateway/auth middleware)
        _tenantId = httpContextAccessor.HttpContext?.User?.FindFirst("tenant_id")?.Value ?? string.Empty;
    }

    public DbSet<Livestock> Livestocks { get; set; }
    public DbSet<HealthRecord> HealthRecords { get; set; }
    public DbSet<BreedingCycle> BreedingCycles { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Global query filter ensures every query is scoped by tenant
        modelBuilder.Entity<Livestock>(entity =>
        {
            entity.HasQueryFilter(e => e.TenantId == _tenantId);
            entity.HasIndex(e => e.TenantId);
            entity.HasIndex(e => new { e.TenantId, e.TagNumber }).IsUnique(); // Unique Tag Number per farmer
        });

        modelBuilder.Entity<HealthRecord>(entity =>
        {
            entity.HasQueryFilter(e => e.TenantId == _tenantId);
            entity.HasIndex(e => e.TenantId);
            entity.HasOne(e => e.Livestock)
                  .WithMany(l => l.HealthRecords)
                  .HasForeignKey(e => e.LivestockId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<BreedingCycle>(entity =>
        {
            entity.HasQueryFilter(e => e.TenantId == _tenantId);
            entity.HasIndex(e => e.TenantId);
        });
    }

    /// <summary>
    /// Override SaveChanges to automatically stamp audit fields.
    /// </summary>
    public override int SaveChanges()
    {
        StampAuditFields();
        return base.SaveChanges();
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        StampAuditFields();
        return await base.SaveChangesAsync(cancellationToken);
    }

    private void StampAuditFields()
    {
        var entries = ChangeTracker.Entries<FarmManagement.SharedKernel.Models.BaseEntity>();

        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = DateTime.UtcNow;
                entry.Entity.UpdatedAt = DateTime.UtcNow;
                entry.Entity.TenantId = _tenantId;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = DateTime.UtcNow;
                // Prevent tenant ID from being changed
                entry.Property(e => e.TenantId).IsModified = false;
                entry.Property(e => e.CreatedAt).IsModified = false;
            }
        }
    }
}

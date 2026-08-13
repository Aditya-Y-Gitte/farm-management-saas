using FinanceApi.Models;
using Microsoft.EntityFrameworkCore;

namespace FinanceApi.Data;

/// <summary>
/// Database context for the Finance Service.
/// Connects to the isolated finance_db PostgreSQL database.
/// Applies global query filter for tenant isolation.
/// </summary>
public class FinanceDbContext : DbContext
{
    private readonly string _tenantId;

    public FinanceDbContext(DbContextOptions<FinanceDbContext> options, IHttpContextAccessor httpContextAccessor)
        : base(options)
    {
        _tenantId = httpContextAccessor.HttpContext?.User?.FindFirst("tenant_id")?.Value ?? string.Empty;
    }

    public DbSet<Income> Incomes { get; set; }
    public DbSet<Expense> Expenses { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Income>(entity =>
        {
            entity.HasQueryFilter(e => e.TenantId == _tenantId);
            entity.HasIndex(e => e.TenantId);
            entity.HasIndex(e => e.Date);
            entity.Property(e => e.Amount).HasPrecision(18, 2);
            entity.Property(e => e.Quantity).HasPrecision(18, 2);
            entity.Property(e => e.Rate).HasPrecision(18, 2);
        });

        modelBuilder.Entity<Expense>(entity =>
        {
            entity.HasQueryFilter(e => e.TenantId == _tenantId);
            entity.HasIndex(e => e.TenantId);
            entity.HasIndex(e => e.Date);
            entity.Property(e => e.Amount).HasPrecision(18, 2);
        });
    }

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
                entry.Property(e => e.TenantId).IsModified = false;
                entry.Property(e => e.CreatedAt).IsModified = false;
            }
        }
    }
}

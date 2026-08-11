using System.ComponentModel.DataAnnotations;

namespace FarmManagement.SharedKernel.Models;

/// <summary>
/// Base entity that all domain models inherit from.
/// Provides tenant isolation, audit trails, and consistent identity.
/// </summary>
public abstract class BaseEntity
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>
    /// Tenant identifier for multi-tenancy row-level isolation.
    /// Set automatically from JWT claims on create.
    /// </summary>
    [Required]
    [MaxLength(128)]
    public string TenantId { get; set; } = string.Empty;

    /// <summary>
    /// User ID of the creator (from JWT sub claim).
    /// </summary>
    [MaxLength(128)]
    public string CreatedBy { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

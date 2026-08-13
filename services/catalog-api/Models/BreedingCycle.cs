using System.ComponentModel.DataAnnotations;
using FarmManagement.SharedKernel.Models;

namespace CatalogApi.Models;

/// <summary>
/// Tracks the reproductive cycle of a dairy animal.
/// </summary>
public class BreedingCycle : BaseEntity
{
    [Required]
    public Guid LivestockId { get; set; }

    [Required]
    public DateTime BreedingDate { get; set; }

    [Required]
    [MaxLength(50)]
    public string Method { get; set; } = string.Empty;

    public DateTime? ExpectedDeliveryDate { get; set; }

    public DateTime? ActualDeliveryDate { get; set; }

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = string.Empty;

    public string Notes { get; set; } = string.Empty;

    // EF Navigation
    public Livestock Livestock { get; set; } = null!;
}

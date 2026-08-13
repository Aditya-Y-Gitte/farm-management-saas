using System.ComponentModel.DataAnnotations;
using FarmManagement.SharedKernel.Models;

namespace ProductionApi.Models;

/// <summary>
/// Dairy production record — belongs to the Production domain.
/// Inherits tenant isolation and audit fields from BaseEntity.
/// </summary>
public class Dairy : BaseEntity
{
    [Required]
    public Guid LivestockId { get; set; }

    [Required]
    public DateTime Date { get; set; }

    [Required]
    [MaxLength(20)]
    public string Session { get; set; } = string.Empty; // e.g., Morning, Evening

    [Required]
    [Range(0, 1000)]
    public decimal MilkYield { get; set; }

    [Range(0, 100)]
    public decimal FatContent { get; set; }

    [Range(0, 100)]
    public decimal? ProteinContent { get; set; }

    [Range(0, 100)]
    public decimal SnfContent { get; set; }

    [MaxLength(50)]
    public string Quality { get; set; } = string.Empty;
}

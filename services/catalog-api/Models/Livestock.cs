using System.ComponentModel.DataAnnotations;
using FarmManagement.SharedKernel.Models;

namespace CatalogApi.Models;

/// <summary>
/// Livestock entity — belongs to the Catalog domain.
/// Inherits tenant isolation and audit fields from BaseEntity.
/// Supports Indian farming context (Tag Numbers, Purchase info).
/// </summary>
public class Livestock : BaseEntity
{
    [MaxLength(50)]
    public string TagNumber { get; set; } = string.Empty;

    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Species { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Breed { get; set; } = string.Empty;

    public DateTime? DateOfBirth { get; set; }

    [MaxLength(20)]
    public string Gender { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Status { get; set; } = string.Empty; // e.g., Milking, Dry, Heifer, Sold, Deceased

    [MaxLength(50)]
    public string AcquisitionType { get; set; } = string.Empty; // e.g., BornOnFarm, Purchased

    public decimal? PurchasePrice { get; set; }

    public DateTime? PurchaseDate { get; set; }
}

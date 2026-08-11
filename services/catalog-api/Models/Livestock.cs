using System.ComponentModel.DataAnnotations;
using FarmManagement.SharedKernel.Models;

namespace CatalogApi.Models;

/// <summary>
/// Livestock entity — belongs to the Catalog domain.
/// Inherits tenant isolation and audit fields from BaseEntity.
/// </summary>
public class Livestock : BaseEntity
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Species { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Breed { get; set; } = string.Empty;

    public DateTime DateOfBirth { get; set; }

    [MaxLength(20)]
    public string Gender { get; set; } = string.Empty;

    [MaxLength(50)]
    public string HealthStatus { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Medication { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Vaccination { get; set; } = string.Empty;
}

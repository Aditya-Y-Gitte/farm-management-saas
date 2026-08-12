using CatalogApi.Models;

namespace CatalogApi.DTOs;

/// <summary>
/// Public response DTO for a Livestock record.
/// This is the only shape that leaves the catalog-api boundary.
/// The domain model (Livestock.cs) never crosses this boundary.
/// </summary>
public class LivestockDto
{
    public Guid Id { get; set; }
    public string TagNumber { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Species { get; set; } = string.Empty;
    public string Breed { get; set; } = string.Empty;
    public DateTime? DateOfBirth { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string AcquisitionType { get; set; } = string.Empty;
    public decimal? PurchasePrice { get; set; }
    public DateTime? PurchaseDate { get; set; }
    public string TenantId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

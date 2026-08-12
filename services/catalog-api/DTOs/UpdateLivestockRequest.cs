using System.ComponentModel.DataAnnotations;

namespace CatalogApi.DTOs;

/// <summary>
/// Request DTO for updating an existing Livestock record (PUT /api/catalog/livestock/{id}).
/// Only mutable fields are included — Id and TenantId cannot be changed via this DTO.
/// </summary>
public class UpdateLivestockRequest
{
    [MaxLength(50, ErrorMessage = "TagNumber must not exceed 50 characters.")]
    public string TagNumber { get; set; } = string.Empty;

    [MaxLength(200, ErrorMessage = "Name must not exceed 200 characters.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Species is required.")]
    [MaxLength(100, ErrorMessage = "Species must not exceed 100 characters.")]
    public string Species { get; set; } = string.Empty;

    [MaxLength(100, ErrorMessage = "Breed must not exceed 100 characters.")]
    public string Breed { get; set; } = string.Empty;

    public DateTime? DateOfBirth { get; set; }

    [MaxLength(20, ErrorMessage = "Gender must not exceed 20 characters.")]
    public string Gender { get; set; } = string.Empty;

    [MaxLength(50, ErrorMessage = "Status must not exceed 50 characters.")]
    public string Status { get; set; } = string.Empty;

    [MaxLength(50, ErrorMessage = "AcquisitionType must not exceed 50 characters.")]
    public string AcquisitionType { get; set; } = string.Empty;

    public decimal? PurchasePrice { get; set; }

    public DateTime? PurchaseDate { get; set; }
}

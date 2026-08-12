using System.ComponentModel.DataAnnotations;

namespace CatalogApi.DTOs;

/// <summary>
/// Request DTO for updating an existing Livestock record (PUT /api/catalog/livestock/{id}).
/// Only mutable fields are included — Id and TenantId cannot be changed via this DTO.
/// </summary>
public class UpdateLivestockRequest
{
    [Required(ErrorMessage = "Name is required.")]
    [MaxLength(200, ErrorMessage = "Name must not exceed 200 characters.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Species is required.")]
    [MaxLength(100, ErrorMessage = "Species must not exceed 100 characters.")]
    public string Species { get; set; } = string.Empty;

    [MaxLength(100, ErrorMessage = "Breed must not exceed 100 characters.")]
    public string Breed { get; set; } = string.Empty;

    public DateTime DateOfBirth { get; set; }

    [MaxLength(20, ErrorMessage = "Gender must not exceed 20 characters.")]
    public string Gender { get; set; } = string.Empty;

    [MaxLength(50, ErrorMessage = "Health status must not exceed 50 characters.")]
    public string HealthStatus { get; set; } = string.Empty;

    [MaxLength(500, ErrorMessage = "Medication must not exceed 500 characters.")]
    public string Medication { get; set; } = string.Empty;

    [MaxLength(500, ErrorMessage = "Vaccination must not exceed 500 characters.")]
    public string Vaccination { get; set; } = string.Empty;
}

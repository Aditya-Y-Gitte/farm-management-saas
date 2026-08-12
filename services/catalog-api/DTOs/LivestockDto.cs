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
    public string Name { get; set; } = string.Empty;
    public string Species { get; set; } = string.Empty;
    public string Breed { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string HealthStatus { get; set; } = string.Empty;
    public string Medication { get; set; } = string.Empty;
    public string Vaccination { get; set; } = string.Empty;
    public string TenantId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    /// <summary>
    /// Maps a Livestock domain entity to a LivestockDto.
    /// Explicit mapping — no AutoMapper, no reflection.
    /// </summary>
    public static LivestockDto FromEntity(Livestock entity) => new()
    {
        Id = entity.Id,
        Name = entity.Name,
        Species = entity.Species,
        Breed = entity.Breed,
        DateOfBirth = entity.DateOfBirth,
        Gender = entity.Gender,
        HealthStatus = entity.HealthStatus,
        Medication = entity.Medication,
        Vaccination = entity.Vaccination,
        TenantId = entity.TenantId,
        CreatedAt = entity.CreatedAt,
        UpdatedAt = entity.UpdatedAt
    };
}

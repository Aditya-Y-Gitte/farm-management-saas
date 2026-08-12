using ProductionApi.Models;

namespace ProductionApi.DTOs;

/// <summary>
/// Public response DTO for a Dairy production record.
/// This is the only shape returned from the production-api to consumers.
/// The domain model (Dairy.cs) never crosses this boundary.
/// </summary>
public class DairyDto
{
    public Guid Id { get; set; }
    public Guid LivestockId { get; set; }
    public DateTime Date { get; set; }
    public decimal MilkYield { get; set; }
    public decimal FatContent { get; set; }
    public decimal ProteinContent { get; set; }
    public string Quality { get; set; } = string.Empty;
    public string TenantId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    /// <summary>
    /// Maps a Dairy domain entity to a DairyDto.
    /// Explicit mapping — no AutoMapper, no reflection.
    /// </summary>
    public static DairyDto FromEntity(Dairy entity) => new()
    {
        Id = entity.Id,
        LivestockId = entity.LivestockId,
        Date = entity.Date,
        MilkYield = entity.MilkYield,
        FatContent = entity.FatContent,
        ProteinContent = entity.ProteinContent,
        Quality = entity.Quality,
        TenantId = entity.TenantId,
        CreatedAt = entity.CreatedAt,
        UpdatedAt = entity.UpdatedAt
    };
}

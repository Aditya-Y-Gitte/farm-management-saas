using System;

namespace CatalogApi.DTOs;

public class BreedingCycleDto
{
    public Guid Id { get; set; }
    public Guid LivestockId { get; set; }
    public DateTime BreedingDate { get; set; }
    public string Method { get; set; } = string.Empty;
    public DateTime? ExpectedDeliveryDate { get; set; }
    public DateTime? ActualDeliveryDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public string TenantId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

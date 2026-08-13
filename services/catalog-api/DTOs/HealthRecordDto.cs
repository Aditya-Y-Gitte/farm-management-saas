using System;

namespace CatalogApi.DTOs;

public class HealthRecordDto
{
    public Guid Id { get; set; }
    public Guid LivestockId { get; set; }
    public DateTime Date { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Diagnosis { get; set; } = string.Empty;
    public string Treatment { get; set; } = string.Empty;
    public string Medication { get; set; } = string.Empty;
    public string Veterinarian { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public string TenantId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

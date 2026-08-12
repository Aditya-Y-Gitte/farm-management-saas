using System.ComponentModel.DataAnnotations;

namespace ProductionApi.DTOs;

/// <summary>
/// Request DTO for updating an existing Dairy record (PUT /api/production/dairy/{id}).
/// LivestockId is mutable here (a record can be re-associated).
/// TenantId and Id are never part of the update payload.
/// </summary>
public class UpdateDairyRequest
{
    [Required(ErrorMessage = "Livestock ID is required.")]
    public Guid LivestockId { get; set; }

    [Required(ErrorMessage = "Date is required.")]
    public DateTime Date { get; set; }

    [Required(ErrorMessage = "Session is required.")]
    [MaxLength(20, ErrorMessage = "Session must not exceed 20 characters.")]
    public string Session { get; set; } = string.Empty;

    [Required(ErrorMessage = "Milk yield is required.")]
    [Range(0, 1000, ErrorMessage = "Milk yield must be between 0 and 1000.")]
    public decimal MilkYield { get; set; }

    [Range(0, 100, ErrorMessage = "Fat content must be between 0 and 100.")]
    public decimal FatContent { get; set; }

    [Range(0, 100, ErrorMessage = "SNF content must be between 0 and 100.")]
    public decimal SnfContent { get; set; }

    [MaxLength(50, ErrorMessage = "Quality must not exceed 50 characters.")]
    public string Quality { get; set; } = string.Empty;
}

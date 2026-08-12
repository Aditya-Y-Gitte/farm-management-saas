using System.ComponentModel.DataAnnotations;

namespace ProductionApi.DTOs;

/// <summary>
/// Request DTO for creating a new Dairy production record (POST /api/production/dairy).
/// Validated at the API boundary before reaching the service layer.
/// </summary>
public class CreateDairyRequest
{
    [Required(ErrorMessage = "LivestockId is required.")]
    public Guid LivestockId { get; set; }

    [Required(ErrorMessage = "Date is required.")]
    public DateTime Date { get; set; }

    [Required(ErrorMessage = "MilkYield is required.")]
    [Range(0, 1000, ErrorMessage = "MilkYield must be between 0 and 1000 litres.")]
    public decimal MilkYield { get; set; }

    [Range(0, 100, ErrorMessage = "FatContent must be between 0 and 100 percent.")]
    public decimal FatContent { get; set; }

    [Range(0, 100, ErrorMessage = "ProteinContent must be between 0 and 100 percent.")]
    public decimal ProteinContent { get; set; }

    [MaxLength(50, ErrorMessage = "Quality must not exceed 50 characters.")]
    public string Quality { get; set; } = string.Empty;
}

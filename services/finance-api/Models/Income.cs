using System.ComponentModel.DataAnnotations;
using FarmManagement.SharedKernel.Models;

namespace FinanceApi.Models;

/// <summary>
/// Represents money coming into the farm (e.g., milk sales, manure sales).
/// </summary>
public class Income : BaseEntity
{
    [Required]
    public DateTime Date { get; set; }

    [Required]
    [MaxLength(100)]
    public string Category { get; set; } = string.Empty; // e.g., MilkSale, ManureSale, AnimalSale, Subsidy, Other

    [Required]
    public decimal Amount { get; set; }

    public decimal? Quantity { get; set; }

    public decimal? Rate { get; set; }

    // Using MaxLength but allowing regional languages (NVARCHAR in DB)
    [MaxLength(200)]
    public string BuyerName { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Notes { get; set; } = string.Empty;
}

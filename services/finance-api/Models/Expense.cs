using System.ComponentModel.DataAnnotations;
using FarmManagement.SharedKernel.Models;

namespace FinanceApi.Models;

/// <summary>
/// Represents money leaving the farm (e.g., feed purchases, vet bills, labor).
/// </summary>
public class Expense : BaseEntity
{
    [Required]
    public DateTime Date { get; set; }

    [Required]
    [MaxLength(100)]
    public string Category { get; set; } = string.Empty; // e.g., FeedPurchase, VeterinaryAndMedicine, Labor, Maintenance, AnimalPurchase, Breeding, Other

    [Required]
    public decimal Amount { get; set; }

    [MaxLength(1000)]
    public string Notes { get; set; } = string.Empty;

    // Optional link to a specific animal or health record (avoids double entry)
    public Guid? RelatedEntityId { get; set; }
}

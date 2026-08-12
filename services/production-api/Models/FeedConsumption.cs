using System.ComponentModel.DataAnnotations;
using FarmManagement.SharedKernel.Models;

namespace ProductionApi.Models;

/// <summary>
/// Represents daily feed given to an animal or a herd.
/// If LivestockId is null, it means the feed was given to the entire herd.
/// </summary>
public class FeedConsumption : BaseEntity
{
    [Required]
    public DateTime Date { get; set; }

    [Required]
    [MaxLength(100)]
    public string FeedType { get; set; } = string.Empty; // e.g., GreenFodder, DryFodder, Concentrate, Supplements

    [Required]
    public decimal QuantityKg { get; set; }

    public decimal TotalCost { get; set; }

    public Guid? LivestockId { get; set; }
}

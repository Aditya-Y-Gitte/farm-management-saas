using System.ComponentModel.DataAnnotations;
using ProductionApi.Models;

namespace ProductionApi.DTOs;

public class FeedConsumptionDto
{
    public Guid Id { get; set; }
    public Guid? LivestockId { get; set; }
    public DateTime Date { get; set; }
    public string FeedType { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public string Unit { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
}

public class CreateFeedConsumptionRequest : IValidatableObject
{
    public Guid? LivestockId { get; set; }

    [Required]
    public DateTime Date { get; set; }

    [Required]
    [MaxLength(100)]
    public string FeedType { get; set; } = string.Empty;

    [Required]
    public decimal Quantity { get; set; }

    [Required]
    [MaxLength(20)]
    public string Unit { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Notes { get; set; } = string.Empty;

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (!Models.FeedType.All.Contains(FeedType))
        {
            yield return new ValidationResult($"Invalid FeedType. Allowed values: {string.Join(", ", Models.FeedType.All)}", new[] { nameof(FeedType) });
        }

        if (!Models.FeedUnit.All.Contains(Unit))
        {
            yield return new ValidationResult($"Invalid Unit. Allowed values: {string.Join(", ", Models.FeedUnit.All)}", new[] { nameof(Unit) });
        }

        if (Quantity <= 0)
        {
            yield return new ValidationResult("Quantity must be greater than zero.", new[] { nameof(Quantity) });
        }
    }
}

public class UpdateFeedConsumptionRequest : IValidatableObject
{
    public Guid? LivestockId { get; set; }

    [Required]
    public DateTime Date { get; set; }

    [Required]
    [MaxLength(100)]
    public string FeedType { get; set; } = string.Empty;

    [Required]
    public decimal Quantity { get; set; }

    [Required]
    [MaxLength(20)]
    public string Unit { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Notes { get; set; } = string.Empty;

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (!Models.FeedType.All.Contains(FeedType))
        {
            yield return new ValidationResult($"Invalid FeedType. Allowed values: {string.Join(", ", Models.FeedType.All)}", new[] { nameof(FeedType) });
        }

        if (!Models.FeedUnit.All.Contains(Unit))
        {
            yield return new ValidationResult($"Invalid Unit. Allowed values: {string.Join(", ", Models.FeedUnit.All)}", new[] { nameof(Unit) });
        }

        if (Quantity <= 0)
        {
            yield return new ValidationResult("Quantity must be greater than zero.", new[] { nameof(Quantity) });
        }
    }
}

using System.ComponentModel.DataAnnotations;
using CatalogApi.Models;

namespace CatalogApi.DTOs;

public class CreateBreedingCycleRequest : IValidatableObject
{
    [Required(ErrorMessage = "Livestock ID is required.")]
    public Guid LivestockId { get; set; }

    [Required(ErrorMessage = "Breeding Date is required.")]
    public DateTime BreedingDate { get; set; }

    [Required(ErrorMessage = "Method is required.")]
    [MaxLength(50)]
    public string Method { get; set; } = string.Empty;

    public DateTime? ExpectedDeliveryDate { get; set; }

    public DateTime? ActualDeliveryDate { get; set; }

    [Required(ErrorMessage = "Status is required.")]
    [MaxLength(50)]
    public string Status { get; set; } = string.Empty;

    public string Notes { get; set; } = string.Empty;

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (!BreedingStatus.All.Contains(Status))
        {
            yield return new ValidationResult($"Invalid Status. Allowed values: {string.Join(", ", BreedingStatus.All)}", new[] { nameof(Status) });
        }

        if (!BreedingMethod.All.Contains(Method))
        {
            yield return new ValidationResult($"Invalid Method. Allowed values: {string.Join(", ", BreedingMethod.All)}", new[] { nameof(Method) });
        }

        if (ExpectedDeliveryDate.HasValue && ExpectedDeliveryDate.Value.Date < BreedingDate.Date)
        {
            yield return new ValidationResult("Expected Delivery Date cannot be before Breeding Date.", new[] { nameof(ExpectedDeliveryDate) });
        }

        if (ActualDeliveryDate.HasValue && ActualDeliveryDate.Value.Date < BreedingDate.Date)
        {
            yield return new ValidationResult("Actual Delivery Date cannot be before Breeding Date.", new[] { nameof(ActualDeliveryDate) });
        }
    }
}

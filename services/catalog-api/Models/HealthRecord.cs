using System.ComponentModel.DataAnnotations;
using FarmManagement.SharedKernel.Models;

namespace CatalogApi.Models;

/// <summary>
/// Represents a veterinary or health event for a specific animal.
/// </summary>
public class HealthRecord : BaseEntity
{
    [Required]
    public Guid LivestockId { get; set; }

    [Required]
    public DateTime Date { get; set; }

    [Required]
    [MaxLength(100)]
    public string EventType { get; set; } = string.Empty; // e.g., Vaccination, Illness, RoutineCheckup, Deworming

    [Required]
    [MaxLength(200)]
    public string DiagnosisOrVaccine { get; set; } = string.Empty;

    public string TreatmentNotes { get; set; } = string.Empty;

    public decimal Cost { get; set; }
}

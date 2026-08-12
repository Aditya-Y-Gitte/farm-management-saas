using System.ComponentModel.DataAnnotations;
using FarmManagement.SharedKernel.Models;

namespace CatalogApi.Models;

/// <summary>
/// Tracks the reproductive cycle of a dairy animal.
/// </summary>
public class BreedingCycle : BaseEntity
{
    [Required]
    public Guid LivestockId { get; set; }

    [Required]
    public DateTime HeatDate { get; set; }

    public DateTime? InseminationDate { get; set; }

    public DateTime? PregnancyCheckDate { get; set; }

    public bool? IsPregnant { get; set; }

    public DateTime? ExpectedCalvingDate { get; set; }

    public DateTime? ActualCalvingDate { get; set; }

    public Guid? CalfId { get; set; }
}

using System.ComponentModel.DataAnnotations;

namespace CatalogApi.DTOs;

public class CreateHealthRecordRequest
{
    [Required(ErrorMessage = "Livestock ID is required.")]
    public Guid LivestockId { get; set; }

    [Required(ErrorMessage = "Date is required.")]
    public DateTime Date { get; set; }

    [Required(ErrorMessage = "Type is required.")]
    [MaxLength(100, ErrorMessage = "Type must not exceed 100 characters.")]
    public string Type { get; set; } = string.Empty;

    [MaxLength(500, ErrorMessage = "Description must not exceed 500 characters.")]
    public string Description { get; set; } = string.Empty;

    [MaxLength(200, ErrorMessage = "Diagnosis must not exceed 200 characters.")]
    public string Diagnosis { get; set; } = string.Empty;

    public string Treatment { get; set; } = string.Empty;

    [MaxLength(200, ErrorMessage = "Medication must not exceed 200 characters.")]
    public string Medication { get; set; } = string.Empty;

    [MaxLength(100, ErrorMessage = "Veterinarian must not exceed 100 characters.")]
    public string Veterinarian { get; set; } = string.Empty;

    public string Notes { get; set; } = string.Empty;
}

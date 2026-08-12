namespace ProductionApi.DTOs;

/// <summary>
/// Summary statistics for dairy production.
/// Extracted from its incorrect location inside IDairyRepository.cs (a layer violation).
/// This is a response DTO and belongs in the DTOs layer, not the Data Access layer.
/// </summary>
public class DairySummaryDto
{
    public decimal TotalMilkToday { get; set; }
    public decimal TotalMilkThisWeek { get; set; }
    public int TotalRecords { get; set; }
    public decimal AverageFatContent { get; set; }
    public decimal AverageProteinContent { get; set; }
}

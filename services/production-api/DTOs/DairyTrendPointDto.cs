namespace ProductionApi.DTOs;

public class DairyTrendPointDto
{
    public DateTime Date { get; set; }
    public decimal TotalMilk { get; set; }
    public decimal AverageFat { get; set; }
    public decimal? AverageProtein { get; set; }
    public decimal AverageSnf { get; set; }
}

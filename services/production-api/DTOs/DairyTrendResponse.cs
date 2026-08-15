namespace ProductionApi.DTOs;

public class DairyTrendResponse
{
    public IEnumerable<DairyTrendPointDto> Points { get; set; } = new List<DairyTrendPointDto>();
}

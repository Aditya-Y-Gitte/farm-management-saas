namespace ProductionApi.DTOs;

public sealed class DairyAlertDto
{
    public Guid LivestockId { get; init; }
    public string AlertType { get; init; } = default!;
    public DateTime Date { get; init; }
    public decimal CurrentValue { get; init; }
    public decimal BaselineValue { get; init; }
}

public sealed class DairyAlertResponseDto
{
    public IEnumerable<DairyAlertDto> Items { get; init; } = new List<DairyAlertDto>();
    public int TotalCount { get; init; }
}

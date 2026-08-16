namespace CatalogApi.DTOs;

public sealed class CatalogAlertDto
{
    public Guid LivestockId { get; init; }
    public string AlertType { get; init; } = default!;
    public DateTime Date { get; init; }
}

public sealed class CatalogAlertResponseDto
{
    public IEnumerable<CatalogAlertDto> Items { get; init; } = new List<CatalogAlertDto>();
    public int TotalCount { get; init; }
}

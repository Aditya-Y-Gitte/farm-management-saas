namespace CatalogApi.DTOs;

public class AttentionResponseDto
{
    public IEnumerable<LivestockDto> Items { get; set; } = new List<LivestockDto>();
    public int TotalCount { get; set; }
}

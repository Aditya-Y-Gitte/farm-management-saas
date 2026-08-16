namespace CatalogApi.DTOs;

public class CatalogSummaryDto
{
    public int TotalLivestock { get; set; }
    public int AttentionCount { get; set; }
    public Dictionary<string, int> SpeciesDistribution { get; set; } = new();
}

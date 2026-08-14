namespace CatalogApi.Models;

public static class LivestockStatuses
{
    public const string Active = "Active";
    public const string Sold = "Sold";
    public const string Deceased = "Deceased";
    public const string Lost = "Lost";
    public const string Sick = "Sick";
    public const string NeedsAttention = "Needs Attention";

    public static readonly string[] All = { Active, Sold, Deceased, Lost, Sick, NeedsAttention };
    
    public static readonly string[] RequiringAttention = { Sick, NeedsAttention };
}

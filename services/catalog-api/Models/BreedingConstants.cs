namespace CatalogApi.Models;

public static class BreedingStatus
{
    public const string Inseminated = "Inseminated";
    public const string Pregnant = "Pregnant";
    public const string Delivered = "Delivered";
    public const string Failed = "Failed";

    public static readonly string[] All = { Inseminated, Pregnant, Delivered, Failed };
}

public static class BreedingMethod
{
    public const string ArtificialInsemination = "AI";
    public const string Natural = "Natural";

    public static readonly string[] All = { ArtificialInsemination, Natural };
}

namespace ProductionApi.Models;

public static class FeedType
{
    public const string GreenFodder = "GreenFodder";
    public const string DryFodder = "DryFodder";
    public const string Concentrate = "Concentrate";
    public const string Supplements = "Supplements";
    public const string Other = "Other";

    public static readonly string[] All = { GreenFodder, DryFodder, Concentrate, Supplements, Other };
}

public static class FeedUnit
{
    public const string Kg = "Kg";
    public const string Lb = "Lb";
    public const string Bale = "Bale";
    public const string Bundle = "Bundle";

    public static readonly string[] All = { Kg, Lb, Bale, Bundle };
}

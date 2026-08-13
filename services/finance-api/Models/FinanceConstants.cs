namespace FinanceApi.Models;

public static class IncomeCategory
{
    public const string MilkSale = "MilkSale";
    public const string AnimalSale = "AnimalSale";
    public const string Subsidy = "Subsidy";
    public const string ManureSale = "ManureSale";
    public const string Other = "Other";

    public static readonly string[] All = { MilkSale, AnimalSale, Subsidy, ManureSale, Other };
}

public static class ExpenseCategory
{
    public const string FeedPurchase = "FeedPurchase";
    public const string Veterinary = "Veterinary";
    public const string Labor = "Labor";
    public const string Maintenance = "Maintenance";
    public const string AnimalPurchase = "AnimalPurchase";
    public const string Breeding = "Breeding";
    public const string Other = "Other";

    public static readonly string[] All = { FeedPurchase, Veterinary, Labor, Maintenance, AnimalPurchase, Breeding, Other };
}

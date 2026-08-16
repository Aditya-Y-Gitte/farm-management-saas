// appConstants.ts

export enum LivestockSpecies {
    Cow = 'Cow',
    Buffalo = 'Buffalo',
    Bull = 'Bull',
    Goat = 'Goat',
    Sheep = 'Sheep'
}
export const LIVESTOCK_SPECIES = Object.values(LivestockSpecies);

export enum LivestockGender {
    Female = 'Female',
    Male = 'Male'
}
export const LIVESTOCK_GENDERS = Object.values(LivestockGender);

export enum LivestockStatus {
    Active = 'Active',       // Currently on farm
    Sick = 'Sick',           // Needs attention
    NeedsAttention = 'Needs Attention', // Needs attention
    Sold = 'Sold',           // Sold to someone else
    Deceased = 'Deceased',   // Passed away
    Lost = 'Lost'            // Stolen or lost
}
export const LIVESTOCK_STATUSES = Object.values(LivestockStatus);

export enum AcquisitionType {
    BornOnFarm = 'BornOnFarm',
    Purchased = 'Purchased',
    Gifted = 'Gifted'
}
export const ACQUISITION_TYPES = Object.values(AcquisitionType);

export enum TransactionType {
    Income = 'income',
    Expense = 'expense'
}
export const TRANSACTION_TYPES = {
    INCOME: TransactionType.Income,
    EXPENSE: TransactionType.Expense
} as const;

export enum IncomeSource {
    MilkSales = 'Milk Sales',
    ManureSales = 'Manure/Dung Sales',
    AnimalSales = 'Animal Sales',
    GovtSubsidy = 'Government Subsidy',
    Other = 'Other'
}
export const INCOME_SOURCES = Object.values(IncomeSource);

export enum ExpenseCategory {
    FeedAndFodder = 'Feed & Fodder',
    VeterinaryAndMedicine = 'Veterinary & Medicine',
    Labor = 'Labor',
    EquipmentAndMaintenance = 'Equipment & Maintenance',
    AnimalPurchase = 'Animal Purchase',
    Miscellaneous = 'Miscellaneous'
}
export const EXPENSE_CATEGORIES = Object.values(ExpenseCategory);

export enum DairySession {
    Morning = 'Morning',
    Evening = 'Evening'
}
export const DAIRY_SESSIONS = Object.values(DairySession);

export enum DairyQuality {
    Excellent = 'Excellent',
    Good = 'Good',
    Fair = 'Fair',
    Poor = 'Poor'
}
export const DAIRY_QUALITIES = Object.values(DairyQuality);


export enum FeedType {
    GreenFodder = 'GreenFodder',
    DryFodder = 'DryFodder',
    Concentrate = 'Concentrate',
    Supplements = 'Supplements',
    Other = 'Other'
}
export const FEED_TYPES = Object.values(FeedType);

export enum FeedUnit {
    Kg = 'Kg',
    Lb = 'Lb',
    Bale = 'Bale',
    Bundle = 'Bundle'
}
export const FEED_UNITS = Object.values(FeedUnit);

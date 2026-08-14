import { 
    LivestockSpecies, 
    LivestockGender, 
    LivestockStatus, 
    AcquisitionType, 
    IncomeSource, 
    ExpenseCategory, 
    DairySession, 
    DairyQuality 
} from '../constants/appConstants';

// Animals
export const SPECIES_I18N_MAP: Record<string, "animals:species.cow" | "animals:species.buffalo" | "animals:species.bull" | "animals:species.goat" | "animals:species.sheep"> = {
    [LivestockSpecies.Cow]: "animals:species.cow",
    [LivestockSpecies.Buffalo]: "animals:species.buffalo",
    [LivestockSpecies.Bull]: "animals:species.bull",
    [LivestockSpecies.Goat]: "animals:species.goat",
    [LivestockSpecies.Sheep]: "animals:species.sheep",
};

export const GENDER_I18N_MAP: Record<string, "animals:gender.female" | "animals:gender.male"> = {
    [LivestockGender.Female]: "animals:gender.female",
    [LivestockGender.Male]: "animals:gender.male"
};

export const STATUS_I18N_MAP: Record<string, "animals:status.active" | "animals:status.sold" | "animals:status.deceased" | "animals:status.lost"> = {
    [LivestockStatus.Active]: "animals:status.active",
    [LivestockStatus.Sick]: "animals:status.active", // Fallback for Sick
    [LivestockStatus.NeedsAttention]: "animals:status.active", // Fallback for NeedsAttention
    [LivestockStatus.Sold]: "animals:status.sold",
    [LivestockStatus.Deceased]: "animals:status.deceased",
    [LivestockStatus.Lost]: "animals:status.lost"
};

export const ACQUISITION_I18N_MAP: Record<string, "animals:source.bornOnFarm" | "animals:source.purchased" | "animals:source.gifted"> = {
    [AcquisitionType.BornOnFarm]: "animals:source.bornOnFarm",
    [AcquisitionType.Purchased]: "animals:source.purchased",
    [AcquisitionType.Gifted]: "animals:source.gifted"
};

// Finance
export const INCOME_SOURCE_I18N_MAP: Record<string, "finance:category.milkSales" | "finance:category.manureSales" | "finance:category.animalSales" | "finance:category.subsidy" | "finance:category.other"> = {
    [IncomeSource.MilkSales]: "finance:category.milkSales",
    [IncomeSource.ManureSales]: "finance:category.manureSales",
    [IncomeSource.AnimalSales]: "finance:category.animalSales",
    [IncomeSource.GovtSubsidy]: "finance:category.subsidy",
    [IncomeSource.Other]: "finance:category.other"
};

export const EXPENSE_CATEGORY_I18N_MAP: Record<string, "finance:category.feed" | "finance:category.veterinary" | "finance:category.labor" | "finance:category.equipment" | "finance:category.animalPurchase" | "finance:category.miscellaneous"> = {
    [ExpenseCategory.FeedAndFodder]: "finance:category.feed",
    [ExpenseCategory.VeterinaryAndMedicine]: "finance:category.veterinary",
    [ExpenseCategory.Labor]: "finance:category.labor",
    [ExpenseCategory.EquipmentAndMaintenance]: "finance:category.equipment",
    [ExpenseCategory.AnimalPurchase]: "finance:category.animalPurchase",
    [ExpenseCategory.Miscellaneous]: "finance:category.miscellaneous"
};

// Dairy
export const DAIRY_SESSION_I18N_MAP: Record<string, "milk:session.morning" | "milk:session.evening"> = {
    [DairySession.Morning]: "milk:session.morning",
    [DairySession.Evening]: "milk:session.evening"
};

export const DAIRY_QUALITY_I18N_MAP: Record<string, "milk:quality.excellent" | "milk:quality.good" | "milk:quality.fair" | "milk:quality.poor"> = {
    [DairyQuality.Excellent]: "milk:quality.excellent",
    [DairyQuality.Good]: "milk:quality.good",
    [DairyQuality.Fair]: "milk:quality.fair",
    [DairyQuality.Poor]: "milk:quality.poor"
};

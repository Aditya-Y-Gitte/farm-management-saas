// dairy.ts
export interface Dairy {
    id: string;
    livestockId: string;
    date: string;
    session: string;
    milkYield: number;
    fatContent: number;
    snfContent: number;
    quality: string;
}

export interface DairyTrendPointDto {
    date: string;
    totalMilk: number;
    averageFat: number;
    averageProtein?: number;
    averageSnf: number;
}

export interface CreateDairyRequest {
    livestockId: string;
    date: string;
    session: string;
    milkYield: number;
    fatContent: number;
    snfContent: number;
    quality: string;
}

export interface FeedConsumption {
    id: string;
    livestockId?: string;
    date: string;
    feedType: string;
    quantity: number;
    cost: number;
    notes?: string;
}

export interface CreateFeedConsumptionRequest {
    livestockId?: string;
    date: string;
    feedType: string;
    quantity: number;
    cost: number;
    notes?: string;
}

export interface FeedConsumptionDto {
    id: string;
    livestockId?: string;
    date: string;
    feedType: string;
    quantity: number;
    unit: string;
    notes?: string;
}

export interface CreateFeedConsumptionRequest {
    livestockId?: string;
    date: string;
    feedType: string;
    quantity: number;
    unit: string;
    notes?: string;
}

export interface UpdateFeedConsumptionRequest {
    livestockId?: string;
    date: string;
    feedType: string;
    quantity: number;
    unit: string;
    notes?: string;
}

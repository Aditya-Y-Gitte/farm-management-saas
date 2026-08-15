export interface BreedingCycle {
    id: string;
    livestockId: string;
    breedingDate: string;
    method: string;
    expectedDeliveryDate?: string;
    actualDeliveryDate?: string;
    status: string;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateBreedingCycleRequest {
    livestockId: string;
    breedingDate: string;
    method: string;
    expectedDeliveryDate?: string;
    actualDeliveryDate?: string;
    status: string;
    notes?: string;
}

export interface UpdateBreedingCycleRequest {
    livestockId: string;
    breedingDate: string;
    method: string;
    expectedDeliveryDate?: string;
    actualDeliveryDate?: string;
    status: string;
    notes?: string;
}

export const BREEDING_STATUS = {
    INSEMINATED: 'Inseminated',
    PREGNANT: 'Pregnant',
    DELIVERED: 'Delivered',
    FAILED: 'Failed'
} as const;

export type BreedingStatus = typeof BREEDING_STATUS[keyof typeof BREEDING_STATUS];

export const BREEDING_METHOD = {
    ARTIFICIAL_INSEMINATION: 'AI',
    NATURAL: 'Natural'
} as const;

export type BreedingMethod = typeof BREEDING_METHOD[keyof typeof BREEDING_METHOD];

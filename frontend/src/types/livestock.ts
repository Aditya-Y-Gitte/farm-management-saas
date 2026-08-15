export interface HealthRecord {
    id: string;
    date: string;
    condition: string;
    treatment: string;
    veterinarian: string;
    cost: number;
    followUpDate?: string;
}

import { BreedingCycle } from './breeding';
export interface Livestock {
    id: string;
    tagNumber: string;
    name: string;
    species: string;
    breed: string;
    dateOfBirth: string;
    gender: string;
    status: string;
    acquisitionType: string;
    purchasePrice?: number;
    purchaseDate?: string;
    healthRecords: HealthRecord[];
    breedingCycles: BreedingCycle[];
}

export interface CreateLivestockRequest {
    tagNumber: string;
    name: string;
    species: string;
    breed: string;
    dateOfBirth: string;
    gender: string;
    status: string;
    acquisitionType: string;
    purchasePrice?: number;
    purchaseDate?: string;
}

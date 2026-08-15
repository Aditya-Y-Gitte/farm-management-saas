export interface HealthRecord {
    id: string;
    livestockId: string;
    date: string;
    type: string;
    description?: string;
    diagnosis?: string;
    treatment?: string;
    medication?: string;
    veterinarian?: string;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateHealthRecordRequest {
    livestockId: string;
    date: string;
    type: string;
    description?: string;
    diagnosis?: string;
    treatment?: string;
    medication?: string;
    veterinarian?: string;
    notes?: string;
}

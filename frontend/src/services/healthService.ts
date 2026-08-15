import apiClient from './apiClient';
import { PaginatedResponse } from './livestockService';
import { HealthRecord, CreateHealthRecordRequest } from '../types/health';

const BASE_PATH = '/api/catalog/health';

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/health');
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

// Stubs for future domain logic
export const getHealthRecordsByLivestockId = async (livestockId: string, page = 1, pageSize = 20): Promise<PaginatedResponse<HealthRecord>> => {
  const response = await apiClient.get(`${BASE_PATH}/livestock/${livestockId}`, { params: { page, pageSize } });
  return response.data;
};

export const createHealthRecord = async (record: CreateHealthRecordRequest): Promise<HealthRecord> => {
  const response = await apiClient.post(BASE_PATH, record);
  return response.data;
};

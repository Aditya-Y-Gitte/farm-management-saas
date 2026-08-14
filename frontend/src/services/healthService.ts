import apiClient from './apiClient';

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
export const getHealthRecords = async (livestockId: string) => {
  const response = await apiClient.get(`${BASE_PATH}?livestockId=${livestockId}`);
  return response.data;
};

export const createHealthRecord = async (record: any) => {
  const response = await apiClient.post(BASE_PATH, record);
  return response.data;
};

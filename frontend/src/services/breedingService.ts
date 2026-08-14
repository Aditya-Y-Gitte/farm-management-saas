import apiClient from './apiClient';

const BASE_PATH = '/api/catalog/breeding';

// Stubs for future domain logic
export const getBreedingCycles = async (livestockId: string) => {
  const response = await apiClient.get(`${BASE_PATH}?livestockId=${livestockId}`);
  return response.data;
};

export const getBreedingCycle = async (id: string) => {
  const response = await apiClient.get(`${BASE_PATH}/${id}`);
  return response.data;
};

export const createBreedingCycle = async (cycle: any) => {
  const response = await apiClient.post(BASE_PATH, cycle);
  return response.data;
};

export const updateBreedingCycle = async (id: string, cycle: any) => {
  await apiClient.put(`${BASE_PATH}/${id}`, cycle);
};

export const deleteBreedingCycle = async (id: string) => {
  await apiClient.delete(`${BASE_PATH}/${id}`);
};

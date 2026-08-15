import apiClient from './apiClient';
import { PaginatedResponse } from './livestockService';
import { BreedingCycle, CreateBreedingCycleRequest, UpdateBreedingCycleRequest } from '../types/breeding';

const BASE_PATH = '/api/catalog/breeding';

// Stubs for future domain logic
export const getBreedingCyclesByLivestockId = async (livestockId: string, page = 1, pageSize = 20): Promise<PaginatedResponse<BreedingCycle>> => {
  const response = await apiClient.get(`${BASE_PATH}/livestock/${livestockId}`, { params: { page, pageSize } });
  return response.data;
};

export const getBreedingCycle = async (id: string): Promise<BreedingCycle> => {
  const response = await apiClient.get(`${BASE_PATH}/${id}`);
  return response.data;
};

export const createBreedingCycle = async (cycle: CreateBreedingCycleRequest): Promise<BreedingCycle> => {
  const response = await apiClient.post(BASE_PATH, cycle);
  return response.data;
};

export const updateBreedingCycle = async (id: string, cycle: UpdateBreedingCycleRequest): Promise<BreedingCycle> => {
  const response = await apiClient.put(`${BASE_PATH}/${id}`, cycle);
  return response.data;
};

export const deleteBreedingCycle = async (id: string): Promise<void> => {
  await apiClient.delete(`${BASE_PATH}/${id}`);
};

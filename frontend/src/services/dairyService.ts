import apiClient from './apiClient';
import { Dairy, CreateDairyRequest } from '../types/dairy';
import { PaginatedResponse } from './livestockService';

const BASE_PATH = '/api/production/dairy';

export const getDairies = async (page = 1, pageSize = 20): Promise<PaginatedResponse<Dairy>> => {
  const response = await apiClient.get(BASE_PATH, { params: { page, pageSize } });
  return response.data;
};

export const getDairiesByLivestockId = async (id: string, page = 1, pageSize = 20): Promise<PaginatedResponse<Dairy>> => {
  const response = await apiClient.get(`${BASE_PATH}/livestock/${id}`, { params: { page, pageSize } });
  return response.data;
};

export const getDairy = async (id: string): Promise<Dairy> => {
  const response = await apiClient.get(`${BASE_PATH}/${id}`);
  return response.data;
};

export const createDairy = async (dairy: CreateDairyRequest): Promise<Dairy> => {
  const response = await apiClient.post(BASE_PATH, dairy);
  return response.data;
};

export const updateDairy = async (id: string, dairy: Dairy): Promise<void> => {
  await apiClient.put(`${BASE_PATH}/${id}`, dairy);
};

export const deleteDairy = async (id: string): Promise<void> => {
  await apiClient.delete(`${BASE_PATH}/${id}`);
};

export const getDairySummary = async (livestockId?: string) => {
  const params = livestockId ? { livestockId } : undefined;
  const response = await apiClient.get(`${BASE_PATH}/summary`, { params });
  return response.data;
};

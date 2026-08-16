import apiClient from './apiClient';
import { Livestock, CreateLivestockRequest } from '../types/livestock';

const BASE_PATH = '/api/catalog/livestock';

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const getLivestocks = async (page = 1, pageSize = 20): Promise<PaginatedResponse<Livestock>> => {
  const response = await apiClient.get(BASE_PATH, { params: { page, pageSize } });
  return response.data;
};

export const getLivestock = async (id: string): Promise<Livestock> => {
  const response = await apiClient.get(`${BASE_PATH}/${id}`);
  return response.data;
};

export const createLivestock = async (livestock: CreateLivestockRequest): Promise<Livestock> => {
  const response = await apiClient.post(BASE_PATH, livestock);
  return response.data;
};

export const updateLivestock = async (id: string, livestock: Livestock): Promise<void> => {
  await apiClient.put(`${BASE_PATH}/${id}`, livestock);
};

export const deleteLivestock = async (id: string): Promise<void> => {
  await apiClient.delete(`${BASE_PATH}/${id}`);
};

export const getLivestockCount = async (): Promise<{ totalLivestock: number }> => {
  const response = await apiClient.get(`${BASE_PATH}/count`);
  return response.data;
};

export const getCatalogSummary = async () => {
  const response = await apiClient.get('/api/catalog/summary');
  return response.data;
};

export const getAttentionLivestocks = async (limit = 5) => {
  const response = await apiClient.get(`${BASE_PATH}/attention`, { params: { limit } });
  return response.data;
};

export const getCatalogAlerts = async (limit = 5) => {
  const response = await apiClient.get(`${BASE_PATH}/alerts`, { params: { limit } });
  return response.data;
};

export const getLivestockBatch = async (ids: string[]): Promise<Livestock[]> => {
  if (ids.length === 0) return [];
  const response = await apiClient.get(`${BASE_PATH}/batch`, { params: { ids: ids.join(',') } });
  return response.data;
};

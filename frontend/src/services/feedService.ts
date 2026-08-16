import apiClient from './apiClient';
import { PaginatedResponse } from './livestockService';
import { FeedConsumptionDto, CreateFeedConsumptionRequest, UpdateFeedConsumptionRequest } from '../types/feed';

const API_PREFIX = '/api/production/feed-consumptions';

export const getFeedConsumptions = async (
    page: number = 1,
    pageSize: number = 20,
    startDate?: string,
    endDate?: string,
    livestockId?: string
): Promise<PaginatedResponse<FeedConsumptionDto>> => {
    const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString()
    });

    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (livestockId) params.append('livestockId', livestockId);

    const response = await apiClient.get<PaginatedResponse<FeedConsumptionDto>>(`${API_PREFIX}?${params.toString()}`);
    return response.data;
};

export const getFeedConsumptionById = async (id: string): Promise<FeedConsumptionDto> => {
    const response = await apiClient.get<FeedConsumptionDto>(`${API_PREFIX}/${id}`);
    return response.data;
};

export const createFeedConsumption = async (request: CreateFeedConsumptionRequest): Promise<FeedConsumptionDto> => {
    const response = await apiClient.post<FeedConsumptionDto>(API_PREFIX, request);
    return response.data;
};

export const updateFeedConsumption = async (id: string, request: UpdateFeedConsumptionRequest): Promise<FeedConsumptionDto> => {
    const response = await apiClient.put<FeedConsumptionDto>(`${API_PREFIX}/${id}`, request);
    return response.data;
};

export const deleteFeedConsumption = async (id: string): Promise<void> => {
    await apiClient.delete(`${API_PREFIX}/${id}`);
};

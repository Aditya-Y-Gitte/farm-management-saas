import api from './api';
import { Livestock } from '../types/livestock';

export const getLivestocks = async (): Promise<Livestock[]> => {
    const response = await api.get('/livestock');
    return response.data;
};

export const getLivestock = async (id: string): Promise<Livestock> => {
    const response = await api.get(`/livestock/${id}`);
    return response.data;
};

export const createLivestock = async (livestock: Omit<Livestock, 'id'>): Promise<Livestock> => {
    const response = await api.post('/livestock', livestock);
    return response.data;
};

export const updateLivestock = async (id: string, livestock: Livestock): Promise<void> => {
    await api.put(`/livestock/${id}`, livestock);
};

export const deleteLivestock = async (id: string): Promise<void> => {
    await api.delete(`/livestock/${id}`);
};

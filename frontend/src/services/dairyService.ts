import api from './api';
import { Dairy } from '../types/dairy';

export const getDairies = async (): Promise<Dairy[]> => {
    const response = await api.get('/dairy');
    return response.data;
};

export const getDairy = async (id: string): Promise<Dairy> => {
    const response = await api.get(`/dairy/${id}`);
    return response.data;
};

export const createDairy = async (dairy: Omit<Dairy, 'id'>): Promise<Dairy> => {
    const response = await api.post('/dairy', dairy);
    return response.data;
};

export const updateDairy = async (id: string, dairy: Dairy): Promise<void> => {
    await api.put(`/dairy/${id}`, dairy);
};

export const deleteDairy = async (id: string): Promise<void> => {
    await api.delete(`/dairy/${id}`);
};

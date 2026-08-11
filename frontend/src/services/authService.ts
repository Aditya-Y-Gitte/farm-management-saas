import apiClient from './apiClient';

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    displayName: string;
    avatarUrl: string;
    tenantId: string;
    role: string;
  };
}

export const loginWithGoogle = async (idToken: string): Promise<AuthResponse> => {
  const response = await apiClient.post('/api/auth/google', { idToken });
  return response.data;
};

export const refreshToken = async (): Promise<{ accessToken: string }> => {
  const response = await apiClient.post('/api/auth/refresh');
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await apiClient.get('/api/auth/me');
  return response.data;
};

export const logout = async (): Promise<void> => {
  await apiClient.post('/api/auth/logout');
};

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import config from '../config/app.config';

// Module-level token getter — set by AuthContext
let getAccessToken: () => string | null = () => null;
let refreshAccessToken: () => Promise<string | null> = async () => null;

/**
 * Registers the auth functions from AuthContext.
 * Called once when the app mounts.
 */
export const registerAuthFunctions = (
  tokenGetter: () => string | null,
  tokenRefresher: () => Promise<string | null>
) => {
  getAccessToken = tokenGetter;
  refreshAccessToken = tokenRefresher;
};

/**
 * Axios instance configured to:
 * 1. Send all requests through the API Gateway
 * 2. Automatically attach JWT Authorization header
 * 3. Auto-refresh expired tokens on 401
 */
const apiClient = axios.create({
  baseURL: config.apiGatewayUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send httpOnly cookies
});

// Request interceptor: attach JWT
apiClient.interceptors.request.use(
  (requestConfig: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && requestConfig.headers) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: auto-refresh on 401
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          processQueue(null, newToken);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return apiClient(originalRequest);
        } else {
          processQueue(new Error('Refresh failed'));
          // Redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

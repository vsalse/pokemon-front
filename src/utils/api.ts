import axios from 'axios';
// Definir el tipo Method manualmente
export type Method = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';
// Definir AxiosRequestConfig básico para evitar error de importación
export type AxiosRequestConfig = {
  headers?: Record<string, string>;
  params?: any;
  data?: any;
  [key: string]: any;
};

const getApiUrl = (): string => {
  if (typeof window !== 'undefined' && (window as any).REACT_APP_API_URL) {
    return (window as any).REACT_APP_API_URL;
  }
  return process.env.REACT_APP_API_URL || 'http://localhost:8080';
};

export const api = axios.create({
  baseURL: getApiUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function apiRequest<T = any>(
  method: Method,
  url: string,
  { data, params, ...config }: AxiosRequestConfig = {}
): Promise<T> {
  try {
    const response = await api.request<T>({ method, url, data, params, ...config });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw { message: error.message || 'Error de red', severity: 'fatal' };
  }
} 
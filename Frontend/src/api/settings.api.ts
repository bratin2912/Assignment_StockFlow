import axios from './axios';

export interface Settings {
  id: string;
  name: string;
  defaultLowStockThreshold: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSettingsInput {
  defaultLowStockThreshold?: number;
}

export const getSettings = async () => {
  return axios.get('/settings');
};

export const updateSettings = async (data: UpdateSettingsInput) => {
  return axios.put('/settings', data);
};
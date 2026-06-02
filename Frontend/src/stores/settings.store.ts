import { makeAutoObservable } from 'mobx';
import * as settingsApi from '../api/settings.api';

class SettingsStore {
  settings: settingsApi.Settings | null = null;
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchSettings() {
    this.isLoading = true;
    try {
      const res = await settingsApi.getSettings();
      this.settings = res.data;
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async updateSettings(data: settingsApi.UpdateSettingsInput) {
    try {
      const res = await settingsApi.updateSettings(data);
      this.settings = res.data;
      return res.data;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }
}

export const settingsStore = new SettingsStore();
import api from './api';
import { AdminUser, AdminUserCreateInput, AdminUserUpdateInput } from '../types/adminUser';

export interface SystemSetting {
  key: string;
  value: string;
  category: string;
  is_secure: boolean;
}

export interface SettingsUpdate {
  key: string;
  value: string;
}

export interface Settings {
  [category: string]: SystemSetting[];
}

const settingsService = {
  getAllSettings: async (): Promise<Settings> => {
    const response = await api.get('/settings');
    return response.data;
  },

  updateSettings: async (settings: SettingsUpdate[]): Promise<Settings> => {
    const response = await api.patch('/settings', { settings });
    return response.data;
  },

  getSettingsByCategory: async (category: string): Promise<SystemSetting[]> => {
    const response = await api.get(`/settings/category/${category}`);
    return response.data;
  },

  updateSecureSettings: async (settings: SettingsUpdate[]): Promise<Settings> => {
    const response = await api.put('/settings/secure', { settings });
    return response.data;
  },
  createAdminUser: async (user: AdminUserCreateInput): Promise<AdminUser> => {
    const response = await api.post('/settings/admins', user);
    return response.data;
  },

  // Update admin user
  updateAdminUser: async (id: string, updates: AdminUserUpdateInput): Promise<AdminUser> => {
    const response = await api.patch(`/settings/admins/${id}`, updates);
    return response.data;
  },

  // Delete admin user
  deleteAdminUser: async (id: string): Promise<void> => {
    await api.delete(`/settings/admins/${id}`);
  },
};

export default settingsService;
import api from './api';

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'superadmin';
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'superadmin';
}

export interface UpdateUserDto {
  email?: string;
  role?: 'admin' | 'superadmin';
  is_active?: boolean;
  password?: string;
}

const userService = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  createUser: async (userData: CreateUserDto): Promise<User> => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  updateUser: async (id: number, userData: UpdateUserDto): Promise<User> => {
    const response = await api.patch(`/admin/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  },

  toggleUserStatus: async (id: number, active: boolean): Promise<User> => {
    const response = await api.patch(`/admin/users/${id}/status`, { is_active: active });
    return response.data;
  },

  resetPassword: async (id: number): Promise<{ resetToken: string }> => {
    const response = await api.post(`/admin/users/${id}/reset-password`);
    return response.data;
  }
};

export default userService;
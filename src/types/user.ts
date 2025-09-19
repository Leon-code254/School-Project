export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export default User;
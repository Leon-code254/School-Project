export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'super_admin';
  status: 'active' | 'inactive';
  last_login?: string;
  created_at: string;
  updated_at: string;
  permissions?: string[];
}

export interface AdminUserCreateInput extends Omit<AdminUser, 'id' | 'created_at' | 'updated_at'> {
  password: string;
}

export interface AdminUserUpdateInput extends Partial<Omit<AdminUser, 'id' | 'created_at' | 'updated_at'>> {
  password?: string;
}

export default AdminUser;
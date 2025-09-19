export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'superadmin';
  last_login?: string;
  created_at: string;
  is_active: boolean;
}

export interface AdminUserInput extends Omit<AdminUser, 'id' | 'created_at' | 'last_login'> {
  password: string;
}

export interface SystemSettings {
  email: {
    smtp_host: string;
    smtp_port: string;
    smtp_user: string;
    smtp_password: string;
    from_email: string;
    from_name: string;
  };
  notifications: {
    alert_threshold: string;
    notification_frequency: string;
    enable_email_notifications: string;
    enable_sms_notifications: string;
  };
  api: {
    weather_api_key: string;
    soil_api_key: string;
    max_requests_per_minute: string;
  };
  security: {
    session_timeout: string;
    max_failed_attempts: string;
    password_expiry_days: string;
    require_2fa: string;
  };
}
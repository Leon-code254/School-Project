import api from './api';
import io from 'socket.io-client';

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
  link?: string;
}

export interface NotificationPreferences {
  email_notifications: boolean;
  push_notifications: boolean;
  notification_types: NotificationTypes;
}

export interface NotificationTypes {
  system_alerts: boolean;
  farm_updates: boolean;
  soil_readings: boolean;
  recommendations: boolean;
}

class NotificationService {
  private socket: ReturnType<typeof io> | null = null;
  private handlers: { [key: string]: ((data: any) => void)[] } = {};

  connect(userId: number, token: string) {
    if (this.socket) {
      return;
    }

    // Connect to WebSocket server with authentication
    const socket = io(process.env.REACT_APP_WS_URL || 'ws://localhost:3001', {
      auth: { token },
      query: { userId: userId.toString() }
    });

    // Set up event listeners
    socket.on('notification', (notification: Notification) => {
      this.triggerHandlers('notification', notification);
    });

    socket.on('connect_error', (error: Error) => {
      console.error('WebSocket connection error:', error);
    });

    this.socket = socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Add event handler
  on(event: string, handler: (data: any) => void) {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event].push(handler);
  }

  // Remove event handler
  off(event: string, handler: (data: any) => void) {
    if (!this.handlers[event]) return;
    this.handlers[event] = this.handlers[event].filter(h => h !== handler);
  }

  private triggerHandlers(event: string, data: any) {
    if (!this.handlers[event]) return;
    this.handlers[event].forEach(handler => handler(data));
  }

  // API methods for notifications
  async getNotifications(page = 1, limit = 20): Promise<{ notifications: Notification[], total: number }> {
    const response = await api.get(`/notifications?page=${page}&limit=${limit}`);
    return response.data;
  }

  async getUnreadCount(): Promise<number> {
    const response = await api.get('/notifications/unread-count');
    return response.data.count;
  }

  async markAsRead(notificationId: number): Promise<void> {
    await api.patch(`/notifications/${notificationId}/read`);
  }

  async markAllAsRead(): Promise<void> {
    await api.patch('/notifications/mark-all-read');
  }

  async deleteNotification(notificationId: number): Promise<void> {
    await api.delete(`/notifications/${notificationId}`);
  }

  async getPreferences(): Promise<NotificationPreferences> {
    const response = await api.get('/notifications/preferences');
    return response.data;
  }

  async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    const response = await api.patch('/notifications/preferences', preferences);
    return response.data;
  }
}

export const notificationService = new NotificationService();
export default notificationService;
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import NotificationsPopover from '../../components/notifications/NotificationsPopover';
import notificationService from '../../services/notificationService';
import { useAuth } from '../../hooks/useAuth';

// Mock the auth hook
vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

// Mock the notification service
vi.mock('../../services/notificationService', () => ({
  default: {
    connect: vi.fn(),
    disconnect: vi.fn(),
    getNotifications: vi.fn(),
    getUnreadCount: vi.fn(),
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  },
}));

describe('NotificationsPopover', () => {
  const mockUser = {
    id: 1,
    token: 'test-token',
  };

  const mockNotifications = [
    {
      id: 1,
      title: 'Test Notification',
      message: 'This is a test notification',
      type: 'info',
      read: false,
      created_at: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({ user: mockUser });
    (notificationService.getNotifications as any).mockResolvedValue({
      notifications: mockNotifications,
      total: 1,
    });
    (notificationService.getUnreadCount as any).mockResolvedValue(1);
  });

  test('connects to WebSocket on mount', async () => {
    render(<NotificationsPopover />);
    
    await waitFor(() => {
      expect(notificationService.connect).toHaveBeenCalledWith(
        mockUser.id,
        mockUser.token
      );
    });
  });

  test('loads notifications on mount', async () => {
    render(<NotificationsPopover />);
    
    await waitFor(() => {
      expect(notificationService.getNotifications).toHaveBeenCalled();
      expect(notificationService.getUnreadCount).toHaveBeenCalled();
    });

    expect(await screen.findByText('Test Notification')).toBeInTheDocument();
  });

  test('marks notification as read', async () => {
    render(<NotificationsPopover />);
    
    await screen.findByText('Test Notification');
    
    const markAsReadButton = screen.getByText('Mark as read');
    fireEvent.click(markAsReadButton);

    await waitFor(() => {
      expect(notificationService.markAsRead).toHaveBeenCalledWith(
        mockNotifications[0].id
      );
    });
  });

  test('marks all notifications as read', async () => {
    render(<NotificationsPopover />);
    
    await screen.findByText('Test Notification');
    
    const markAllAsReadButton = screen.getByText('Mark all as read');
    fireEvent.click(markAllAsReadButton);

    await waitFor(() => {
      expect(notificationService.markAllAsRead).toHaveBeenCalled();
    });
  });

  test('disconnects WebSocket on unmount', () => {
    const { unmount } = render(<NotificationsPopover />);
    unmount();
    expect(notificationService.disconnect).toHaveBeenCalled();
  });

  test('handles WebSocket notifications', async () => {
    render(<NotificationsPopover />);

    const newNotification = {
      id: 2,
      title: 'New Notification',
      message: 'This is a new notification',
      type: 'success',
      read: false,
      created_at: new Date().toISOString(),
    };

    // Simulate receiving a new notification
    const [callback] = (notificationService.on as any).mock.calls[0];
    callback(newNotification);

    expect(await screen.findByText('New Notification')).toBeInTheDocument();
  });
});
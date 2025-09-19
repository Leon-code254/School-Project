import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import NotificationSettings from '../../pages/settings/NotificationSettings';
import notificationService from '../../services/notificationService';

// Mock the notification service
vi.mock('../../services/notificationService', () => ({
  default: {
    getPreferences: vi.fn(),
    updatePreferences: vi.fn(),
  },
}));

describe('NotificationSettings', () => {
  const mockPreferences = {
    email_notifications: true,
    push_notifications: false,
    notification_types: {
      system_alerts: true,
      farm_updates: true,
      soil_readings: false,
      recommendations: true,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (notificationService.getPreferences as any).mockResolvedValue(mockPreferences);
  });

  test('loads notification preferences on mount', async () => {
    render(<NotificationSettings />);

    await waitFor(() => {
      expect(notificationService.getPreferences).toHaveBeenCalled();
    });

    // Check if switches reflect the preferences
    const emailSwitch = screen.getByRole('checkbox', { name: /email notifications/i });
    const pushSwitch = screen.getByRole('checkbox', { name: /push notifications/i });

    expect(emailSwitch).toBeChecked();
    expect(pushSwitch).not.toBeChecked();
  });

  test('updates notification preferences on toggle', async () => {
    render(<NotificationSettings />);

    await waitFor(() => {
      expect(screen.getByRole('checkbox', { name: /email notifications/i })).toBeInTheDocument();
    });

    const emailSwitch = screen.getByRole('checkbox', { name: /email notifications/i });
    fireEvent.click(emailSwitch);

    await waitFor(() => {
      expect(notificationService.updatePreferences).toHaveBeenCalledWith({
        email_notifications: false,
      });
    });
  });

  test('updates notification type preferences', async () => {
    render(<NotificationSettings />);

    await waitFor(() => {
      expect(screen.getByRole('checkbox', { name: /system alerts/i })).toBeInTheDocument();
    });

    const systemAlertsSwitch = screen.getByRole('checkbox', { name: /system alerts/i });
    fireEvent.click(systemAlertsSwitch);

    await waitFor(() => {
      expect(notificationService.updatePreferences).toHaveBeenCalledWith({
        notification_types: {
          ...mockPreferences.notification_types,
          system_alerts: false,
        },
      });
    });
  });

  test('displays success message after update', async () => {
    (notificationService.updatePreferences as any).mockResolvedValue({
      ...mockPreferences,
      email_notifications: false,
    });

    render(<NotificationSettings />);

    await waitFor(() => {
      expect(screen.getByRole('checkbox', { name: /email notifications/i })).toBeInTheDocument();
    });

    const emailSwitch = screen.getByRole('checkbox', { name: /email notifications/i });
    fireEvent.click(emailSwitch);

    expect(await screen.findByText('Preferences updated successfully')).toBeInTheDocument();
  });

  test('displays error message on API failure', async () => {
    (notificationService.updatePreferences as any).mockRejectedValue(new Error('API Error'));

    render(<NotificationSettings />);

    await waitFor(() => {
      expect(screen.getByRole('checkbox', { name: /email notifications/i })).toBeInTheDocument();
    });

    const emailSwitch = screen.getByRole('checkbox', { name: /email notifications/i });
    fireEvent.click(emailSwitch);

    expect(await screen.findByText('Failed to update preferences')).toBeInTheDocument();
  });
});
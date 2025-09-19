import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  FormGroup,
  Divider,
  Alert,
  Skeleton,
} from '@mui/material';
import notificationService, { NotificationPreferences, NotificationTypes } from '../../services/notificationService';

export default function NotificationSettings() {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const prefs = await notificationService.getPreferences();
      setPreferences(prefs);
      setError(null);
    } catch (err) {
      setError('Failed to load notification preferences');
      console.error('Error loading preferences:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (
    field: keyof Omit<NotificationPreferences, 'notification_types'> | keyof NotificationTypes,
    isNotificationType = false
  ) => {
    if (!preferences) return;

    try {
      let updatedPreferences: Partial<NotificationPreferences>;
      
      if (isNotificationType) {
        updatedPreferences = {
          notification_types: {
            ...preferences.notification_types,
            [field]: !preferences.notification_types[field as keyof NotificationTypes]
          }
        };
      } else {
        updatedPreferences = {
          [field]: !preferences[field as keyof Omit<NotificationPreferences, 'notification_types'>]
        };
      }

      const updated = await notificationService.updatePreferences(updatedPreferences);
      setPreferences(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update preferences');
      console.error('Error updating preferences:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 600, margin: '0 auto', mt: 4 }}>
        <Skeleton variant="rectangular" height={200} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto', mt: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Preferences updated successfully
        </Alert>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Notification Settings
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences?.email_notifications ?? false}
                  onChange={() => handleToggle('email_notifications')}
                />
              }
              label="Email Notifications"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={preferences?.push_notifications ?? false}
                  onChange={() => handleToggle('push_notifications')}
                />
              }
              label="Push Notifications"
            />
          </FormGroup>

          <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }}>
            Notification Types
          </Typography>

          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences?.notification_types.system_alerts ?? false}
                  onChange={() => handleToggle('system_alerts', true)}
                />
              }
              label="System Alerts"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={preferences?.notification_types.farm_updates ?? false}
                  onChange={() => handleToggle('farm_updates', true)}
                />
              }
              label="Farm Updates"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={preferences?.notification_types.soil_readings ?? false}
                  onChange={() => handleToggle('soil_readings', true)}
                />
              }
              label="Soil Reading Updates"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={preferences?.notification_types.recommendations ?? false}
                  onChange={() => handleToggle('recommendations', true)}
                />
              }
              label="Recommendation Updates"
            />
          </FormGroup>
        </CardContent>
      </Card>
    </Box>
  );
}
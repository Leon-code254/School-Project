import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  TextField,
  FormControlLabel,
  Switch,
  Divider,
  Card,
  CardContent,
  CardHeader
} from '@mui/material';
import { GridContainerItem, GridItem } from '../../components/common/Grid';
import settingsService from '../../services/settingsService';

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await settingsService.getAllSettings();
      setSettings(data);
    } catch (err) {
      setError('Failed to load settings. Please try again.');
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const updates = Object.entries(settings)
        .filter(([_, setting]) => setting.dirty)
        .map(([key, setting]) => ({
          key,
          value: setting.value
        }));

      if (updates.length > 0) {
        await settingsService.updateSettings(updates);
        setSuccess('Settings updated successfully');
        setDirty(false);
      }
    } catch (err) {
      setError('Failed to save settings. Please try again.');
      console.error('Error saving settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setSettings(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        value,
        dirty: true
      }
    }));
    setDirty(true);
  };

  if (loading && !settings) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        System Settings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <GridContainerItem spacing={3}>
        {Object.entries(settings).map(([category, items]: [string, any[]]) => (
          <GridItem xs={12} md={6} key={category}>
            <Card>
              <CardHeader
                title={category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              />
              <CardContent>
                <GridContainerItem spacing={2}>
                  {items.map(setting => (
                    <GridItem xs={12} key={setting.key}>
                      {setting.type === 'boolean' ? (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={setting.value === 'true'}
                              onChange={handleChange(setting.key)}
                              name={setting.key}
                            />
                          }
                          label={setting.name}
                        />
                      ) : (
                        <TextField
                          fullWidth
                          label={setting.name}
                          value={setting.value}
                          onChange={handleChange(setting.key)}
                          type={setting.type === 'number' ? 'number' : 'text'}
                          multiline={setting.type === 'text'}
                          rows={setting.type === 'text' ? 4 : 1}
                          helperText={setting.description}
                        />
                      )}
                    </GridItem>
                  ))}
                </GridContainerItem>
              </CardContent>
            </Card>
          </GridItem>
        ))}
      </GridContainerItem>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={!dirty || loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;
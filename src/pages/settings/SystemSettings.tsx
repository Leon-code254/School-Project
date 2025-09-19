import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import settingsService from '../../services/settingsService';
import { AdminUser, SystemSettings } from '../../types/admin';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
      sx={{ py: 3 }}
    >
      {value === index && children}
    </Box>
  );
}

const SystemSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [settings, setSettings] = useState<SystemSettings>({
    email: {
      smtp_host: '',
      smtp_port: '',
      smtp_user: '',
      smtp_password: '',
      from_email: '',
      from_name: ''
    },
    notifications: {
      alert_threshold: '80',
      notification_frequency: '24',
      enable_email_notifications: 'true',
      enable_sms_notifications: 'false'
    },
    api: {
      weather_api_key: '',
      soil_api_key: '',
      max_requests_per_minute: '60'
    },
    security: {
      session_timeout: '30',
      max_failed_attempts: '5',
      password_expiry_days: '90',
      require_2fa: 'false'
    }
  });
  
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await settingsService.getAllSettings();
        setSettings(prevSettings => ({
          ...prevSettings,
          ...Object.fromEntries(
            Object.entries(data).map(([category, settingsList]) => [
              category,
              Object.fromEntries(
                settingsList.map(setting => [setting.key, setting.value])
              )
            ])
          )
        }));
        setError(null);
      } catch (err) {
        setError('Failed to load settings');
        console.error('Error loading settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSettingChange = (category: keyof SystemSettings, key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSave = async (category: keyof SystemSettings) => {
    try {
      const updates = Object.entries(settings[category]).map(([key, value]) => ({
        key: `${category}.${key}`,
        value: value.toString()
      }));

      await settingsService.updateSettings(updates);
      setSuccess(`${category.charAt(0).toUpperCase() + category.slice(1)} settings updated successfully`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to update settings');
      console.error('Error updating settings:', err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        System Settings
      </Typography>

      <Paper sx={{ mt: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="settings tabs">
            <Tab label="Email" />
            <Tab label="Notifications" />
            <Tab label="API Integration" />
            <Tab label="Security" />
            <Tab label="Admin Users" />
          </Tabs>
        </Box>

        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ m: 2 }}>
            {success}
          </Alert>
        )}

        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid container item xs={12} md={6}>
              <Card sx={{ width: '100%' }}>
                <CardHeader title="SMTP Configuration" />
                <Divider />
                <CardContent>
                  <Box component="form" noValidate autoComplete="off">
                    <Grid container spacing={2}>
                      <Grid container item xs={12}>
                        <TextField
                          fullWidth
                          label="SMTP Host"
                          value={settings.email.smtp_host}
                          onChange={(e) => handleSettingChange('email', 'smtp_host', e.target.value)}
                        />
                      </Grid>
                      <Grid container item xs={12}>
                        <TextField
                          fullWidth
                          label="SMTP Port"
                          type="number"
                          value={settings.email.smtp_port}
                          onChange={(e) => handleSettingChange('email', 'smtp_port', e.target.value)}
                        />
                      </Grid>
                      <Grid container item xs={12}>
                        <TextField
                          fullWidth
                          label="SMTP User"
                          value={settings.email.smtp_user}
                          onChange={(e) => handleSettingChange('email', 'smtp_user', e.target.value)}
                        />
                      </Grid>
                      <Grid container item xs={12}>
                        <TextField
                          fullWidth
                          label="SMTP Password"
                          type={showPassword ? 'text' : 'password'}
                          value={settings.email.smtp_password}
                          onChange={(e) => handleSettingChange('email', 'smtp_password', e.target.value)}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                >
                                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid container item xs={12} md={6}>
              <Card sx={{ width: '100%' }}>
                <CardHeader title="Sender Information" />
                <Divider />
                <CardContent>
                  <Box component="form" noValidate autoComplete="off">
                    <Grid container spacing={2}>
                      <Grid container item xs={12}>
                        <TextField
                          fullWidth
                          label="From Email"
                          type="email"
                          value={settings.email.from_email}
                          onChange={(e) => handleSettingChange('email', 'from_email', e.target.value)}
                        />
                      </Grid>
                      <Grid container item xs={12}>
                        <TextField
                          fullWidth
                          label="From Name"
                          value={settings.email.from_name}
                          onChange={(e) => handleSettingChange('email', 'from_name', e.target.value)}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid container item xs={12}>
              <Box display="flex" justifyContent="flex-end" width="100%">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSave('email')}
                >
                  Save Email Settings
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Other tab panels... */}
      </Paper>
    </Box>
  );
};

export default SystemSettingsPage;
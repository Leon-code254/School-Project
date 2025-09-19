import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store';

// Import layouts
import AdminLayout from './layouts/AdminLayout';

// Import pages
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import UserManagement from './pages/users/UserManagement';
import UserDetail from './pages/users/UserDetail';
import FarmManagement from './pages/farms/FarmManagement';
import SystemSettings from './pages/settings/SystemSettings';

// Import components
import PrivateRoute from './components/common/PrivateRoute';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Green color for agricultural theme
    },
    secondary: {
      main: '#ff8f00', // Amber for contrast
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route element={<PrivateRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/users/:id" element={<UserDetail />} />
                <Route path="/farms" element={<FarmManagement />} />
                <Route path="/settings" element={<SystemSettings />} />
              </Route>
            </Route>
            
            {/* Error pages */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

// Simple 404 page
const NotFoundPage: React.FC = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <button onClick={() => window.location.href = '/'}>
        Return to Dashboard
      </button>
    </div>
  );
};

export default App;

import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import AdminLayout from '../layouts/AdminLayout';

// Lazy load all pages
const Dashboard = React.lazy(() => import('../pages/dashboard/Dashboard'));
const UserManagement = React.lazy(() => import('../pages/users/UserManagement'));
const FarmManagement = React.lazy(() => import('../pages/farms/FarmManagement'));
const FAQs = React.lazy(() => import('../pages/help/FAQs'));
const SupportTickets = React.lazy(() => import('../pages/help/SupportTickets'));
const Settings = React.lazy(() => import('../pages/settings/Settings'));
const NotificationSettings = React.lazy(() => import('../pages/settings/NotificationSettings'));

// Loading fallback component
const LoadingFallback = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="400px"
    width="100%"
  >
    <CircularProgress />
  </Box>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          <Route
            path="dashboard"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Dashboard />
              </Suspense>
            }
          />
          
          <Route
            path="users/*"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <UserManagement />
              </Suspense>
            }
          />
          
          <Route
            path="farms/*"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <FarmManagement />
              </Suspense>
            }
          />
          
          <Route
            path="help/faq"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <FAQs />
              </Suspense>
            }
          />
          
          <Route
            path="help/support"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <SupportTickets />
              </Suspense>
            }
          />
          
          <Route
            path="settings"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Settings />
              </Suspense>
            }
          />
          
          <Route
            path="settings/notifications"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <NotificationSettings />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </Suspense>
  );
}
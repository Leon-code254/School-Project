import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../store';

interface PrivateRouteProps {
  redirectPath?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ redirectPath = '/login' }) => {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  // Show loading indicator while checking authentication
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // Render child routes if authenticated
  return <Outlet />;
};

export default PrivateRoute;
import React from 'react';
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { navigationItems } from '../../config/navigation';

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Find the current page title from navigation items
  const getCurrentPageTitle = (path: string) => {
    const item = navigationItems.find(item => item.path === `/${path}`);
    return item ? item.title : path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <MuiBreadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
      <Link component={RouterLink} to="/" color="inherit">
        Home
      </Link>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        return last ? (
          <Typography color="text.primary" key={to}>
            {getCurrentPageTitle(value)}
          </Typography>
        ) : (
          <Link component={RouterLink} to={to} color="inherit" key={to}>
            {getCurrentPageTitle(value)}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs;
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Grass as GrassIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

export const navigationItems = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: DashboardIcon,
    requiredRole: ['admin', 'superadmin']
  },
  {
    title: 'User Management',
    path: '/users',
    icon: PeopleIcon,
    requiredRole: ['superadmin']
  },
  {
    title: 'Farm Management',
    path: '/farms',
    icon: GrassIcon,
    requiredRole: ['admin', 'superadmin']
  },
  {
    title: 'Analytics',
    path: '/analytics',
    icon: BarChartIcon,
    requiredRole: ['admin', 'superadmin']
  },
  {
    title: 'System Settings',
    path: '/settings',
    icon: SettingsIcon,
    requiredRole: ['superadmin']
  }
];
import { createTheme } from '@mui/material/styles';

const baseTheme = {
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 500 },
    h2: { fontWeight: 500 },
    h3: { fontWeight: 500 },
    h4: { fontWeight: 500 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none' as const,
        },
      },
    },
  },
};

export const defaultTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#2E7D32',
      light: '#4CAF50',
      dark: '#1B5E20',
    },
    secondary: {
      main: '#FF9800',
      light: '#FFB74D',
      dark: '#F57C00',
    },
    error: {
      main: '#D32F2F',
      light: '#EF5350',
      dark: '#C62828',
    },
    warning: {
      main: '#ED6C02',
      light: '#FF9800',
      dark: '#E65100',
    },
    info: {
      main: '#0288D1',
      light: '#03A9F4',
      dark: '#01579B',
    },
    success: {
      main: '#2E7D32',
      light: '#4CAF50',
      dark: '#1B5E20',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
  },
});

export const highContrastTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFFFFF',
      light: '#E0E0E0',
      dark: '#BDBDBD',
      contrastText: '#000000',
    },
    secondary: {
      main: '#FFEB3B',
      light: '#FFF176',
      dark: '#FBC02D',
      contrastText: '#000000',
    },
    error: {
      main: '#FF1744',
      light: '#FF4081',
      dark: '#D50000',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FFD740',
      light: '#FFE57F',
      dark: '#FFC400',
      contrastText: '#000000',
    },
    info: {
      main: '#40C4FF',
      light: '#80D8FF',
      dark: '#00B0FF',
      contrastText: '#000000',
    },
    success: {
      main: '#69F0AE',
      light: '#B9F6CA',
      dark: '#00C853',
      contrastText: '#000000',
    },
    background: {
      default: '#000000',
      paper: '#212121',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#E0E0E0',
      disabled: '#757575',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
    action: {
      active: '#FFFFFF',
      hover: 'rgba(255, 255, 255, 0.08)',
      selected: 'rgba(255, 255, 255, 0.16)',
      disabled: 'rgba(255, 255, 255, 0.3)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
    },
  },
});
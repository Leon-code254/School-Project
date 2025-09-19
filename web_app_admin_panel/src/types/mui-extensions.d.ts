// This file provides custom type declarations for Material-UI components

import { ComponentsPropsList } from '@mui/material';

// Extend Grid properties
declare module '@mui/material/Grid' {
  interface GridOwnProps {
    item?: boolean;
    container?: boolean;
    xs?: number | boolean;
    sm?: number | boolean;
    md?: number | boolean;
    lg?: number | boolean;
    xl?: number | boolean;
    spacing?: number;
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    zeroMinWidth?: boolean;
  }
}

// Extend global theme declarations
declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }

  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}
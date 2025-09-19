import React from 'react';
import { Grid, GridProps as MuiGridProps } from '@mui/material';

// Re-export MUI's grid props with ReactNode children
export interface GridProps extends MuiGridProps {
  children?: React.ReactNode;
}

// Add specific props for responsive grid components
export interface ResponsiveGridProps extends MuiGridProps {
  children?: React.ReactNode;
  xs?: number | boolean;
  sm?: number | boolean;
  md?: number | boolean;
  lg?: number | boolean;
  spacing?: number;
}

/**
 * A wrapper around Material-UI's Grid component that sets some default props
 * and ensures proper type definitions are used.
 */
export const GridItem = (props: ResponsiveGridProps) => (
  <Grid
    item
    {...props}
  />
);

/**
 * A wrapper around Material-UI's Grid component for container+item combinations
 * since these are commonly used together.
 */
export const GridContainerItem = (props: ResponsiveGridProps) => (
  <Grid
    container
    item
    {...props}
  />
);

export default {
  GridItem,
  GridContainerItem
};
import { ElementType } from 'react';
import { Theme } from '@mui/material/styles';
import { GridSize } from '@mui/material';

export interface GridProps {
  children?: React.ReactNode;
  component?: ElementType;
  container?: boolean;
  item?: boolean;
  spacing?: number;
  xs?: GridSize;
  sm?: GridSize;
  md?: GridSize;
  lg?: GridSize;
  xl?: GridSize;
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
}

export type { GridSize };
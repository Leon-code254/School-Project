/**
 * This is a workaround for TypeScript errors with Material-UI Grid component
 * It allows using the item prop without TypeScript complaining
 */

import React from 'react';

declare module '@mui/material/Grid' {
  interface GridProps {
    item?: boolean;
  }
}
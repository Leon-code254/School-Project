import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Contrast as ContrastIcon } from '@mui/icons-material';
import { useTheme } from '../../theme/ThemeProvider';

export default function HighContrastToggle() {
  const { isHighContrast, toggleHighContrast } = useTheme();

  return (
    <Tooltip title={`${isHighContrast ? 'Disable' : 'Enable'} high contrast mode`}>
      <IconButton
        onClick={toggleHighContrast}
        color="inherit"
        aria-label="toggle high contrast mode"
      >
        <ContrastIcon />
      </IconButton>
    </Tooltip>
  );
}
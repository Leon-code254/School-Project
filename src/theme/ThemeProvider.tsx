import React, { createContext, useContext, useState } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { defaultTheme, highContrastTheme } from './themes';

interface ThemeContextType {
  isHighContrast: boolean;
  toggleHighContrast: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isHighContrast, setIsHighContrast] = useState(() => {
    const saved = localStorage.getItem('high-contrast-mode');
    return saved === 'true';
  });

  const toggleHighContrast = () => {
    setIsHighContrast((prev) => {
      const newValue = !prev;
      localStorage.setItem('high-contrast-mode', newValue.toString());
      return newValue;
    });
  };

  return (
    <ThemeContext.Provider value={{ isHighContrast, toggleHighContrast }}>
      <MuiThemeProvider theme={isHighContrast ? highContrastTheme : defaultTheme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
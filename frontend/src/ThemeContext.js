import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const ThemeModeContext = createContext();

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    background: {
      default: mode === 'dark' ? '#181A20' : '#fff',
      paper: mode === 'dark' ? '#23262F' : '#f5f5f5',
    },
    text: {
      primary: mode === 'dark' ? '#F4F4F4' : '#181A20',
      secondary: mode === 'dark' ? '#B0B3B8' : '#444',
    },
    primary: { main: mode === 'dark' ? '#4F8CFF' : '#181A20' },
    secondary: { main: mode === 'dark' ? '#FF6B81' : '#23262F' },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 300,
    fontWeightMedium: 400,
    fontWeightBold: 500,
  },
});

export function useThemeMode() {
  return useContext(ThemeModeContext);
}

export default function ThemeModeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('themeMode') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const colorMode = useMemo(() => ({
    toggleColorMode: () => setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
    mode,
  }), [mode]);
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  return (
    <ThemeModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
} 
import React from 'react';
import { useTheme } from '@mui/material/styles';

export default function Footer() {
  const theme = useTheme();
  return (
    <footer style={{
      width: '100%',
      background: theme.palette.background.default,
      textAlign: 'center',
      padding: window.innerWidth < 600 ? '16px 0 8px 0' : '24px 0 12px 0',
      fontSize: window.innerWidth < 600 ? 16 : 18,
      color: theme.palette.text.secondary,
      marginTop: 'auto',
      margin: '0',
      border: 'none',
      outline: 'none',
      position: 'relative',
      bottom: '0',
      left: '0',
      right: '0',
    }}>
      © 2025 abboskhoja.site
    </footer>
  );
} 
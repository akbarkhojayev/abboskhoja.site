import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';

export default function Loader({ forceMinDelay = 300 }) {
  const [show, setShow] = useState(true);
  const theme = useTheme();
  useEffect(() => {
    const timer = setTimeout(() => setShow(false), forceMinDelay);
    return () => clearTimeout(timer);
  }, [forceMinDelay]);
  if (!show) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: theme.palette.background.default,
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    }}>
      <CircularProgress size={54} thickness={4.5} style={{ color: theme.palette.primary.main, background: theme.palette.background.paper, borderRadius: '50%' }} />
    </div>
  );
} 
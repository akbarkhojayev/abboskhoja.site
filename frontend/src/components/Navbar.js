import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import { useThemeMode } from '../ThemeContext';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

const pages = [
  { name: 'Projects', path: '/projects' },
  { name: 'Blog', path: '/blog' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

function Navbar() {
  const location = useLocation();
  const theme = useTheme();
  const { toggleColorMode, mode } = useThemeMode();
  const isDark = theme.palette.mode === 'dark';
  const textColor = theme.palette.text.primary;
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);
  const handleNavClick = (path) => {
    setDrawerOpen(false);
    navigate(path);
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{
      position: 'sticky',
      top: 0,
      zIndex: 1200,
      background: theme.palette.background.default,
      boxShadow: 'none',
      border: 'none',
      py: 0,
    }}>
      <Toolbar sx={{ 
        minHeight: { xs: 56, sm: 64 }, 
        px: { xs: 2, sm: 3, md: 0 }, 
        justifyContent: 'center', 
        py: { xs: 1, sm: 2 },
        background: theme.palette.background.default,
      }}>
        <Box sx={{ 
          width: '100%', 
          maxWidth: '1200px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mx: 'auto' 
        }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              fontWeight: 600,
              fontSize: window.innerWidth < 600 ? 18 : 24,
              letterSpacing: 0.5,
              color: textColor,
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => e.target.style.color = theme.palette.primary.main}
            onMouseLeave={(e) => e.target.style.color = textColor}
          >
            Abboskhoja's Blog
          </Link>
          {/* Desktop menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
            {pages.map((page, idx) => (
              <Link
                key={page.name}
                to={page.path}
                style={{
                  color: location.pathname === page.path ? theme.palette.primary.main : theme.palette.text.secondary,
                  textDecoration: 'none',
                  fontSize: 17,
                  fontWeight: location.pathname === page.path ? 500 : 300,
                  marginLeft: idx === 0 ? 0 : 12,
                  letterSpacing: 0.5,
                  cursor: 'pointer',
                  transition: 'color 0.2s ease',
                  padding: '8px 12px',
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = theme.palette.primary.main;
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = location.pathname === page.path ? theme.palette.primary.main : theme.palette.text.secondary;
                }}
              >
                {page.name}
              </Link>
            ))}
            <IconButton
              onClick={toggleColorMode}
              sx={{
                ml: 2,
                color: theme.palette.text.primary,
                background: theme.palette.mode === 'light' ? '#f4f6fa' : '#23262F',
                borderRadius: 2,
                transition: 'background 0.18s',
                '&:hover': {
                  background: theme.palette.mode === 'light' ? '#e0e7ef' : '#181A20',
                },
              }}
              aria-label="Toggle dark mode"
            >
              {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
          {/* Mobile menu */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={toggleColorMode}
              sx={{
                color: theme.palette.text.primary,
                background: theme.palette.mode === 'light' ? '#f4f6fa' : '#23262F',
                borderRadius: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: theme.palette.mode === 'light' ? '#e0e7ef' : '#181A20',
                  transform: 'scale(1.05)',
                },
              }}
              aria-label="Toggle dark mode"
            >
              {isDark ? <Brightness7Icon sx={{ fontSize: 20 }} /> : <Brightness4Icon sx={{ fontSize: 20 }} />}
            </IconButton>
            <IconButton 
              onClick={handleDrawerToggle} 
              sx={{ 
                color: textColor, 
                background: theme.palette.mode === 'light' ? '#f4f6fa' : '#23262F',
                borderRadius: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: theme.palette.mode === 'light' ? '#e0e7ef' : '#181A20',
                  transform: 'scale(1.05)',
                },
              }}
            >
              <MenuIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <Drawer 
              anchor="right" 
              open={drawerOpen} 
              onClose={handleDrawerToggle}
              sx={{
                '& .MuiDrawer-paper': {
                  width: 280,
                  background: theme.palette.background.paper,
                  borderLeft: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#e0e0e0'}`,
                },
              }}
            >
              <Box sx={{ width: 280, pt: 3, px: 2 }} role="presentation">
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 3, 
                    color: textColor, 
                    fontWeight: 600,
                    textAlign: 'center',
                                      pb: 2,
                  }}
                >
                  Navigation
                </Typography>
                <List>
                  {pages.map((page) => (
                    <ListItem key={page.name} disablePadding sx={{ mb: 1 }}>
                      <ListItemButton 
                        onClick={() => handleNavClick(page.path)}
                        sx={{
                          borderRadius: 2,
                          color: location.pathname === page.path ? theme.palette.primary.main : theme.palette.text.primary,
                          fontWeight: location.pathname === page.path ? 600 : 400,
                          background: location.pathname === page.path ? 
                            (theme.palette.mode === 'dark' ? '#333' : '#f5f5f5') : 'transparent',
                          '&:hover': {
                            background: theme.palette.mode === 'dark' ? '#333' : '#f5f5f5',
                            color: theme.palette.primary.main,
                          },
                        }}
                      >
                        <ListItemText 
                          primary={page.name} 
                          sx={{ 
                            '& .MuiListItemText-primary': {
                              fontSize: '1rem',
                            }
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Drawer>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 
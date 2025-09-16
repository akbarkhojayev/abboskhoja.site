import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, useTheme } from '@mui/material';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import About from './pages/About';
import Contact from './pages/Contact';
import Navbar from './components/Navbar';
import BlogPost from './pages/BlogPost';
import ThemeModeProvider from './ThemeContext';
import ProjectDetail from './pages/ProjectDetail';

function AppContent() {
  const theme = useTheme();
  
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      border: 'none',
      borderTop: 'none',
      borderBottom: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      boxShadow: 'none',
      outline: 'none',
      overflow: 'hidden',
      background: theme.palette.background.default,
    }}>
      <Navbar />
      <Box sx={{ 
        flex: 1,
        border: 'none',
        borderTop: 'none',
        borderBottom: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        boxShadow: 'none',
        outline: 'none',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        background: theme.palette.background.default,
        minHeight: { xs: 'calc(100vh - 80px)', md: 'calc(100vh - 120px)' },
      }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin-projects/:id/" element={<ProjectDetail />} />
        </Routes>
      </Box>
      <Box sx={{
        width: '100%',
        textAlign: 'center',
        py: { xs: 2, sm: 3 },
        px: { xs: 2, sm: 3 },
        fontSize: { xs: '14px', sm: '16px' },
        color: theme.palette.text.secondary,
        background: theme.palette.background.default,
        border: 'none',
        outline: 'none',

        mt: 'auto',
      }}>
        © 2025 abboskhoja.site
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ThemeModeProvider>
      <AppContent />
    </ThemeModeProvider>
  );
}

export default App; 
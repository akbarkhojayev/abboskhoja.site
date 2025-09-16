import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Box, Stack } from '@mui/material';
import axios from 'axios';
import parse from 'html-react-parser';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import Loader from '../components/Loader';
import Skeleton from '@mui/material/Skeleton';

const API_BASE = 'http://127.0.0.1:8000/';

function Projects() {
  const [projects, setProjects] = useState([]);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const textColor = theme.palette.text.primary;

  useEffect(() => {
    axios.get(`${API_BASE}/projects/`).then(res => setProjects(res.data.results || res.data));
  }, []);

  const container = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };
  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 }
  };

  if (!projects || projects.length === 0) return (
    <Box sx={{ minHeight: '100vh', background: theme.palette.background.default, py: 8 }}>
      <Container maxWidth="lg">
        <Skeleton variant="text" width={220} height={48} sx={{ mb: 8, fontSize: 32, borderRadius: 2 }} />
        {[...Array(2)].map((_, i) => (
          <Box key={i} sx={{ display: 'flex', flexDirection: { xs: 'column', md: i % 2 === 0 ? 'row' : 'row-reverse' }, alignItems: 'center', gap: { xs: 4, md: 8 }, mb: 12 }}>
            <Skeleton variant="rectangular" width={340} height={220} sx={{ borderRadius: 24, mb: { xs: 2, md: 0 } }} />
            <Box sx={{ flex: 1, px: { xs: 0, md: 2 } }}>
              <Skeleton variant="text" width={180} height={36} sx={{ mb: 2, fontSize: 24, borderRadius: 2 }} />
              <Skeleton variant="text" width="80%" height={24} sx={{ mb: 2, fontSize: 17, borderRadius: 2 }} />
              <Skeleton variant="rectangular" width={120} height={32} sx={{ borderRadius: 99, mb: 1 }} />
              <Skeleton variant="rectangular" width={120} height={32} sx={{ borderRadius: 99, mb: 1 }} />
            </Box>
          </Box>
        ))}
      </Container>
    </Box>
  );
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: theme.palette.background.default, 
      py: { xs: 4, sm: 6, md: 8 },
      px: { xs: 2, sm: 3 },
    }}>
      <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2 } }}>
        <Typography
          component={motion.h3}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          variant="h3"
          fontWeight={400}
          sx={{ 
            mb: { xs: 4, sm: 6, md: 8 }, 
            letterSpacing: '-1px', 
            color: textColor, 
            textAlign: 'center', 
            fontFamily: 'Poppins, Montserrat, Inter, sans-serif',
            fontSize: { xs: '1.75rem', sm: '2.5rem' },
          }}
        >
          PROJECTS
        </Typography>
        <Box component={motion.div} variants={container} initial="hidden" animate="show">
          {projects.map((project, i) => (
            <Box component={motion.div} variants={item} key={project.id}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', lg: i % 2 === 0 ? 'row' : 'row-reverse' },
                  alignItems: 'center',
                  gap: { xs: 3, sm: 4, lg: 6 },
                  mb: { xs: 6, sm: 8, lg: 10 },
                  background: 'none',
                  px: { xs: 1, sm: 2 },
                }}
              >
                {/* Image/Illustration */}
                <Box sx={{ 
                  flex: 1, 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  minHeight: { xs: 180, sm: 200, lg: 220 },
                  order: { xs: 1, lg: 0 },
                }}>
                  {project.image || (project.cover_images && project.cover_images.length > 0) ? (
                    <Box sx={{
                      border: `3px solid ${theme.palette.mode === 'dark' ? '#333' : '#e0e0e0'}`,
                      borderRadius: { xs: 12, sm: 16, lg: 18 },
                      p: '8px',
                      background: theme.palette.background.paper,
                      boxShadow: isDark 
                        ? '0 8px 32px 0 rgba(31,38,135,0.15), 0 4px 16px 0 rgba(0,0,0,0.1)' 
                        : '0 8px 32px 0 rgba(80,120,200,0.12), 0 4px 16px 0 rgba(0,0,0,0.08)',
                      transition: 'all 0.3s ease',
                      width: { xs: 280, sm: 320, lg: 360 },
                      height: { xs: 170, sm: 190, lg: 210 },
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: isDark 
                          ? '0 12px 40px 0 rgba(31,38,135,0.25), 0 8px 24px 0 rgba(0,0,0,0.15)' 
                          : '0 12px 40px 0 rgba(80,120,200,0.2), 0 8px 24px 0 rgba(0,0,0,0.12)',
                      },
                    }}>
                      <Box
                        component="img"
                        src={project.image || project.cover_images?.[0]?.image}
                        alt={project.title}
                        sx={{ 
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: { xs: 10, sm: 14, lg: 16 }, 
                          display: 'block',
                        }}
                      />
                    </Box>
                  ) : (
                    <Box sx={{
                      width: { xs: 220, sm: 260, lg: 280 }, 
                      height: { xs: 150, sm: 170, lg: 190 }, 
                      border: `3px solid ${theme.palette.mode === 'dark' ? '#333' : '#e0e0e0'}`,
                      borderRadius: { xs: 12, sm: 16, lg: 18 },
                      padding: '8px',
                      background: `linear-gradient(135deg, ${theme.palette.background.paper} 60%, ${theme.palette.primary.main} 100%)`,
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: textColor, 
                      fontWeight: 700, 
                      fontSize: { xs: 24, sm: 28, lg: 32 },
                      boxShadow: isDark 
                        ? '0 8px 32px 0 rgba(31,38,135,0.15), 0 4px 16px 0 rgba(0,0,0,0.1)' 
                        : '0 8px 32px 0 rgba(80,120,200,0.12), 0 4px 16px 0 rgba(0,0,0,0.08)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: isDark 
                          ? '0 12px 40px 0 rgba(31,38,135,0.25), 0 8px 24px 0 rgba(0,0,0,0.15)' 
                          : '0 12px 40px 0 rgba(80,120,200,0.2), 0 8px 24px 0 rgba(0,0,0,0.12)',
                      },
                    }}>
                      Project
                    </Box>
                  )}
                </Box>
                {/* Text Content */}
                <Box sx={{ 
                  flex: 1, 
                  px: { xs: 0, lg: 2 },
                  order: { xs: 0, lg: 1 },
                  textAlign: { xs: 'center', lg: 'left' },
                }}>
                  <Typography 
                    variant="h4" 
                    fontWeight={900} 
                    sx={{ 
                      mb: 2, 
                      color: textColor, 
                      background: 'none',
                      fontSize: { xs: '1.5rem', sm: '2rem', lg: '2.125rem' },
                    }}
                  >
                    {project.title}
                  </Typography>
                  {project.description && (
                    <Box sx={{ 
                      color: textColor, 
                      fontSize: { xs: 15, sm: 16, lg: 17 }, 
                      mb: 2,
                      lineHeight: 1.6,
                    }}>
                      {parse(project.description)}
                    </Box>
                  )}
                  {project.tag && project.tag.length > 0 && (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1, 
                      mt: 1, 
                      flexWrap: 'wrap',
                      justifyContent: { xs: 'center', lg: 'flex-start' },
                    }}>
                      <span style={{ 
                        marginRight: 6, 
                        fontSize: { xs: 14, sm: 16 }, 
                        color: textColor 
                      }}>🏷️</span>
                      {project.tag.map((tag, j) => (
                        <Box key={j} sx={{ 
                          px: { xs: 1, sm: 1.5 }, 
                          py: 0.5, 
                          borderRadius: 99, 
                          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, 
                          color: '#fff', 
                          fontWeight: 500, 
                          fontSize: { xs: 12, sm: 14 }, 
                          mx: 0.5, 
                          mb: 0.5 
                        }}>
                          {tag}
                        </Box>
                      ))}
                    </Box>
                  )}
                  <Box sx={{ 
                    display: 'flex', 
                    gap: { xs: 1.5, sm: 2 }, 
                    mt: 2,
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'center', lg: 'flex-start' },
                  }}>
                    {project.git_hub && (
                      <Button 
                        href={project.git_hub} 
                        target="_blank" 
                        sx={{ 
                          color: '#fff', 
                          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, 
                          textTransform: 'none', 
                          fontWeight: 700, 
                          fontSize: { xs: 14, sm: 15 }, 
                          borderRadius: 99, 
                          px: { xs: 2.5, sm: 3 }, 
                          py: { xs: 1.5, sm: 1 }, 
                          width: { xs: '100%', sm: 'auto' },
                          maxWidth: { xs: '200px', sm: 'none' },
                          '&:hover': { 
                            background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        GitHub
                      </Button>
                    )}
                    {project.project_url && (
                      <Button 
                        href={project.project_url} 
                        target="_blank" 
                        sx={{ 
                          color: '#fff', 
                          background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`, 
                          textTransform: 'none', 
                          fontWeight: 700, 
                          fontSize: { xs: 14, sm: 15 }, 
                          borderRadius: 99, 
                          px: { xs: 2.5, sm: 3 }, 
                          py: { xs: 1.5, sm: 1 },
                          width: { xs: '100%', sm: 'auto' },
                          maxWidth: { xs: '200px', sm: 'none' },
                          '&:hover': { 
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        Live Demo
                      </Button>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export default Projects; 
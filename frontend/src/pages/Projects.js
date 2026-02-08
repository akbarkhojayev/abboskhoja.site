import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Container, Typography, Button, Box, IconButton, Card, CardContent, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import parse from 'html-react-parser';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import GitHubIcon from '@mui/icons-material/GitHub';
import LaunchIcon from '@mui/icons-material/Launch';
import Skeleton from '@mui/material/Skeleton';

const API_BASE = 'https://api.abboskhoja.uz';

function Projects() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  // State
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  // Refs
  const autoPlayRef = useRef(null);
  const touchStartRef = useRef(0);
  const touchEndRef = useRef(0);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE}/projects/`);
        const data = response.data.results || response.data;
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || projects.length <= 1) return;

    autoPlayRef.current = setInterval(() => {
      handleNext();
    }, 5000);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, currentIndex, projects.length]);

  // Navigation functions
  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  }, [projects.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  }, [projects.length]);

  const goToSlide = useCallback((index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeThreshold = 50;
    const diff = touchStartRef.current - touchEndRef.current;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Animation variants - Faster animations
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 600 : -600,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 400, damping: 35 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      },
    },
    exit: (direction) => ({
      x: direction < 0 ? 600 : -600,
      opacity: 0,
      scale: 0.9,
      transition: {
        x: { type: 'spring', stiffness: 400, damping: 35 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      },
    }),
  };

  // Loading skeleton
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: theme.palette.background.default,
          py: { xs: 6, md: 10 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Container maxWidth="lg">
          <Skeleton
            variant="text"
            width={250}
            height={60}
            sx={{ mx: 'auto', mb: 6, borderRadius: 2 }}
          />
          <Skeleton
            variant="rectangular"
            height={500}
            sx={{ borderRadius: 4, mb: 3 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} variant="circular" width={12} height={12} />
            ))}
          </Box>
        </Container>
      </Box>
    );
  }

  // No projects
  if (!projects || projects.length === 0) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: theme.palette.background.default,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h5" color="text.secondary">
          No projects available
        </Typography>
      </Box>
    );
  }

  const currentProject = projects[currentIndex];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.background.default,
        py: { xs: 6, md: 10 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Container maxWidth="lg">
        {/* Title */}
        <Typography
          component={motion.h2}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          variant="h2"
          sx={{
            textAlign: 'center',
            mb: { xs: 6, md: 8 },
            fontWeight: 700,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          My Projects
        </Typography>

        {/* Carousel Container */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            overflow: 'visible',
            px: { xs: 0, sm: 4, md: 8 },
          }}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Carousel */}
          <Box
            sx={{
              position: 'relative',
              minHeight: { xs: 450, sm: 480, md: 500 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: { xs: 2, sm: 3, md: 4 },
            }}
          >
            {/* Previous Project (Left) */}
            {projects.length > 1 && (
              <Box
                onClick={handlePrev}
                sx={{
                  display: { xs: 'none', md: 'block' },
                  flex: '0 0 20%',
                  cursor: 'pointer',
                  opacity: 0.4,
                  filter: 'blur(2px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    opacity: 0.6,
                    filter: 'blur(1px)',
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <Card
                  elevation={0}
                  sx={{
                    background: isDark
                      ? 'rgba(30, 30, 40, 0.5)'
                      : 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    overflow: 'hidden',
                    border: `1px solid ${
                      isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                    }`,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Box sx={{ position: 'relative', height: 300, overflow: 'hidden' }}>
                    {projects[
                      (currentIndex - 1 + projects.length) % projects.length
                    ]?.image ||
                    (projects[
                      (currentIndex - 1 + projects.length) % projects.length
                    ]?.cover_images &&
                      projects[
                        (currentIndex - 1 + projects.length) % projects.length
                      ]?.cover_images.length > 0) ? (
                      <Box
                        component="img"
                        src={
                          projects[
                            (currentIndex - 1 + projects.length) %
                              projects.length
                          ]?.image ||
                          projects[
                            (currentIndex - 1 + projects.length) %
                              projects.length
                          ]?.cover_images?.[0]?.image
                        }
                        alt={
                          projects[
                            (currentIndex - 1 + projects.length) %
                              projects.length
                          ]?.title
                        }
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '2rem',
                          fontWeight: 700,
                          color: theme.palette.primary.main,
                        }}
                      >
                        {projects[
                          (currentIndex - 1 + projects.length) % projects.length
                        ]?.title?.charAt(0) || 'P'}
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ flex: 1, p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: theme.palette.text.primary,
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        textAlign: 'center',
                        lineHeight: 1.3,
                      }}
                    >
                      {projects[(currentIndex - 1 + projects.length) % projects.length]?.title}
                    </Typography>
                  </Box>
                </Card>
              </Box>
            )}

            {/* Current Project (Center) */}
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                style={{
                  flex: '0 0 auto',
                  width: '100%',
                  maxWidth: projects.length > 1 ? '55%' : '80%',
                }}
              >
                <Card
                  component={motion.div}
                  whileHover={{ 
                    y: -8,
                    transition: { duration: 0.3 }
                  }}
                  elevation={0}
                  sx={{
                    background: isDark
                      ? 'rgba(25, 28, 35, 0.95)'
                      : 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 4,
                    overflow: 'hidden',
                    border: `1px solid ${
                      isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
                    }`,
                    boxShadow: isDark
                      ? '0 20px 60px rgba(0,0,0,0.4)'
                      : '0 20px 60px rgba(0,0,0,0.12)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      minHeight: { xs: 450, sm: 480, md: 500 },
                      position: 'relative',
                    }}
                  >
                    {/* Image Section */}
                    <Box
                      sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        height: { xs: 220, sm: 260, md: 300 },
                        background: isDark 
                          ? `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`
                          : `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10)`,
                      }}
                    >
                      {currentProject?.image ||
                      (currentProject?.cover_images &&
                        currentProject?.cover_images.length > 0) ? (
                        <Box
                          component={motion.img}
                          initial={{ scale: 1.3, opacity: 0, rotate: -2 }}
                          animate={{ scale: 1, opacity: 1, rotate: 0 }}
                          transition={{ 
                            duration: 0.8,
                            ease: [0.43, 0.13, 0.23, 0.96]
                          }}
                          whileHover={{ scale: 1.05 }}
                          src={
                            currentProject?.image ||
                            currentProject?.cover_images?.[0]?.image
                          }
                          alt={currentProject?.title}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: 'brightness(1.1) contrast(1.05)',
                            transition: 'all 0.5s ease',
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: { xs: '3rem', md: '4rem' },
                            fontWeight: 900,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                          }}
                        >
                          {currentProject?.title?.charAt(0) || 'P'}
                        </Box>
                      )}
                      
                      {/* Simple Badge */}
                      <Box
                        component={motion.div}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          zIndex: 2,
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          color: '#fff',
                          px: 2,
                          py: 0.7,
                          borderRadius: 2,
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                          textTransform: 'uppercase',
                          letterSpacing: 1,
                        }}
                      >
                        Featured
                      </Box>
                    </Box>

                    {/* Content Section */}
                    <CardContent
                      sx={{
                        flex: 1,
                        p: { xs: 2.5, sm: 3, md: 3.5 },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                      }}
                    >
                      {/* Title */}
                      <Typography
                        variant="h4"
                        component={motion.h4}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        sx={{
                          fontWeight: 800,
                          mb: 2,
                          fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                          color: theme.palette.text.primary,
                          letterSpacing: '-0.5px',
                          position: 'relative',
                          paddingBottom: 1.5,
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: 60,
                            height: 4,
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            borderRadius: 2,
                          },
                        }}
                      >
                        {currentProject?.title}
                      </Typography>

                      {/* Description */}
                      {currentProject?.description && (
                        <Box
                          component={motion.div}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                          sx={{
                            mb: 2.5,
                            color: theme.palette.text.secondary,
                            fontSize: { xs: '0.9rem', sm: '0.95rem' },
                            lineHeight: 1.7,
                            '& p': { mb: 0.5 },
                          }}
                        >
                          {parse(currentProject?.description)}
                        </Box>
                      )}

                      {/* Tags */}
                      {currentProject?.tag && currentProject?.tag.length > 0 && (
                        <Box
                          component={motion.div}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                          sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 1,
                            mb: 3,
                          }}
                        >
                          {currentProject?.tag.map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag}
                              size="small"
                              sx={{
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                color: '#fff',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                height: 28,
                                px: 0.5,
                                transition: 'transform 0.2s ease',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                },
                              }}
                            />
                          ))}
                        </Box>
                      )}

                      {/* Action Buttons */}
                      <Box
                        component={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        sx={{
                          display: 'flex',
                          gap: 2,
                          flexWrap: 'wrap',
                          mt: 'auto',
                        }}
                      >
                        {currentProject?.git_hub && (
                          <Button
                            variant="contained"
                            startIcon={<GitHubIcon />}
                            href={currentProject?.git_hub}
                            target="_blank"
                            rel="noopener noreferrer"
                            component={motion.a}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            sx={{
                              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                              color: '#fff',
                              fontWeight: 600,
                              px: 3,
                              py: 1.2,
                              borderRadius: 2,
                              textTransform: 'none',
                              fontSize: '0.95rem',
                              boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                              '&:hover': {
                                boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                              },
                              transition: 'all 0.3s ease',
                            }}
                          >
                            View Code
                          </Button>
                        )}
                        {currentProject?.project_url && (
                          <Button
                            variant="outlined"
                            startIcon={<LaunchIcon />}
                            href={currentProject?.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            component={motion.a}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            sx={{
                              borderColor: theme.palette.primary.main,
                              color: theme.palette.primary.main,
                              fontWeight: 600,
                              px: 3,
                              py: 1.2,
                              borderRadius: 2,
                              textTransform: 'none',
                              fontSize: '0.95rem',
                              borderWidth: 2,
                              '&:hover': {
                                borderWidth: 2,
                                background: `${theme.palette.primary.main}10`,
                              },
                              transition: 'all 0.3s ease',
                            }}
                          >
                            Live Demo
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Box>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Next Project (Right) */}
            {projects.length > 1 && (
              <Box
                onClick={handleNext}
                sx={{
                  display: { xs: 'none', md: 'block' },
                  flex: '0 0 20%',
                  cursor: 'pointer',
                  opacity: 0.4,
                  filter: 'blur(2px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    opacity: 0.6,
                    filter: 'blur(1px)',
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <Card
                  elevation={0}
                  sx={{
                    background: isDark
                      ? 'rgba(30, 30, 40, 0.5)'
                      : 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    overflow: 'hidden',
                    border: `1px solid ${
                      isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                    }`,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Box sx={{ position: 'relative', height: 300, overflow: 'hidden' }}>
                    {projects[(currentIndex + 1) % projects.length]?.image ||
                    (projects[(currentIndex + 1) % projects.length]
                      ?.cover_images &&
                      projects[(currentIndex + 1) % projects.length]
                        ?.cover_images.length > 0) ? (
                      <Box
                        component="img"
                        src={
                          projects[(currentIndex + 1) % projects.length]
                            ?.image ||
                          projects[(currentIndex + 1) % projects.length]
                            ?.cover_images?.[0]?.image
                        }
                        alt={
                          projects[(currentIndex + 1) % projects.length]?.title
                        }
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '2rem',
                          fontWeight: 700,
                          color: theme.palette.primary.main,
                        }}
                      >
                        {projects[(currentIndex + 1) % projects.length]?.title?.charAt(0) || 'P'}
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ flex: 1, p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: theme.palette.text.primary,
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        textAlign: 'center',
                        lineHeight: 1.3,
                      }}
                    >
                      {projects[(currentIndex + 1) % projects.length]?.title}
                    </Typography>
                  </Box>
                </Card>
              </Box>
            )}
          </Box>

          {/* Navigation Arrows */}
          {projects.length > 1 && (
            <>
              <IconButton
                onClick={handlePrev}
                sx={{
                  position: 'absolute',
                  left: { xs: 8, md: 16 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 2,
                  background: isDark
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(0,0,0,0.05)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    background: isDark
                      ? 'rgba(255,255,255,0.2)'
                      : 'rgba(0,0,0,0.1)',
                    transform: 'translateY(-50%) scale(1.1)',
                  },
                  transition: 'all 0.3s ease',
                  width: { xs: 40, md: 50 },
                  height: { xs: 40, md: 50 },
                }}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
              <IconButton
                onClick={handleNext}
                sx={{
                  position: 'absolute',
                  right: { xs: 8, md: 16 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 2,
                  background: isDark
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(0,0,0,0.05)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    background: isDark
                      ? 'rgba(255,255,255,0.2)'
                      : 'rgba(0,0,0,0.1)',
                    transform: 'translateY(-50%) scale(1.1)',
                  },
                  transition: 'all 0.3s ease',
                  width: { xs: 40, md: 50 },
                  height: { xs: 40, md: 50 },
                }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </>
          )}
        </Box>

        {/* Dots Indicator */}
        {projects.length > 1 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 1.5,
              mt: 4,
            }}
          >
            {projects.map((_, index) => (
              <Box
                key={index}
                component={motion.button}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => goToSlide(index)}
                sx={{
                  width: currentIndex === index ? 32 : 12,
                  height: 12,
                  borderRadius: 6,
                  border: 'none',
                  background:
                    currentIndex === index
                      ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                      : isDark
                      ? 'rgba(255,255,255,0.3)'
                      : 'rgba(0,0,0,0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background:
                      currentIndex === index
                        ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                        : isDark
                        ? 'rgba(255,255,255,0.5)'
                        : 'rgba(0,0,0,0.4)',
                  },
                }}
              />
            ))}
          </Box>
        )}

        {/* Project Counter */}
        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            mt: 3,
            color: theme.palette.text.secondary,
            fontWeight: 500,
          }}
        >
          {currentIndex + 1} / {projects.length}
        </Typography>
      </Container>
    </Box>
  );
}

export default Projects; 
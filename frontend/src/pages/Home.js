import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Avatar, Button, Stack, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { GitHub, LinkedIn, Language, Description, LocationOn, Work } from '@mui/icons-material';
import parse from 'html-react-parser';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import Skeleton from '@mui/material/Skeleton';

const API_BASE = 'https://api.abboskhoja.uz';

function Home() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [softSkills, setSoftSkills] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/user/`).then(res => setProfile(res.data[0]));
    axios.get(`${API_BASE}/skills/`).then(res => setSkills(res.data.results || res.data));
    axios.get(`${API_BASE}/softskills/`).then(res => setSoftSkills(res.data.results || res.data));
  }, []);

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const textColor = theme.palette.text.primary;

  if (!profile) {
    return (
      <Box sx={{ minHeight: 'calc(100vh - 120px)', height: 'calc(100vh - 120px)', background: theme.palette.background.default, display: 'flex', alignItems: 'center', justifyContent: 'center', py: { xs: 2, md: 4 }, position: 'relative', overflow: 'hidden' }}>
        <Container maxWidth="md" sx={{ zIndex: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: { xs: 6, md: 10 }, justifyContent: 'center', mt: { xs: 6, md: 10 } }}>
            {/* Avatar skeleton */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, position: 'relative', flex: { md: '0 0 320px' }, ml: { md: -6, lg: -10 } }}>
              <Skeleton variant="circular" width={280} height={280} sx={{ mb: 2 }} />
              <Stack direction="row" spacing={1} justifyContent="center">
                <Skeleton variant="circular" width={48} height={48} />
                <Skeleton variant="circular" width={48} height={48} />
              </Stack>
            </Box>
            {/* Main info skeleton */}
            <Box sx={{ flex: 1, minWidth: 0, textAlign: { xs: 'center', md: 'left' }, display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' }, justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center', mb: 2 }}>
                <Skeleton variant="text" width={210} height={64} sx={{ fontSize: { xs: 40, md: 64 }, borderRadius: 2 }} />
                <Skeleton variant="text" width={210} height={64} sx={{ fontSize: { xs: 40, md: 64 }, borderRadius: 2 }} />
              </Box>
              <Skeleton variant="rectangular" width={80} height={6} sx={{ borderRadius: 3, mb: 3 }} />
              <Skeleton variant="text" width={320} height={36} sx={{ mb: 2, fontSize: 28, borderRadius: 2 }} />
              <Skeleton variant="text" width={220} height={32} sx={{ mb: 2, fontSize: 22, borderRadius: 2 }} />
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2, flexWrap: 'wrap', mt: 2 }}>
                <Skeleton variant="rectangular" width={160} height={28} sx={{ borderRadius: 99 }} />
              </Stack>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Skeleton variant="rectangular" width={160} height={48} sx={{ borderRadius: 99 }} />
                <Skeleton variant="rectangular" width={160} height={48} sx={{ borderRadius: 99 }} />
              </Stack>
            </Box>
          </Box>
          {/* Skills/tools skeleton */}
          <Box sx={{ mt: { xs: 6, md: 10 }, width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, justifyContent: 'center', alignItems: 'stretch' }}>
            <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', background: 'none', boxShadow: 'none', p: 0 }}>
              <Skeleton variant="text" width={100} height={28} sx={{ mb: 1.5, fontSize: 18 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} variant="rectangular" width={110} height={32} sx={{ borderRadius: 99 }} />
                ))}
              </Box>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mx: 1 }}>
              <Skeleton variant="rectangular" width={3} height={80} sx={{ borderRadius: 2 }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', background: 'none', boxShadow: 'none', p: 0 }}>
              <Skeleton variant="text" width={100} height={28} sx={{ mb: 1.5, fontSize: 18 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} variant="rectangular" width={110} height={32} sx={{ borderRadius: 99 }} />
                ))}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }
  return (
    <Box
      sx={{
        minHeight: { xs: 'calc(100vh - 80px)', md: 'calc(100vh - 120px)' },
        background: theme.palette.background.default,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 3, sm: 4, md: 6 },
        px: { xs: 2, sm: 3 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated gradient blob background */}
      <Box sx={{
        position: 'absolute',
        top: { xs: 40, md: 80 },
        left: { xs: -120, md: -200 },
        width: { xs: 320, md: 500 },
        height: { xs: 320, md: 500 },
        background: isDark
          ? `radial-gradient(circle at 60% 40%, ${theme.palette.primary.main} 0%, #23262F 100%)`
          : `radial-gradient(circle at 60% 40%, ${theme.palette.primary.main} 0%, #e0e7ef 100%)`,
        opacity: 0.18,
        filter: 'blur(60px)',
        zIndex: 0,
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite',
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(40px)' },
        },
      }} />
      <Container maxWidth="lg" sx={{ zIndex: 1, px: { xs: 2, sm: 3 } }}>
        <Box
          component={motion.div}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.13
              }
            }
          }}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            alignItems: 'center',
            gap: { xs: 3, sm: 4, lg: 8 },
            justifyContent: 'center',
            mt: { xs: 2, sm: 4, lg: 6 },
          }}
        >
          {/* Avatar and links */}
          <Box
            component={motion.div}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 18, duration: 0.7 } }
            }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: { xs: 2, sm: 3 },
              position: 'relative',
              flex: { xs: '0 0 40%', sm: '0 0 36%', lg: '0 0 320px' },
              order: { xs: 0, lg: 0 },
            }}
          >
            <Avatar
              component={motion.div}
              variants={{
                hidden: { scale: 0.7, opacity: 0 },
                visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 180, damping: 16, duration: 0.6 } }
              }}
              src={profile?.avatar}
              alt={profile?.first_name}
              imgProps={{
                loading: 'lazy',
                referrerPolicy: 'no-referrer',
                style: { objectFit: 'cover' }
              }}
              sx={{
                width: { xs: 120, sm: 160, md: 220, lg: 280 },
                height: { xs: 120, sm: 160, md: 220, lg: 280 },
                mb: 2,
                boxShadow: isDark ? '0 0 0 6px #23262F, 0 0 32px 6px #4F8CFF55' : '0 0 0 6px #e0e7ef, 0 0 32px 6px #2563eb33',
                border: `8px solid ${isDark ? '#23262F' : '#e0e7ef'}`,
                background: isDark ? '#23262F' : '#fff',
                zIndex: 2,
                '@media (max-width:600px)': {
                  width: 120,
                  height: 120,
                  border: `6px solid ${isDark ? '#23262F' : '#e0e7ef'}`,
                  boxShadow: isDark ? '0 0 0 4px #23262F, 0 0 24px 4px #4F8CFF55' : '0 0 0 4px #e0e7ef, 0 0 24px 4px #2563eb33',
                },
              }}
            />
            {/* Mobile info moved below avatar in main info section */}
            <Stack
              component={motion.div}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.5 } }
              }}
              direction="row"
              spacing={{ xs: 1.5, sm: 2.5 }}
              justifyContent="center"
              sx={{ flexWrap: 'wrap', gap: { xs: 1, sm: 1.5 }, display: { xs: 'none', sm: 'flex' } }}
            >
              {profile?.github && (
                <IconButton 
                  href={profile.github} 
                  target="_blank" 
                  sx={{ 
                    color: textColor, 
                    borderRadius: 2,
                    background: theme.palette.mode === 'dark' ? '#333' : '#f5f5f5',
                    '&:hover': {
                      background: theme.palette.mode === 'dark' ? '#444' : '#e0e0e0',
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.2s ease',
                    p: { xs: 1, sm: 1.25 },
                  }}
                  aria-label="GitHub"
                >
                  <GitHub sx={{ fontSize: { xs: 22, sm: 26 } }} />
                </IconButton>
              )}
              {profile?.linkedin && (
                <IconButton 
                  href={profile.linkedin} 
                  target="_blank" 
                  sx={{ 
                    color: theme.palette.primary.main, 
                    borderRadius: 2,
                    background: theme.palette.mode === 'dark' ? '#333' : '#f5f5f5',
                    '&:hover': {
                      background: theme.palette.mode === 'dark' ? '#444' : '#e0e0e0',
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.2s ease',
                    p: { xs: 1, sm: 1.25 },
                  }}
                  aria-label="LinkedIn"
                >
                  <LinkedIn sx={{ fontSize: { xs: 22, sm: 26 } }} />
                </IconButton>
              )}
              {profile?.website && (
                <IconButton 
                  href={profile.website} 
                  target="_blank" 
                  sx={{ 
                    color: theme.palette.secondary.main, 
                    borderRadius: 2,
                    background: theme.palette.mode === 'dark' ? '#333' : '#f5f5f5',
                    '&:hover': {
                      background: theme.palette.mode === 'dark' ? '#444' : '#e0e0e0',
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.2s ease',
                    p: { xs: 1, sm: 1.25 },
                  }}
                  aria-label="Website"
                >
                  <Language sx={{ fontSize: { xs: 22, sm: 26 } }} />
                </IconButton>
              )}
              {(
                // profile?.resume && (
                true // har doim tugma ko'rinadi, fayl public/resume.pdf deb hisoblanadi
              ) && (
                <IconButton
                  component="a"
                  href="/resume.pdf"
                  download
                  sx={{ 
                    color: textColor, 
                    borderRadius: 2,
                    background: theme.palette.mode === 'dark' ? '#333' : '#f5f5f5',
                    '&:hover': {
                      background: theme.palette.mode === 'dark' ? '#444' : '#e0e0e0',
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.2s ease',
                    p: { xs: 1, sm: 1.25 },
                  }}
                  aria-label="Download resume"
                >
                  <Description sx={{ fontSize: { xs: 22, sm: 26 } }} />
                </IconButton>
              )}
            </Stack>
          </Box>
          {/* Main info */}
          <Box
            component={motion.div}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 18, duration: 0.7, delay: 0.1 } }
            }}
            sx={{ 
              flex: { xs: '1 1 auto', lg: 1 }, 
              minWidth: 0, 
              textAlign: { xs: 'left', lg: 'left' }, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: { xs: 'flex-start', lg: 'flex-start' }, 
              justifyContent: 'center',
              order: { xs: 1, lg: 1 },
              px: { xs: 1, sm: 2 },
            }}
          >
            {/* Mobile stacked info under avatar */}
            <Box sx={{ display: { xs: 'block', sm: 'none' }, width: '100%' }}>
              <Typography variant="h5" sx={{ color: textColor, fontWeight: 900, lineHeight: 1.15, mb: 0.5 }}>
                {(profile?.last_name || '') + ' ' + (profile?.first_name || '')}
              </Typography>
              {profile?.job && (
                <Typography variant="body1" sx={{ color: theme.palette.text.secondary, fontWeight: 400, mt: 0.25, mb: 0.75, textAlign: 'center', width: '100%' }}>
                  {profile.job}
                </Typography>
              )}
              <Stack direction="row" spacing={1.25} sx={{ mb: 1.25, justifyContent: 'center', width: '100%' }}>
                {profile?.github && (
                  <IconButton href={profile.github} target="_blank" aria-label="GitHub" sx={{ p: 0.75, color: textColor }}>
                    <GitHub sx={{ fontSize: 20 }} />
                  </IconButton>
                )}
                {profile?.linkedin && (
                  <IconButton href={profile.linkedin} target="_blank" aria-label="LinkedIn" sx={{ p: 0.75, color: theme.palette.primary.main }}>
                    <LinkedIn sx={{ fontSize: 20 }} />
                  </IconButton>
                )}
                {profile?.website && (
                  <IconButton href={profile.website} target="_blank" aria-label="Website" sx={{ p: 0.75, color: theme.palette.secondary.main }}>
                    <Language sx={{ fontSize: 20 }} />
                  </IconButton>
                )}
                <IconButton component="a" href="/resume.pdf" download aria-label="Download resume" sx={{ p: 0.75, color: textColor }}>
                  <Description sx={{ fontSize: 20 }} />
                </IconButton>
              </Stack>
              <Typography variant="body2" sx={{ color: textColor, mb: 1.5 }}>
                Creative Developer & Problem Solver
              </Typography>
            </Box>
            <Typography
              component={motion.h1}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 180, damping: 18, duration: 0.7 } }
              }}
              variant="h1"
              fontWeight={300}
              sx={{
                color: textColor,
                fontSize: { xs: 28, sm: 36, md: 48, lg: 64 },
                mb: { xs: 1, sm: 1.25, lg: 1.5 },
                letterSpacing: { xs: '-1px', sm: '-1.5px', lg: '-2px' },
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: '4px', sm: '8px', lg: '12px' },
                alignItems: 'center',
                flexWrap: 'wrap',
                textAlign: { xs: 'left', lg: 'left' },
                maxWidth: '100%',
                lineHeight: 1.1,
                displayPrint: 'block',
                // Hide big heading on mobile to avoid duplication with mobile-side name
                display: { xs: 'none', sm: 'flex' },
              }}
            >
              <span style={{ color: textColor, fontWeight: 900 }}>{profile?.last_name || ''}</span>
              <span style={{ color: textColor, fontWeight: 900 }}>{profile?.first_name || ''}</span>
            </Typography>
            <Box
              component={motion.div}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { delay: 0.15, duration: 0.5 } }
              }}
              sx={{ 
                width: { xs: 60, sm: 80 }, 
                height: { xs: 4, sm: 6 }, 
                borderRadius: 3, 
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, 
                mt: 2, 
                mb: 3, 
                mx: { xs: 0, lg: 0 },
                display: 'none'
              }}
            />
            <Typography
              component={motion.h5}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { delay: 0.18, duration: 0.5 } }
              }}
              variant="h5"
              sx={{ 
                color: textColor, 
                fontWeight: 300, 
                mb: 3,
                fontSize: { xs: '1rem', sm: '1.25rem', lg: '1.5rem' },
                textAlign: { xs: 'left', lg: 'left' },
                display: 'none',
              }}
            >
              Creative Developer & Problem Solver
            </Typography>
            {profile?.job && (
              <Typography
                component={motion.div}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { delay: 0.22, duration: 0.5 } }
                }}
                variant="body1"
                sx={{ 
                  color: theme.palette.text.secondary, 
                  fontWeight: 600, 
                  fontSize: { sm: 29, md: 41, lg: 57 }, 
                  mt: -1, 
                  mb: 1.3,
                  textAlign: { xs: 'left', lg: 'left' },
                  display: { xs: 'none', sm: 'block' },
                  lineHeight: 1.1,
                }}
              >
                {profile.job}
              </Typography>
            )}
            {/* Desktop tagline under job, smaller */}
            <Typography
              component={motion.p}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { delay: 0.24, duration: 0.5 } }
              }}
              sx={{
                color: textColor,
                fontWeight: 300,
                mb: 3,
                fontSize: { sm: '1rem', lg: '1.1rem' },
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Creative Developer & Problem Solver
            </Typography>
            <Stack
              component={motion.div}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { delay: 0.25, duration: 0.5 } }
              }}
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ 
                mb: 2, 
                flexWrap: 'wrap', 
                mt: 2,
                justifyContent: { xs: 'flex-start', lg: 'flex-start' },
                display: { xs: 'none', sm: 'flex' },
              }}
            >
              {profile?.location && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  color: theme.palette.secondary.main, 
                  fontWeight: 600, 
                  fontSize: { xs: 16, sm: 18 },
                  textAlign: { xs: 'center', lg: 'left' },
                }}>
                  <LocationOn sx={{ fontSize: { xs: 18, sm: 20 }, mb: '2px' }} /> {profile.location}
                </Box>
              )}
            </Stack>
            <Stack
              component={motion.div}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.5 } }
              }}
              direction={{ xs: 'row', sm: 'row' }}
              spacing={{ xs: 2, sm: 2 }}
              justifyContent={{ xs: 'flex-start', lg: 'flex-start' }}
              sx={{ width: '100%', maxWidth: { xs: 'none', sm: 'none' }, mt: { xs: 1, sm: 0 } }}
            >
              {/* Buttons remain; mobile socials moved beside avatar */}
              <Button
                component={motion.button}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' }}
                variant="outlined"
                onClick={() => navigate('/blog')}
                sx={{
                  borderRadius: 10,
                  px: { xs: 2.25, sm: 3 },
                  py: { xs: 1, sm: 1.25 },
                  fontWeight: 700,
                  fontSize: { xs: 14, sm: 16 },
                  borderColor: theme.palette.primary.main,
                  color: textColor,
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  width: { xs: '100%', sm: 'auto' },
                  '&:hover': {
                    borderColor: theme.palette.secondary.main,
                    color: theme.palette.secondary.main,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Read Blog
              </Button>
              <Button
                component={motion.button}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5, ease: 'easeOut' }}
                variant="text"
                onClick={() => navigate('/about')}
                sx={{
                  borderRadius: 10,
                  px: { xs: 2.25, sm: 3 },
                  py: { xs: 1, sm: 1.25 },
                  fontWeight: 700,
                  fontSize: { xs: 14, sm: 16 },
                  color: textColor,
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  width: { xs: '100%', sm: 'auto' },
                  '&:hover': {
                    color: theme.palette.secondary.main,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                About Me
              </Button>
            </Stack>
          </Box>
        </Box>
        {/* Skills */}
        <Box sx={{ 
          mt: { xs: 4, sm: 6, lg: 8 }, 
          width: '100%', 
          display: 'flex', 
          flexDirection: { xs: 'column', lg: 'row' }, 
          gap: { xs: 3, lg: 4 }, 
          justifyContent: 'center', 
          alignItems: 'stretch',
          px: { xs: 2, sm: 3 },
        }}>
          {/* Skills Section */}
          <Box sx={{ 
            flex: 1, 
            minWidth: 0, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: { xs: 'center', lg: 'flex-start' }, 
            background: 'none', 
            boxShadow: 'none', 
            p: 0 
          }}>
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 400, 
              mb: 1.5, 
              color: textColor, 
              fontSize: { xs: 16, sm: 18 }, 
              letterSpacing: 0.2,
              textAlign: { xs: 'center', lg: 'left' },
            }}>Skills</Typography>
            <Box component="ul" sx={{ 
              listStyle: 'none', 
              p: 0, 
              m: 0, 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: { xs: 1.5, sm: 2 },
              justifyContent: { xs: 'center', lg: 'flex-start' },
            }}>
              {profile?.skills?.map((skill, i) => (
                <Box component="li" key={i} sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  fontWeight: 300, 
                  fontSize: { xs: 14, sm: 16 }, 
                  color: theme.palette.primary.main, 
                  mr: { xs: 1, sm: 2 },
                  mb: 0.5,
                }}>
                  <span style={{ 
                    display: 'inline-block', 
                    width: 6, 
                    height: 6, 
                    borderRadius: '50%', 
                    background: theme.palette.primary.main, 
                    marginRight: 6, 
                    opacity: 0.7 
                  }} />
                  {skill.name}
                </Box>
              ))}
            </Box>
          </Box>
          {/* Divider */}
          <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', mx: 1 }}>
            <Box sx={{ width: 3, height: 80, borderRadius: 2, background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})` }} />
          </Box>
          {/* Soft Skills Section */}
          <Box sx={{ 
            flex: 1, 
            minWidth: 0, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: { xs: 'center', lg: 'flex-start' }, 
            background: 'none', 
            boxShadow: 'none', 
            p: 0 
          }}>
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 400, 
              mb: 1.5, 
              color: textColor, 
              fontSize: { xs: 16, sm: 18 }, 
              letterSpacing: 0.2,
              textAlign: { xs: 'center', lg: 'left' },
            }}>Tools</Typography>
            <Box component="ul" sx={{ 
              listStyle: 'none', 
              p: 0, 
              m: 0, 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: { xs: 1.5, sm: 2 },
              justifyContent: { xs: 'center', lg: 'flex-start' },
            }}>
              {profile?.softskills?.map((skill, i) => (
                <Box component="li" key={i} sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  fontWeight: 300, 
                  fontSize: { xs: 14, sm: 16 }, 
                  color: theme.palette.secondary.main, 
                  mr: { xs: 1, sm: 2 },
                  mb: 0.5,
                }}>
                  <span style={{ 
                    display: 'inline-block', 
                    width: 6, 
                    height: 6, 
                    borderRadius: '50%', 
                    background: theme.palette.secondary.main, 
                    marginRight: 6, 
                    opacity: 0.7 
                  }} />
                  {skill.name}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Home; 
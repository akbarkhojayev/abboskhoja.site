import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Avatar, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import parse from 'html-react-parser';
import { motion } from 'framer-motion';
import Loader from '../components/Loader';
import Skeleton from '@mui/material/Skeleton';

const API_BASE = 'https://api.abboskhoja.site';

function About() {
  const [profile, setProfile] = useState(null);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/user/`).then(res => setProfile(res.data[0]));
    axios.get(`${API_BASE}/educations/`).then(res => setEducation(res.data.results || res.data));
    axios.get(`${API_BASE}/experiences/`).then(res => setExperience(res.data.results || res.data));
  }, []);

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const textColor = theme.palette.text.primary;

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

  if (!profile || !education || !experience) return (
    <Box sx={{ minHeight: '100vh', background: theme.palette.background.default, py: 8 }}>
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 5 }}>
          <Skeleton variant="circular" width={72} height={72} sx={{ mr: 2 }} />
          <Box>
            <Skeleton variant="text" width={180} height={36} sx={{ mb: 1, fontSize: 28, borderRadius: 2 }} />
            <Skeleton variant="text" width={220} height={24} sx={{ mb: 1, fontSize: 18, borderRadius: 2 }} />
            <Skeleton variant="text" width={180} height={18} sx={{ fontSize: 15, borderRadius: 2 }} />
          </Box>
        </Box>
        <Skeleton variant="rectangular" width="100%" height={48} sx={{ borderRadius: 3, mb: 4 }} />
        <Skeleton variant="rectangular" width="100%" height={48} sx={{ borderRadius: 3, mb: 4 }} />
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
      <Container maxWidth="md" sx={{ px: { xs: 1, sm: 2 } }}>
        {/* Profile section */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'center', sm: 'flex-start' },
          gap: { xs: 2, sm: 3 }, 
          mb: { xs: 4, sm: 5 },
          textAlign: { xs: 'center', sm: 'left' },
        }}>
          <Avatar 
            src={profile?.avatar || ''} 
            sx={{ 
              width: { xs: 80, sm: 72 }, 
              height: { xs: 80, sm: 72 }, 
              boxShadow: 2, 
              border: `3px solid ${theme.palette.background.paper}`,
              mb: { xs: 1, sm: 0 },
            }} 
          />
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 900, 
                color: textColor, 
                letterSpacing: '-1.5px',
                fontSize: { xs: '1.75rem', sm: '2.125rem' },
                mb: 1,
              }}
            >
              {profile?.first_name || ''} {profile?.last_name || ''}
            </Typography>
            {profile?.bio && (
              <Typography 
                variant="body1" 
                sx={{ 
                  color: textColor, 
                  fontWeight: 300, 
                  mt: 0.5,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  lineHeight: 1.6,
                }}
              >
                {parse(profile.bio)}
              </Typography>
            )}
            {profile?.about_me && (
              <Typography 
                variant="body2" 
                sx={{ 
                  color: textColor, 
                  fontWeight: 300, 
                  fontStyle: 'italic', 
                  mt: 0.5,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  lineHeight: 1.5,
                }}
              >
                {parse(profile.about_me)}
              </Typography>
            )}
          </Box>
        </Box>
        {/* Education section */}
        <Box sx={{ mb: { xs: 4, sm: 6 } }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 400, 
              color: textColor, 
              mb: 2, 
              letterSpacing: 0.2,
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            Education
          </Typography>
          <List sx={{ p: 0 }}>
            {education.map(edu => (
              <ListItem
                key={edu.id}
                alignItems="flex-start"
                sx={{
                  px: { xs: 1, sm: 0 },
                  py: { xs: 2, sm: 1.5 },
                  borderBottom: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#eee'}`,
                  transition: 'all 0.2s ease',
                  mt: 2,
                  borderRadius: 2,
                  '&:hover': {
                    boxShadow: '0 8px 24px -8px rgba(80,120,200,0.13)',
                    backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f9f9f9',
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Typography sx={{ 
                      fontWeight: 700, 
                      color: textColor,
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                    }}>
                      {edu.degree}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ pl: { xs: 0, sm: 2 }, pr: { xs: 0, sm: 2 } }}>
                      <Typography 
                        component="span" 
                        variant="body2" 
                        color="text.primary" 
                        sx={{ 
                          fontWeight: 400, 
                          display: 'block', 
                          mb: 0.5,
                          fontSize: { xs: '0.8rem', sm: '0.875rem' },
                        }}
                      >
                        {edu.school}
                      </Typography>
                      {edu.teacher && (
                        <Typography 
                          component="span" 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            fontWeight: 300, 
                            display: 'block', 
                            mb: 0.5,
                            fontSize: { xs: '0.75rem', sm: '0.8rem' },
                          }}
                        >
                          Teacher: {edu.teacher}
                        </Typography>
                      )}
                      <Typography 
                        component="span" 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          display: 'block', 
                          mb: 0.5,
                          fontSize: { xs: '0.75rem', sm: '0.8rem' },
                        }}
                      >
                        {`${edu.start_year} - ${edu.end_year}`}
                      </Typography>
                      {edu.description && (
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            display: 'block', 
                            mt: 0.5, 
                            color: textColor, 
                            fontWeight: 300,
                            fontSize: { xs: '0.8rem', sm: '0.875rem' },
                            lineHeight: 1.5,
                          }}
                        >
                          {parse(edu.description)}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
        {/* Experience section */}
        <Box>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 400, 
              color: textColor, 
              mb: 2, 
              letterSpacing: 0.2,
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            Experience
          </Typography>
          <List sx={{ p: 0 }}>
            {experience.map(exp => (
              <ListItem
                key={exp.id}
                alignItems="flex-start"
                sx={{
                  px: { xs: 1, sm: 0 },
                  py: { xs: 2, sm: 1.5 },
                  borderBottom: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#eee'}`,
                  transition: 'all 0.2s ease',
                  mt: 2,
                  borderRadius: 2,
                  '&:hover': {
                    boxShadow: '0 8px 24px -8px rgba(80,120,200,0.13)',
                    backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f9f9f9',
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Typography sx={{ 
                      fontWeight: 700, 
                      color: textColor,
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                    }}>
                      {exp.position || exp.job_title}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ pl: { xs: 0, sm: 2 }, pr: { xs: 0, sm: 2 } }}>
                      <Typography 
                        component="span" 
                        variant="body2" 
                        color="text.primary" 
                        sx={{ 
                          fontWeight: 400, 
                          display: 'block', 
                          mb: 0.5,
                          fontSize: { xs: '0.8rem', sm: '0.875rem' },
                        }}
                      >
                        {exp.company}
                      </Typography>
                      <Typography 
                        component="span" 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          display: 'block', 
                          mb: 0.5,
                          fontSize: { xs: '0.75rem', sm: '0.8rem' },
                        }}
                      >
                        {`${exp.start_date} - ${exp.end_date || 'Present'}`}
                      </Typography>
                      {exp.description && (
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            display: 'block', 
                            mt: 0.5, 
                            color: textColor, 
                            fontWeight: 300,
                            fontSize: { xs: '0.8rem', sm: '0.875rem' },
                            lineHeight: 1.5,
                          }}
                        >
                          {parse(exp.description)}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Container>
    </Box>
  );
}

export default About; 
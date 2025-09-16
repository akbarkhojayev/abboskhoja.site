import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, CardActions, Button, Box, Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import parse from 'html-react-parser';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import Skeleton from '@mui/material/Skeleton';

const API_BASE = 'http://127.0.0.1:8000/';

function Blog() {
  const [posts, setPosts] = useState([]);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const textColor = theme.palette.text.primary;
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_BASE}/blogs/`).then(res => {
      const postsData = res.data.results || res.data;
      // Sort posts by created_at in descending order (newest first)
      const sortedPosts = postsData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setPosts(sortedPosts);
    });
  }, []);

  // Group posts by year and month
  const grouped = useMemo(() => {
    const groups = {};
    posts.forEach(post => {
      const date = new Date(post.created_at);
      const year = date.getFullYear();
      const month = date.toLocaleString('default', { month: 'long' });
      if (!groups[year]) groups[year] = {};
      if (!groups[year][month]) groups[year][month] = [];
      groups[year][month].push(post);
    });
    
    // Add 2025 year if it doesn't exist
    if (!groups[2025]) {
      groups[2025] = {};
    }
    
    return groups;
  }, [posts]);

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

  if (!posts || posts.length === 0) return (
    <Box sx={{ minHeight: '100vh', background: theme.palette.background.default, py: 8 }}>
      <Container maxWidth="lg">
        <Skeleton variant="text" width={220} height={48} sx={{ mb: 4, fontSize: 32, borderRadius: 2 }} />
        {[...Array(3)].map((_, i) => (
          <Box key={i} sx={{ mb: 4 }}>
            <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 3, mb: 2 }} />
            <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1, fontSize: 22, borderRadius: 2 }} />
            <Skeleton variant="text" width="40%" height={24} sx={{ fontSize: 16, borderRadius: 2 }} />
          </Box>
        ))}
      </Container>
    </Box>
  );
  return (
    <Box sx={{ minHeight: '100vh', background: theme.palette.background.default, py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, sm: 4, md: 6 }, alignItems: 'flex-start' }}>
          {/* Main archive */}
          <Box sx={{ flex: 1 }}>
            <Typography
              component={motion.h3}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              variant="h3"
              fontWeight={400}
              sx={{ mb: { xs: 3, md: 4 }, letterSpacing: '-1px', color: textColor, fontFamily: 'Poppins, Montserrat, Inter, sans-serif', fontSize: { xs: '1.75rem', md: '2.5rem' } }}
            >
              BLOG
            </Typography>
            <Box component={motion.div} variants={container} initial="hidden" animate="show">
              {Object.keys(grouped).sort((a, b) => b - a).map(year => (
                <Box key={year} sx={{ mb: 6 }}>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'inline-block', px: { xs: 2, sm: 3 }, py: 1, borderRadius: 99, background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, fontWeight: 600, color: '#fff', fontSize: { xs: 16, sm: 18 } }}>{year}</Box>
                  </Box>
                  {Object.keys(grouped[year]).sort((a, b) => new Date(`${b} 1, 2000`) - new Date(`${a} 1, 2000`)).map(month => (
                    <Box key={month} sx={{ mb: 3 }}>
                      <Typography variant="h5" fontWeight={600} sx={{ color: textColor, mb: 1, fontSize: { xs: 18, sm: 20 } }}>{month}</Typography>
                      <Box sx={{ pl: 2 }}>
                        {grouped[year][month].map((post, idx, arr) => (
                          <Box
                            key={post.slug}
                            onClick={() => navigate(`/blog/${post.slug}`)}
                            sx={{
                              display: 'flex',
                              alignItems: { xs: 'flex-start', sm: 'center' },
                              justifyContent: 'space-between',
                              gap: { xs: 1.5, sm: 2 },
                              py: { xs: 1.5, sm: 2.5 },
                              px: { xs: 2, sm: 3 },
                              mb: idx !== arr.length - 1 ? 2 : 0,
                              background: 'transparent',
                              boxShadow: theme.palette.mode === 'dark'
                                ? '0 12px 24px -8px rgba(80,120,200,0.18)'
                                : '0 12px 24px -8px rgba(24,26,32,0.13)',
                              borderRadius: 2,
                              cursor: 'pointer',
                              transition: 'background 0.2s, box-shadow 0.2s',
                              '&:hover': {
                                boxShadow: theme.palette.mode === 'dark'
                                  ? '0 18px 36px -8px rgba(80,120,200,0.22)'
                                  : '0 18px 36px -8px rgba(24,26,32,0.18)',
                              },
                              '&:hover .arrow': {
                                opacity: 1,
                                transform: 'translateX(0)',
                              },
                            }}
                          >
                            <Box sx={{ minWidth: 0 }}>
                              <Typography variant="body2" sx={{ color: textColor, mb: 0.5, fontSize: { xs: 13, sm: 14 } }}>
                                {new Date(post.created_at).toLocaleDateString(undefined, { day: '2-digit', month: 'long', year: 'numeric' })}
                              </Typography>
                              <Typography variant="h6" sx={{ color: textColor, fontWeight: 700, fontSize: { xs: 16, sm: 18 }, lineHeight: 1.4 }}>
                                {post.title}
                              </Typography>
                            </Box>
                            <ArrowForwardIcon
                              className="arrow"
                              sx={{
                                opacity: 0,
                                transform: 'translateX(-10px)',
                                color: textColor,
                                fontSize: { xs: 22, sm: 28 },
                                transition: 'all 0.2s',
                              }}
                            />
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </Box>
          {/* Sidebar */}
          <Box sx={{ 
            minWidth: { md: 280 }, 
            maxWidth: { md: 340 }, 
            width: { xs: '100%', md: 'auto' },
            background: theme.palette.background.paper, 
            p: { xs: 2, sm: 3 }, 
            borderRadius: 4,
            position: { xs: 'static', md: 'sticky' },
            top: { md: 100 },
            height: 'fit-content'
          }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: textColor }}>Agar bu sizga foydali bo'lgan bo'lsa — xursandman!</Typography>
            <Typography variant="body2" sx={{ color: textColor, mb: 1 }}>
              Qo'shimcha savollar bo'lsa, bemalol murojaat qiling yoki ushbu ma'lumotni do'stlaringiz bilan bo'lishing.<br />
              Bog'lanish uchun: <a href="https://t.me/akbarkhojayev" target="_blank" rel="noopener noreferrer" style={{ color: theme.palette.primary.main, textDecoration: 'none' }}>@akbarkhojayev</a>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Blog; 
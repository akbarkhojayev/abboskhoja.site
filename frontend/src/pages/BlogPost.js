import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container, Typography, Box, Avatar, Chip, Paper, Stack, Divider, List, ListItem, ListItemAvatar, ListItemText, TextField, Button, Alert, IconButton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import parse, { domToReact } from 'html-react-parser';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { motion } from 'framer-motion';
import Loader from '../components/Loader';
import Skeleton from '@mui/material/Skeleton';

const API_BASE = 'https://api.abboskhoja.uz';

function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [postLoading, setPostLoading] = useState(true);
  const [allPosts, setAllPosts] = useState([]);
  const [navLoading, setNavLoading] = useState(true);
  const theme = useTheme();
  const textColor = theme.palette.text.primary;

  // Fetch all blog posts for navigation
  useEffect(() => {
    setNavLoading(true);
    axios.get(`${API_BASE}/blogs/`).then(res => {
      const postsData = res.data.results || res.data;
      // Sort posts by created_at in descending order (newest first)
      const sortedPosts = postsData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setAllPosts(sortedPosts);
      setNavLoading(false);
    });
  }, []);

  // Find current, previous, next post
  const currentIndex = allPosts.findIndex(p => p.slug === slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  useEffect(() => {
    setPostLoading(true);
    axios.get(`${API_BASE}/blog/${slug}/`).then(res => {
      setPost(res.data);
      setPostLoading(false);
    });
  }, [slug]);

  if (postLoading || !post || !allPosts) return (
    <Box sx={{ minHeight: '100vh', background: theme.palette.background.default, py: { xs: 4, md: 8 } }}>
      <Container maxWidth="md" sx={{ pl: 0, pr: 0 }}>
        <Skeleton variant="rectangular" width="100%" height={320} sx={{ mb: 4, borderRadius: 4 }} />
        <Skeleton variant="text" width={320} height={48} sx={{ mb: 2, fontSize: 32, borderRadius: 2 }} />
        <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1, fontSize: 18, borderRadius: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={120} sx={{ borderRadius: 3, mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={48} sx={{ borderRadius: 3, mb: 2 }} />
      </Container>
    </Box>
  );

  // Custom render for code blocks and images
  const renderHtml = html => parse(html, {
    replace: domNode => {
      // Handle code blocks
      if (domNode.name === 'pre' && domNode.children && domNode.children[0]?.name === 'code') {
        const codeText = domNode.children[0].children?.[0]?.data || '';
        return (
          <Box sx={{ position: 'relative', my: 3 }}>
            <Box
              component="pre"
              sx={{
                background: theme.palette.background.paper,
                color: theme.palette.text.primary,
                fontSize: 18,
                p: 3,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                overflowX: 'unset',
                fontFamily: 'Fira Mono, monospace',
                mb: 0,
                boxShadow: 6,
              }}
            >
              {codeText}
            </Box>
            <IconButton
              size="small"
              onClick={() => navigator.clipboard.writeText(codeText)}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: theme.palette.primary.main,
                background: theme.palette.background.default,
                borderRadius: 2,
                boxShadow: 1,
                '&:hover': { background: theme.palette.background.paper },
              }}
              title="Copy code"
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Box>
        );
      }
      
      // CKEditor dan kelgan rasmlar uchun yangi logika
      if (domNode.name === 'img') {
        const src = domNode.attribs?.src;
        const alt = domNode.attribs?.alt || 'Blog image';
        
        // Agar rasm URL relative bo'lsa, uni absolute qilish
        const imageUrl = src?.startsWith('http') ? src : `${API_BASE}${src}`;
        
        return (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            my: 4,
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              borderRadius: 2,
              boxShadow: 3,
            }
          }}>
            <img 
              src={imageUrl} 
              alt={alt}
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            />
          </Box>
        );
      }
    }
  });

  return (
    <Box sx={{ minHeight: '100vh', background: theme.palette.background.default, py: { xs: 4, md: 8 } }}>
      <Container maxWidth="md" sx={{ pl: 0, pr: 0 }}>
        {/* Cover image */}
        {post.cover_images && post.cover_images.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 4, md: 6 } }}>
            <Box
              component="img"
              src={post.cover_images[0].image}
              alt={post.title}
              sx={{
                width: { xs: '100%', md: 520 },
                maxHeight: 420,
                objectFit: 'cover',
                boxShadow: 4,
              }}
            />
          </Box>
        )}
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            color: textColor,
            textAlign: 'left',
            margin: 0,
            fontWeight: 900,
            fontSize: 'clamp(28px, 5vw, 44px)',
            marginBottom: 24,
            letterSpacing: '-2.5px',
          }}
        >
          {post.title}
        </motion.h1>
        {/* Meta info */}
        <Stack direction="row" spacing={3} justifyContent="center" sx={{ mb: { xs: 3, md: 5 }, color: theme.palette.text.secondary, fontSize: 18 }}>
          {typeof post.view_count !== 'undefined' && (
            <Box sx={{ display: 'flex', alignItems: 'center', fontSize: 15, color: theme.palette.text.secondary, mr: 2 }}>
              <span style={{ marginRight: 4 }}>👁</span> {post.view_count}
            </Box>
          )}
          {typeof post.read_time !== 'undefined' && post.read_time > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', fontSize: 15, color: theme.palette.text.secondary }}>
              <span style={{ marginRight: 4 }}>⏱</span> {post.read_time} min read
            </Box>
          )}
        </Stack>
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: 820, p: { xs: 2.5, md: 5 }, mb: 6, fontSize: 20, lineHeight: 1.8, color: textColor }}>
              {post.content ? renderHtml(post.content) : <CircularProgress size={32} thickness={4} sx={{ color: theme.palette.text.primary, mt: 4 }} />}
            </Box>
          </Box>
        </motion.div>
        {/* Navigation bar (unchanged) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7, ease: 'easeOut' }}
          style={{ marginTop: 48, marginBottom: 32, display: 'flex', justifyContent: 'center' }}
        >
          {navLoading ? (
            <CircularProgress size={32} thickness={4} sx={{ color: theme.palette.text.primary }} />
          ) : (
            <Box sx={{ width: '100%', maxWidth: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto',
              borderTop: `1px solid ${theme.palette.divider || (theme.palette.mode === 'dark' ? '#23262F' : '#e3e8ef')}`,
              borderBottom: `1px solid ${theme.palette.divider || (theme.palette.mode === 'dark' ? '#23262F' : '#e3e8ef')}`,
              background: theme.palette.background.paper }}>
              <Box sx={{ flex: 1, textAlign: 'center', borderRight: `1px solid ${theme.palette.divider || (theme.palette.mode === 'dark' ? '#23262F' : '#e3e8ef')}`, py: 2.5 }}>
                <a
                  href={prevPost ? `/blog/${prevPost.slug}` : undefined}
                  style={{
                    color: prevPost ? theme.palette.primary.main : theme.palette.text.disabled,
                    fontWeight: 400,
                    fontSize: 18,
                    textDecoration: 'none',
                    pointerEvents: prevPost ? 'auto' : 'none',
                    cursor: prevPost ? 'pointer' : 'default',
                  }}
                >
                  ← Previous
                </a>
              </Box>
              <Box sx={{ flex: 1, textAlign: 'center', borderRight: `1px solid ${theme.palette.divider || (theme.palette.mode === 'dark' ? '#23262F' : '#e3e8ef')}`, py: 2.5 }}>
                <a
                  href="/blog"
                  style={{
                    color: theme.palette.primary.main,
                    fontWeight: 400,
                    fontSize: 18,
                    textDecoration: 'none',
                  }}
                >
                  See More
                </a>
              </Box>
              <Box sx={{ flex: 1, textAlign: 'center', py: 2.5 }}>
                <a
                  href={nextPost ? `/blog/${nextPost.slug}` : undefined}
                  style={{
                    color: nextPost ? theme.palette.primary.main : theme.palette.text.disabled,
                    fontWeight: 400,
                    fontSize: 18,
                    textDecoration: 'none',
                    pointerEvents: nextPost ? 'auto' : 'none',
                    cursor: nextPost ? 'pointer' : 'default',
                  }}
                >
                  Next →
                </a>
              </Box>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  );
}

export default BlogPost; 
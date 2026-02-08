import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Chip, IconButton, Snackbar, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import parse from 'html-react-parser';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import axios from 'axios';
import { motion } from 'framer-motion';
import Skeleton from '@mui/material/Skeleton';

const API_BASE = 'https://api.abboskhoja.uz';

function AlgorithmDetail() {
  const { slug } = useParams();
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const theme = useTheme();
  const textColor = theme.palette.text.primary;
  const navigate = useNavigate();

  const handleCopyCode = () => {
    const codeElement = document.querySelector('.solution-code-content pre');
    if (codeElement) {
      navigator.clipboard.writeText(codeElement.textContent);
      setCopySuccess(true);
    }
  };

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_BASE}/leetcode/${slug}/`)
      .then(res => {
        setSolution(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'easy': return '#00b8a3';
      case 'medium': return '#ffa116';
      case 'hard': return '#ff375f';
      default: return theme.palette.text.secondary;
    }
  };

  const renderHtml = (html) => {
    if (!html) return null;
    return parse(html, {
      replace: (domNode) => {
        if (domNode.name === 'pre' && domNode.children && domNode.children[0]?.name === 'code') {
          const codeText = domNode.children[0].children?.[0]?.data || '';
          return (
            <Box
              component="pre"
              sx={{
                background: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f8f9fa',
                color: theme.palette.text.primary,
                fontSize: { xs: 13, sm: 14 },
                p: { xs: 2, sm: 2.5 },
                m: 0,
                my: 2,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                overflowX: 'auto',
                fontFamily: 'Fira Code, Menlo, Monaco, monospace',
                lineHeight: 1.6,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              {codeText}
            </Box>
          );
        }
      }
    });
  };

  if (loading || !solution) {
    return (
      <Box sx={{ minHeight: '100vh', background: theme.palette.background.default, py: 8 }}>
        <Container maxWidth="lg">
          <Skeleton variant="text" width={320} height={48} sx={{ mb: 4, fontSize: 32, borderRadius: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 3, mb: 3 }} />
          <Skeleton variant="rectangular" width="100%" height={150} sx={{ borderRadius: 3, mb: 3 }} />
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: theme.palette.background.default, py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Back Button */}
        <Box 
          onClick={() => navigate('/algorithms')}
          sx={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            mb: 3,
            cursor: 'pointer',
            color: theme.palette.text.secondary,
            transition: 'color 0.2s',
            '&:hover': {
              color: theme.palette.primary.main
            }
          }}
        >
          <ArrowBackIcon fontSize="small" />
          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 14 }}>
            Back to Solutions
          </Typography>
        </Box>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  color: theme.palette.text.secondary, 
                  fontWeight: 600,
                  fontSize: { xs: '1.25rem', md: '1.5rem' }
                }}
              >
                #{solution.problem_number}
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  color: textColor,
                  fontWeight: 400,
                  fontSize: { xs: '1.75rem', md: '2.5rem' },
                  letterSpacing: '-1px',
                  fontFamily: 'Poppins, Montserrat, Inter, sans-serif',
                }}
              >
                {solution.title}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
              <Chip 
                label={solution.difficulty.charAt(0).toUpperCase() + solution.difficulty.slice(1)}
                sx={{ 
                  background: getDifficultyColor(solution.difficulty),
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: { xs: 12, sm: 13 }
                }}
              />
              <Chip 
                label={solution.language.toUpperCase()}
                variant="outlined"
                sx={{ fontWeight: 600, fontSize: { xs: 12, sm: 13 } }}
              />
              <Chip 
                label={`Time: ${solution.time_complexity}`}
                variant="outlined"
                sx={{ fontWeight: 500, fontSize: { xs: 11, sm: 12 } }}
              />
              <Chip 
                label={`Space: ${solution.space_complexity}`}
                variant="outlined"
                sx={{ fontWeight: 500, fontSize: { xs: 11, sm: 12 } }}
              />
              {solution.leetcode_url && (
                <Box
                  component="a"
                  href={solution.leetcode_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    ml: 'auto',
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    fontSize: { xs: 12, sm: 13 },
                    fontWeight: 600,
                    transition: 'opacity 0.2s',
                    '&:hover': {
                      opacity: 0.8
                    }
                  }}
                >
                  View on LeetCode
                  <OpenInNewIcon sx={{ fontSize: 16 }} />
                </Box>
              )}
            </Box>

            {solution.tags && solution.tags.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                {solution.tags.map((tag, idx) => (
                  <Chip 
                    key={idx}
                    label={tag.name}
                    size="small"
                    sx={{ 
                      background: theme.palette.mode === 'dark' ? '#2a2d3a' : '#f0f0f0',
                      fontSize: { xs: 11, sm: 12 },
                      fontWeight: 500
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </motion.div>

        {/* Main Content - Two Column Layout */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Left Column */}
          <Box sx={{ flex: 1 }}>
            {/* Problem Statement */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
            >
              <Box sx={{ mb: 5 }}>
                <Typography 
                  variant="h5" 
                  fontWeight={600}
                  sx={{ 
                    color: textColor, 
                    mb: 2,
                    fontSize: { xs: 18, sm: 20 }
                  }}
                >
                  Problem Statement
                </Typography>
                <Box sx={{ 
                  fontSize: { xs: 15, sm: 16 },
                  lineHeight: 1.8,
                  color: textColor,
                  '& p': { mb: 2 },
                  '& ul, & ol': { pl: 3, mb: 2 },
                  '& li': { mb: 1 },
                  '& strong': { fontWeight: 600 },
                  '& code': {
                    background: theme.palette.mode === 'dark' ? '#2a2d3a' : '#f0f0f0',
                    px: 1,
                    py: 0.5,
                    borderRadius: 0.5,
                    fontSize: '0.9em',
                    fontFamily: 'Fira Code, monospace'
                  }
                }}>
                  {renderHtml(solution.problem_statement)}
                </Box>
              </Box>
            </motion.div>

            {/* Approach */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
            >
              <Box sx={{ mb: 5 }}>
                <Typography 
                  variant="h5" 
                  fontWeight={600}
                  sx={{ 
                    color: textColor, 
                    mb: 2,
                    fontSize: { xs: 18, sm: 20 }
                  }}
                >
                  Approach / Thought Process
                </Typography>
                <Box sx={{ 
                  fontSize: { xs: 15, sm: 16 },
                  lineHeight: 1.8,
                  color: textColor,
                  '& p': { mb: 2 },
                  '& ul, & ol': { pl: 3, mb: 2 },
                  '& li': { mb: 1 },
                  '& strong': { fontWeight: 600 },
                  '& code': {
                    background: theme.palette.mode === 'dark' ? '#2a2d3a' : '#f0f0f0',
                    px: 1,
                    py: 0.5,
                    borderRadius: 0.5,
                    fontSize: '0.9em',
                    fontFamily: 'Fira Code, monospace'
                  }
                }}>
                  {renderHtml(solution.approach)}
                </Box>
              </Box>
            </motion.div>
          </Box>

          {/* Right Column - Sticky */}
          <Box sx={{ 
            width: { xs: '100%', md: '45%' },
            position: { xs: 'static', md: 'sticky' },
            top: { md: 100 },
            height: 'fit-content',
            maxHeight: { md: 'calc(100vh - 120px)' },
            overflowY: 'auto'
          }}>
            {/* Solution Code */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
            >
              <Box sx={{ 
                mb: 4,
                background: theme.palette.background.paper,
                borderRadius: 3,
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 4px 20px rgba(0,0,0,0.3)' 
                  : '0 4px 20px rgba(0,0,0,0.1)',
                overflow: 'hidden'
              }}>
                <Box sx={{ 
                  px: 3, 
                  py: 2, 
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  background: theme.palette.background.paper,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <Typography 
                    variant="h6" 
                    fontWeight={600}
                    sx={{ 
                      color: textColor,
                      fontSize: { xs: 16, sm: 18 }
                    }}
                  >
                    Solution Code
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={handleCopyCode}
                    sx={{
                      color: theme.palette.text.secondary,
                      transition: 'all 0.2s',
                      '&:hover': { 
                        color: theme.palette.primary.main,
                        transform: 'scale(1.1)'
                      }
                    }}
                    title="Copy code"
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Box className="solution-code-content" sx={{ 
                  p: { xs: 2, sm: 3 },
                  background: theme.palette.mode === 'dark' ? '#1a1d23' : '#fafafa',
                }}>
                  {renderHtml(solution.solution_code)}
                </Box>
              </Box>
            </motion.div>

            {/* Code Explanation */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
            >
              <Box sx={{ 
                background: theme.palette.background.paper,
                borderRadius: 3,
                p: { xs: 2.5, sm: 3 },
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 4px 20px rgba(0,0,0,0.3)' 
                  : '0 4px 20px rgba(0,0,0,0.1)',
              }}>
                <Typography 
                  variant="h6" 
                  fontWeight={600}
                  sx={{ 
                    color: textColor, 
                    mb: 2,
                    fontSize: { xs: 16, sm: 18 }
                  }}
                >
                  Code Explanation
                </Typography>
                <Box sx={{ 
                  fontSize: { xs: 15, sm: 16 },
                  lineHeight: 1.8,
                  color: textColor,
                  '& p': { mb: 2 },
                  '& ul, & ol': { pl: 3, mb: 2 },
                  '& li': { mb: 1 },
                  '& strong': { fontWeight: 600 },
                  '& code': {
                    background: theme.palette.mode === 'dark' ? '#2a2d3a' : '#f0f0f0',
                    px: 1,
                    py: 0.5,
                    borderRadius: 0.5,
                    fontSize: '0.9em',
                    fontFamily: 'Fira Code, monospace'
                  }
                }}>
                  {renderHtml(solution.explanation)}
                </Box>
              </Box>
            </motion.div>
          </Box>
        </Box>

        {/* Copy Success Snackbar */}
        <Snackbar 
          open={copySuccess} 
          autoHideDuration={2000} 
          onClose={() => setCopySuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setCopySuccess(false)} 
            severity="success" 
            sx={{ width: '100%' }}
          >
            Code copied to clipboard!
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default AlgorithmDetail;

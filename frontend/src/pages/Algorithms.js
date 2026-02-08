import React, { useEffect, useState, useMemo } from 'react';
import { Container, Typography, Box, Chip, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';

const API_BASE = 'https://api.abboskhoja.uz';

function Algorithms() {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const theme = useTheme();
  const textColor = theme.palette.text.primary;
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_BASE}/leetcode/`)
      .then(res => {
        setSolutions(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredSolutions = useMemo(() => {
    return solutions.filter(sol => {
      const matchesSearch = sol.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           sol.problem_number.toString().includes(searchTerm);
      const matchesDifficulty = difficultyFilter === 'all' || sol.difficulty === difficultyFilter;
      const matchesLanguage = languageFilter === 'all' || sol.language === languageFilter;
      return matchesSearch && matchesDifficulty && matchesLanguage;
    });
  }, [solutions, searchTerm, difficultyFilter, languageFilter]);

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'easy': return '#00b8a3';
      case 'medium': return '#ffa116';
      case 'hard': return '#ff375f';
      default: return theme.palette.text.secondary;
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', background: theme.palette.background.default, py: 8 }}>
        <Container maxWidth="lg">
          <Skeleton variant="text" width={280} height={48} sx={{ mb: 4, fontSize: 32, borderRadius: 2 }} />
          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <Skeleton variant="rectangular" width={200} height={56} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rectangular" width={150} height={56} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rectangular" width={150} height={56} sx={{ borderRadius: 2 }} />
          </Box>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" width="100%" height={80} sx={{ borderRadius: 3, mb: 2 }} />
          ))}
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: theme.palette.background.default, py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Typography
          component={motion.h3}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          variant="h3"
          fontWeight={400}
          sx={{ 
            mb: { xs: 4, md: 6 }, 
            letterSpacing: '-1px', 
            color: textColor, 
            fontFamily: 'Poppins, Montserrat, Inter, sans-serif',
            fontSize: { xs: '1.75rem', md: '2.5rem' }
          }}
        >
          LeetCode Solutions
        </Typography>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search by title or number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ 
              flex: 1, 
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Difficulty</InputLabel>
            <Select
              value={difficultyFilter}
              label="Difficulty"
              onChange={(e) => setDifficultyFilter(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="easy">Easy</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="hard">Hard</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Language</InputLabel>
            <Select
              value={languageFilter}
              label="Language"
              onChange={(e) => setLanguageFilter(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="python">Python</MenuItem>
              <MenuItem value="java">Java</MenuItem>
              <MenuItem value="cpp">C++</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Solutions List */}
        <Box component={motion.div} initial="hidden" animate="show">
          {filteredSolutions.map((solution) => (
            <Box
              key={solution.id}
              onClick={() => navigate(`/algorithms/${solution.slug}`)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                py: { xs: 2, sm: 2.5 },
                px: { xs: 2, sm: 3 },
                mb: 2,
                background: 'transparent',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 8px 16px -6px rgba(80,120,200,0.15)'
                  : '0 8px 16px -6px rgba(24,26,32,0.1)',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 12px 24px -6px rgba(80,120,200,0.2)'
                    : '0 12px 24px -6px rgba(24,26,32,0.15)',
                },
                '&:hover .arrow': {
                  opacity: 1,
                  transform: 'translateX(0)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: theme.palette.text.secondary, 
                    fontWeight: 600,
                    fontSize: { xs: 16, sm: 18 },
                    minWidth: { xs: 40, sm: 50 }
                  }}
                >
                  #{solution.problem_number}
                </Typography>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: textColor, 
                      fontWeight: 700, 
                      fontSize: { xs: 16, sm: 18 },
                      mb: 0.5
                    }}
                  >
                    {solution.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Chip 
                      label={solution.difficulty.charAt(0).toUpperCase() + solution.difficulty.slice(1)}
                      size="small"
                      sx={{ 
                        background: getDifficultyColor(solution.difficulty),
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: 11
                      }}
                    />
                    <Chip 
                      label={solution.language.toUpperCase()}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: 11 }}
                    />
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: 12 }}>
                      {solution.time_complexity} • {solution.space_complexity}
                    </Typography>
                  </Box>
                </Box>
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
          {filteredSolutions.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
                No solutions found
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default Algorithms;

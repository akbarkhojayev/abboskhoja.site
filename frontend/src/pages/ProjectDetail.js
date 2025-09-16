import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Chip, Stack, Button } from '@mui/material';
import parse from 'html-react-parser';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/';

function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE}/admin-projects/${id}/`).then(res => setProject(res.data));
  }, [id]);

  if (!project) return null;

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(120deg, #181A20 0%, #23262F 100%)', py: 6 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: { xs: 'block', md: 'flex' }, flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 4, md: 8 }, alignItems: 'flex-start' }}>
          {/* Main content */}
          <Box sx={{ flex: 2.5, minWidth: 0, maxWidth: { md: '68%' }, width: '100%', p: { xs: 2, sm: 6 } }}>
            <Typography
              variant="h2"
              fontWeight={900}
              sx={{
                mb: 1,
                letterSpacing: '-2px',
                background: 'linear-gradient(90deg, #4F8CFF, #FF6B81)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.1,
                textAlign: 'left',
                fontSize: { xs: 36, sm: 48, md: 60 },
              }}
            >
              {project.title}
            </Typography>
            {project.tag && project.tag.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 1, justifyContent: 'flex-start' }}>
                {project.tag.map((tag, i) => (
                  <Chip key={i} label={tag} sx={{
                    background: 'linear-gradient(90deg, #4F8CFF, #FF6B81)',
                    color: '#fff', fontWeight: 700, fontSize: 15
                  }} />
                ))}
              </Stack>
            )}
            {project.description && (
              <Box sx={{ color: '#F4F4F4', fontSize: 17, mt: 2 }}>{parse(project.description)}</Box>
            )}
            <Box sx={{ display: 'flex', gap: 3, mt: 3, color: '#B0B3B8', fontSize: 15 }}>
              {project.created_at && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: 4, fontSize: 16 }}>📅</span> {new Date(project.created_at).toLocaleDateString()}
                </Box>
              )}
              {project.git_hub && (
                <Button href={project.git_hub} target="_blank" sx={{ color: '#4F8CFF', textTransform: 'none', fontWeight: 700, fontSize: 15 }}>GitHub</Button>
              )}
              {project.project_url && (
                <Button href={project.project_url} target="_blank" sx={{ color: '#FF6B81', textTransform: 'none', fontWeight: 700, fontSize: 15 }}>Live Demo</Button>
              )}
            </Box>
          </Box>
          {/* Sidebar (optional) */}
          <Box sx={{ minWidth: 280, maxWidth: 340, background: '#23262F', p: 3, borderRadius: 4 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#F4F4F4' }}>Loyiha haqida</Typography>
            <Typography variant="body2" sx={{ color: '#B0B3B8', mb: 1 }}>
              Bu sahifada loyiha haqida batafsil ma’lumot, texnologiyalar va linklar jamlangan.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default ProjectDetail; 
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Container, Typography, TextField, Button, Box, Alert, Paper, useTheme } from '@mui/material';
import axios from 'axios';

const API_BASE = 'https://api.abboskhoja.uz';

// Soatni matematik misollar bilan ko‘rsatish uchun komponent
function MathClock() {
  const [now, setNow] = useState(new Date());
  const theme = useTheme();
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
  function getRandomEquation(target) {
    const operations = ['+', '-', '*', '/'];
    let a, b, op, result;
    for (let i = 0; i < 20; i++) {
      op = operations[Math.floor(Math.random() * operations.length)];
      switch (op) {
        case '+':
          a = Math.floor(Math.random() * target);
          b = target - a;
          result = a + b;
          break;
        case '-':
          a = Math.floor(Math.random() * 60) + target;
          b = a - target;
          result = a - b;
          break;
        case '*':
          b = Math.floor(Math.random() * 10) + 1;
          a = Math.floor(target / b);
          result = a * b;
          if (result !== target) continue;
          break;
        case '/':
          b = Math.floor(Math.random() * 10) + 1;
          a = target * b;
          result = a / b;
          break;
      }
      if (result === target) {
        return `${a} ${op} ${b}`;
      }
    }
    return `${target}`;
  }
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4, mb: 4, mt: 2 }}>
      {[{ label: 'Soat', value: h }, { label: 'Daqiqa', value: m }, { label: 'Sekund', value: s }].map((part, i) => (
        <Box key={part.label} sx={{ textAlign: 'center', minWidth: 110 }}>
          <Box sx={{ fontSize: 24, fontWeight: 600, color: theme.palette.text.primary, mb: 1 }}>{getRandomEquation(part.value)}</Box>
          <Box sx={{ color: theme.palette.text.secondary, fontSize: 14 }}>{part.label} ({part.value})</Box>
        </Box>
      ))}
    </Box>
  );
}

function Contact() {
  const theme = useTheme();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  // Forma o‘zgarishi
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  // Forma yuborish
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError('');
    try {
      await axios.post(`${API_BASE}/messages/create/`, form, {
        headers: { 'Content-Type': 'application/json' }
      });
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setSent(true);
      setTimeout(() => setSent(false), 1800);
    } catch (err) {
      if (err.response) {
        setError('Server xatosi: ' + (err.response.data?.detail || err.response.statusText));
      } else if (err.request) {
        setError('Server javob bermadi. Internetingizni tekshiring.');
      } else {
        setError('Xabar yuborilmadi. Qayta urinib ko‘ring!');
      }
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: theme.palette.background.default, py: { xs: 4, md: 8 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container maxWidth="sm" sx={{ zIndex: 1 }}>
        {/* Sarlavha va kichik izoh */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Typography variant="h3" align="center" fontWeight={400} sx={{ mb: 1, color: theme.palette.primary.main, letterSpacing: '-1px' }}>
            Aloqa
          </Typography>
          <Typography variant="subtitle1" align="center" sx={{ mb: 4, color: theme.palette.text.secondary }}>
            Savollaringiz, takliflaringiz yoki xabarlaringiz bo‘lsa, bemalol yozing!
          </Typography>
        </motion.div>
        {/* Soat komponenti */}
        <MathClock />
        {/* Aloqa formasi */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.7, type: 'spring', stiffness: 180 }}>
          <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, background: theme.palette.background.paper, boxShadow: '0 4px 32px 0 rgba(80,120,200,0.08)', mb: 3 }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <TextField
                label="Ismingiz"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                required
                sx={{ borderRadius: 2, background: theme.palette.background.paper, mb: 2 }}
                size="medium"
                InputLabelProps={{ style: { fontWeight: 300 } }}
                inputProps={{ style: { fontWeight: 300 } }}
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                required
                sx={{ borderRadius: 2, background: theme.palette.background.paper, mb: 2 }}
                size="medium"
                InputLabelProps={{ style: { fontWeight: 300 } }}
                inputProps={{ style: { fontWeight: 300 } }}
              />
              <TextField
                label="Telefon"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                fullWidth
                sx={{ borderRadius: 2, background: theme.palette.background.paper, mb: 2 }}
                size="medium"
                InputLabelProps={{ style: { fontWeight: 300 } }}
                inputProps={{ style: { fontWeight: 300 } }}
              />
              <TextField
                label="Mavzu"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                fullWidth
                sx={{ borderRadius: 2, background: theme.palette.background.paper, mb: 2 }}
                size="medium"
                InputLabelProps={{ style: { fontWeight: 300 } }}
                inputProps={{ style: { fontWeight: 300 } }}
              />
              <TextField
                label="Xabaringiz"
                name="message"
                value={form.message}
                onChange={handleChange}
                fullWidth
                required
                multiline
                rows={5}
                sx={{ borderRadius: 2, background: theme.palette.background.paper, mb: 2 }}
                size="medium"
                InputLabelProps={{ style: { fontWeight: 300 } }}
                inputProps={{ style: { fontWeight: 300 } }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={sent}
                sx={{
                  borderRadius: 99,
                  background: sent ? '#22c55e' : theme.palette.primary.main,
                  fontWeight: 400,
                  textTransform: 'none',
                  fontSize: 17,
                  py: 1.2,
                  boxShadow: 'none',
                  transition: 'background 0.18s',
                  '&:hover': { background: sent ? '#16a34a' : theme.palette.secondary.main },
                }}
              >
                {sent ? 'Yuborildi!' : 'Yuborish'}
              </Button>
              {success && <Alert severity="success" sx={{ mt: 2, borderRadius: 2, fontWeight: 300 }}>Xabaringiz muvaffaqiyatli yuborildi!</Alert>}
              {error && <Alert severity="error" sx={{ mt: 2, borderRadius: 2, fontWeight: 300 }}>{error}</Alert>}
            </form>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}

export default Contact; 
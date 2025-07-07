import React from 'react';
import { Box, Typography, Button, Container, Grid, Chip } from '@mui/material';
import { Play, Crown, Sparkles } from 'lucide-react';

const HeroSection = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 50%, #0F0F0F 100%)',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(106, 13, 173, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Chip
                label="🎮 New Game Mode Available"
                sx={{
                  backgroundColor: 'rgba(212, 175, 55, 0.2)',
                  color: '#D4AF37',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                }}
              />
            </Box>
            
            <Typography variant="h1" sx={{ mb: 3, textAlign: { xs: 'center', md: 'left' } }}>
              Master the Art of
              <br />
              Color Prophecy
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 4, fontSize: '1.2rem', textAlign: { xs: 'center', md: 'left' } }}>
              Embark on an epic quest where your intuition meets fortune. Predict the mystical colors 
              that emerge from the ancient ChromaOrb and claim your place among the legendary Color Seers.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'center', md: 'flex-start' } }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Play size={20} />}
                sx={{ minWidth: 200 }}
              >
                Start Your Quest
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<Crown size={20} />}
                sx={{ minWidth: 200 }}
              >
                View Leaderboard
              </Button>
            </Box>
            
            <Box sx={{ mt: 4, display: 'flex', gap: 4, justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#00C897' }}>47K+</Typography>
                <Typography variant="body1" sx={{ color: '#CCCCCC' }}>Active Seers</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#D4AF37' }}>₹2.4M</Typography>
                <Typography variant="body1" sx={{ color: '#CCCCCC' }}>Won Today</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#6A0DAD' }}>98%</Typography>
                <Typography variant="body1" sx={{ color: '#CCCCCC' }}>Success Rate</Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  width: 350,
                  height: 350,
                  borderRadius: '50%',
                  background: 'conic-gradient(from 0deg, #FF4C4C, #D4AF37, #00C897, #6A0DAD, #FF4C4C)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  animation: 'rotate 20s linear infinite',
                  '@keyframes rotate': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              >
                <Box
                  sx={{
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    backgroundColor: '#0F0F0F',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    border: '3px solid rgba(212, 175, 55, 0.3)',
                  }}
                >
                  <Sparkles size={48} color="#D4AF37" />
                  <Typography variant="h4" sx={{ mt: 2, color: '#D4AF37' }}>
                    ChromaOrb
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#CCCCCC', textAlign: 'center', px: 2 }}>
                    The mystical source of all color prophecies
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
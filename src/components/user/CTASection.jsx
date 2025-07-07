import React from 'react';
import { Box, Typography, Container, Button, Grid, Chip } from '@mui/material';
import { Play, Gift, Users, Zap } from 'lucide-react';

const CTASection = () => {
  return (
    <Box
      sx={{
        py: 8,
        background: 'linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 50%, #0F0F0F 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(106, 13, 173, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Chip
            label="🎁 Limited Time Offer"
            sx={{
              backgroundColor: 'rgba(0, 200, 151, 0.2)',
              color: '#00C897',
              border: '1px solid rgba(0, 200, 151, 0.3)',
              mb: 3,
              fontSize: '1rem',
              px: 2,
            }}
          />
          
          <Typography variant="h1" sx={{ mb: 3, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
            Your Legend Awaits
          </Typography>
          
          <Typography variant="body1" sx={{ fontSize: '1.3rem', maxWidth: 700, mx: 'auto', mb: 4 }}>
            Join thousands of color seers who have already discovered their destiny. 
            Start your journey with <strong style={{ color: '#D4AF37' }}>₹100 bonus credits</strong> and 
            <strong style={{ color: '#00C897' }}> 50 free predictions</strong> when you sign up today!
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  color: '#D4AF37',
                  mb: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  p: 2,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(212, 175, 55, 0.1)',
                  width: 80,
                  height: 80,
                  alignItems: 'center',
                  mx: 'auto',
                }}
              >
                <Zap size={32} />
              </Box>
              <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 1 }}>
                Instant Setup
              </Typography>
              <Typography variant="body2" sx={{ color: '#CCCCCC' }}>
                Create your account and start playing in under 60 seconds
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  color: '#00C897',
                  mb: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  p: 2,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0, 200, 151, 0.1)',
                  width: 80,
                  height: 80,
                  alignItems: 'center',
                  mx: 'auto',
                }}
              >
                <Gift size={32} />
              </Box>
              <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 1 }}>
                Welcome Bonus
              </Typography>
              <Typography variant="body2" sx={{ color: '#CCCCCC' }}>
                ₹100 free credits plus 50 predictions to start your quest
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  color: '#6A0DAD',
                  mb: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  p: 2,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(106, 13, 173, 0.1)',
                  width: 80,
                  height: 80,
                  alignItems: 'center',
                  mx: 'auto',
                }}
              >
                <Users size={32} />
              </Box>
              <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 1 }}>
                Join Community
              </Typography>
              <Typography variant="body2" sx={{ color: '#CCCCCC' }}>
                Connect with 47K+ active seers and share strategies
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  color: '#FF4C4C',
                  mb: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  p: 2,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 76, 76, 0.1)',
                  width: 80,
                  height: 80,
                  alignItems: 'center',
                  mx: 'auto',
                }}
              >
                <Play size={32} />
              </Box>
              <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 1 }}>
                Start Playing
              </Typography>
              <Typography variant="body2" sx={{ color: '#CCCCCC' }}>
                Begin your color prophecy journey immediately
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<Play size={24} />}
            sx={{
              fontSize: '1.2rem',
              py: 2,
              px: 4,
              minWidth: 250,
              background: 'linear-gradient(135deg, #D4AF37, #B8941F)',
              '&:hover': {
                background: 'linear-gradient(135deg, #E8C968, #D4AF37)',
                transform: 'translateY(-3px)',
                boxShadow: '0 12px 30px rgba(212, 175, 55, 0.4)',
              },
            }}
          >
            Begin Your Quest Now
          </Button>
          
          <Typography variant="body2" sx={{ color: '#CCCCCC', mt: 2 }}>
            🔒 Secure • 🎮 Fair Play Certified • 💰 Instant Withdrawals
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default CTASection;
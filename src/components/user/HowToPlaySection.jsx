import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, Chip } from '@mui/material';
import { Eye, MousePointer, Sparkles, Trophy } from 'lucide-react';

const steps = [
  {
    icon: <Eye size={32} />,
    step: 'Step 1',
    title: 'Observe the Win2Win',
    description: 'Watch the mystical Win2Win as it prepares to reveal its next color. Study the patterns and trust your intuition.',
    color: '#D4AF37',
  },
  {
    icon: <MousePointer size={32} />,
    step: 'Step 2',
    title: 'Make Your Prediction',
    description: 'Choose from Red, Green, or Violet before the timer runs out. Each color offers different reward multipliers.',
    color: '#6A0DAD',
  },
  {
    icon: <Sparkles size={32} />,
    step: 'Step 3',
    title: 'The Color Reveals',
    description: 'Watch in anticipation as the Win2Win unveils its chosen color. The magic happens in real-time!',
    color: '#00C897',
  },
  {
    icon: <Trophy size={32} />,
    step: 'Step 4',
    title: 'Claim Your Victory',
    description: 'If your prediction is correct, instantly receive your rewards and climb the leaderboard rankings.',
    color: '#FF4C4C',
  },
];

const HowToPlaySection = () => {
  return (
    <Box sx={{ py: 8, backgroundColor: '#1A1A1A' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" sx={{ mb: 2 }}>
            Master the Quest
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.2rem', maxWidth: 600, mx: 'auto' }}>
            Learn the ancient art of color prophecy in four simple steps
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {steps.map((step, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card
                sx={{
                  height: '100%',
                  position: 'relative',
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(106, 13, 173, 0.05) 100%)',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box
                      sx={{
                        color: step.color,
                        mr: 2,
                        p: 1,
                        borderRadius: 2,
                        backgroundColor: `${step.color}20`,
                      }}
                    >
                      {step.icon}
                    </Box>
                    <Chip
                      label={step.step}
                      sx={{
                        backgroundColor: step.color,
                        color: '#0F0F0F',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <Typography variant="h4" sx={{ mb: 2, fontSize: '1.4rem' }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#CCCCCC' }}>
                    {step.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            mt: 6,
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(106, 13, 173, 0.1) 100%)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" sx={{ mb: 2 }}>
            🎯 Pro Tip for Aspiring Color Seers
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.1rem', color: '#CCCCCC' }}>
            Start with smaller bets to understand the Win2Win's patterns. Many legendary seers began their journey with careful observation and patience. 
            Remember, even the greatest prophets had to learn to read the signs!
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default HowToPlaySection;
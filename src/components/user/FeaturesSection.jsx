import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent } from '@mui/material';
import { Zap, Shield, Trophy, Users, Target, Coins } from 'lucide-react';

const features = [
  {
    icon: <Zap size={40} />,
    title: 'Lightning Fast Predictions',
    description: 'Make split-second color predictions with our ultra-responsive interface designed for competitive gaming.',
    color: '#D4AF37',
  },
  {
    icon: <Shield size={40} />,
    title: 'Secure & Fair Gaming',
    description: 'Advanced cryptographic algorithms ensure every game is provably fair and your winnings are secure.',
    color: '#00C897',
  },
  {
    icon: <Trophy size={40} />,
    title: 'Epic Rewards System',
    description: 'Climb the ranks and unlock legendary rewards, titles, and exclusive access to premium tournaments.',
    color: '#6A0DAD',
  },
  {
    icon: <Users size={40} />,
    title: 'Multiplayer Tournaments',
    description: 'Battle against color seers from around the world in real-time multiplayer prediction tournaments.',
    color: '#FF4C4C',
  },
  {
    icon: <Target size={40} />,
    title: 'Precision Analytics',
    description: 'Track your prediction accuracy, win streaks, and strategic patterns with detailed performance analytics.',
    color: '#D4AF37',
  },
  {
    icon: <Coins size={40} />,
    title: 'Instant Payouts',
    description: 'Withdraw your winnings instantly with multiple payment options and zero hidden fees.',
    color: '#00C897',
  },
];

const FeaturesSection = () => {
  return (
    <Box sx={{ py: 8, backgroundColor: "#0F0F0F" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography variant="h2" sx={{ mb: 2 }}>
            Legendary Game Features
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontSize: "1.2rem", maxWidth: 600, mx: "auto" }}
          >
            Discover the magical abilities that make Win2Win the ultimate color
            prediction experience
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  cursor: "pointer",
                  "&:hover": {
                    "& .feature-icon": {
                      color: feature.color,
                      transform: "scale(1.1)",
                    },
                  },
                }}
              >
                <CardContent sx={{ p: 4, textAlign: "center" }}>
                  <Box
                    className="feature-icon"
                    sx={{
                      color: "#CCCCCC",
                      mb: 3,
                      transition: "all 0.3s ease",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h4" sx={{ mb: 2, fontSize: "1.3rem" }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#CCCCCC" }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
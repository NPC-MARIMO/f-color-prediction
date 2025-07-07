import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, Avatar, LinearProgress } from '@mui/material';
import { Crown, Medal, Star, TrendingUp } from 'lucide-react';

const leaderboard = [
  { rank: 1, name: 'ChromaMage', wins: 2847, accuracy: 94, avatar: '🧙‍♂️' },
  { rank: 2, name: 'ColorKnight', wins: 2634, accuracy: 92, avatar: '⚔️' },
  { rank: 3, name: 'PrismSeer', wins: 2451, accuracy: 89, avatar: '🔮' },
  { rank: 4, name: 'SpectrumSage', wins: 2298, accuracy: 87, avatar: '🌟' },
  { rank: 5, name: 'HueHunter', wins: 2156, accuracy: 85, avatar: '🏹' },
];

const stats = [
  { title: 'Total Games Played', value: '2.4M+', icon: <TrendingUp size={32} />, color: '#D4AF37' },
  { title: 'Active Players', value: '47K+', icon: <Star size={32} />, color: '#6A0DAD' },
  { title: 'Prizes Won Today', value: '₹2.4M', icon: <Medal size={32} />, color: '#00C897' },
  { title: 'Legendary Seers', value: '1,247', icon: <Crown size={32} />, color: '#FF4C4C' },
];

const StatsSection = () => {
  return (
    <Box sx={{ py: 8, backgroundColor: '#0F0F0F' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" sx={{ mb: 2 }}>
            Hall of Legends
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.2rem', maxWidth: 600, mx: 'auto' }}>
            Witness the achievements of the most skilled color seers in the realm
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Box sx={{ color: stat.color, mb: 2, display: 'flex', justifyContent: 'center' }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h3" sx={{ mb: 1, color: stat.color }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#CCCCCC' }}>
                    {stat.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Card sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
            🏆 Top Color Seers This Month
          </Typography>
          
          <Grid container spacing={3}>
            {leaderboard.map((player, index) => (
              <Grid item xs={12} key={index}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: index < 3 ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                    border: index < 3 ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 80 }}>
                    <Typography variant="h4" sx={{ mr: 2, color: index < 3 ? '#D4AF37' : '#CCCCCC' }}>
                      #{player.rank}
                    </Typography>
                    <Avatar sx={{ backgroundColor: 'transparent', fontSize: '1.5rem' }}>
                      {player.avatar}
                    </Avatar>
                  </Box>
                  
                  <Box sx={{ flexGrow: 1, ml: 3 }}>
                    <Typography variant="h6" sx={{ color: '#FFFFFF' }}>
                      {player.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Typography variant="body2" sx={{ color: '#CCCCCC', mr: 2 }}>
                        {player.wins} wins
                      </Typography>
                      <Box sx={{ flexGrow: 1, maxWidth: 200 }}>
                        <LinearProgress
                          variant="determinate"
                          value={player.accuracy}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: index < 3 ? '#D4AF37' : '#6A0DAD',
                              borderRadius: 4,
                            },
                          }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#D4AF37', ml: 2, fontWeight: 600 }}>
                        {player.accuracy}%
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Card>
      </Container>
    </Box>
  );
};

export default StatsSection;
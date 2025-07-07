import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { theme } from '../../theme';
import HeroSection from '../../components/user/HeroSection';
import Navigation from '../../components/user/Navigation';
import FeaturesSection from '../../components/user/FeaturesSection';
import HowToPlaySection from '../../components/user/HowToPlaySection';
import TestimonialsSection from '../../components/user/TestimonialsSection';
import StatsSection from '../../components/user/StatsSection';
import CTASection from '../../components/user/CTASection';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <HowToPlaySection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
    </ThemeProvider>
  );
}

export default App;
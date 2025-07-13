import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#D4AF37', // Primary Accent
      light: '#E6C866',
      dark: '#B8941F',
      contrastText: '#0F0F0F',
    },
    secondary: {
      main: '#6A0DAD', // Secondary Accent
      light: '#8A2BE2',
      dark: '#4A0A7A',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#0F0F0F', // Background
      paper: '#1A1A1A',
      gradient: 'linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 100%)',
    },
    text: {
      primary: '#FFFFFF', // Text Primary
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
    success: {
      main: '#00C897', // Success (Win)
      light: '#00E6B3',
      dark: '#009A7A',
    },
    error: {
      main: '#FF4C4C', // Danger (Loss)
      light: '#FF6B6B',
      dark: '#CC3D3D',
    },
    warning: {
      main: '#FFA726',
    },
    info: {
      main: '#29B6F6',
    },
    divider: 'rgba(212, 175, 55, 0.2)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(26, 26, 26, 0.85) 100%)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(212, 175, 55, 0.4)',
          boxShadow: '0 8px 40px rgba(212, 175, 55, 0.2)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '12px 24px',
          fontWeight: 600,
          textTransform: 'none',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #D4AF37 0%, #E6C866 100%)',
          color: '#0F0F0F',
          '&:hover': {
            background: 'linear-gradient(135deg, #E6C866 0%, #D4AF37 100%)',
          },
        },
        outlined: {
          borderColor: 'rgba(212, 175, 55, 0.5)',
          color: '#D4AF37',
          '&:hover': {
            borderColor: '#D4AF37',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            color: '#FFFFFF',
            '& fieldset': {
              borderColor: 'rgba(212, 175, 55, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(212, 175, 55, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#D4AF37',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#D4AF37',
            },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&.MuiAlert-standardSuccess': {
            backgroundColor: 'rgba(0, 200, 151, 0.1)',
            color: '#00C897',
            border: '1px solid rgba(0, 200, 151, 0.3)',
          },
          '&.MuiAlert-standardError': {
            backgroundColor: 'rgba(255, 76, 76, 0.1)',
            color: '#FF4C4C',
            border: '1px solid rgba(255, 76, 76, 0.3)',
          },
        },
      },
    },
  },
});

// Game-specific colors
export const gameColors = {
  red: '#FF4C4C',
  green: '#00C897',
  blue: '#29B6F6',
  yellow: '#FFA726',
  purple: '#6A0DAD',
  orange: '#FF7043',
};

// Gradient backgrounds
export const gradients = {
  primary: 'linear-gradient(135deg, #D4AF37 0%, #E6C866 100%)',
  secondary: 'linear-gradient(135deg, #6A0DAD 0%, #8A2BE2 100%)',
  background: 'linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 100%)',
  card: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(26, 26, 26, 0.85) 100%)',
  success: 'linear-gradient(135deg, #00C897 0%, #00E6B3 100%)',
  error: 'linear-gradient(135deg, #FF4C4C 0%, #FF6B6B 100%)',
};

// Animation keyframes
export const animations = {
  pulse: {
    '@keyframes pulse': {
      '0%, 100%': {
        opacity: 1,
      },
      '50%': {
        opacity: 0.5,
      },
    },
  },
  bounce: {
    '@keyframes bounce': {
      '0%, 20%, 53%, 80%, 100%': {
        transform: 'translate3d(0,0,0)',
      },
      '40%, 43%': {
        transform: 'translate3d(0, -30px, 0)',
      },
      '70%': {
        transform: 'translate3d(0, -15px, 0)',
      },
      '90%': {
        transform: 'translate3d(0, -4px, 0)',
      },
    },
  },
  shimmer: {
    '@keyframes shimmer': {
      '0%': {
        backgroundPosition: '-200px 0',
      },
      '100%': {
        backgroundPosition: 'calc(200px + 100%) 0',
      },
    },
  },
};

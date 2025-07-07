import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0F0F0F",
      paper: "#1A1A1A",
    },
    primary: {
      main: "#D4AF37",
      light: "#E8C968",
      dark: "#B8941F",
    },
    secondary: {
      main: "#6A0DAD",
      light: "#8B3FBF",
      dark: "#4A0979",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#CCCCCC",
    },
    success: {
      main: "#00C897",
      light: "#33D4A8",
      dark: "#008F6B",
    },
    error: {
      main: "#FF4C4C",
      light: "#FF7A7A",
      dark: "#E03535",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "3.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
      background: "linear-gradient(45deg, #D4AF37, #6A0DAD)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    h2: {
      fontSize: "2.5rem",
      fontWeight: 600,
      color: "#D4AF37",
    },
    h3: {
      fontSize: "2rem",
      fontWeight: 600,
      color: "#FFFFFF",
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 500,
      color: "#D4AF37",
    },
    body1: {
      fontSize: "1.1rem",
      lineHeight: 1.6,
      color: "#CCCCCC",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 12,
          padding: "12px 32px",
          fontSize: "1.1rem",
          fontWeight: 600,
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 25px rgba(212, 175, 55, 0.3)",
          },
        },
        contained: {
          background: "linear-gradient(135deg, #D4AF37, #B8941F)",
          color: "#0F0F0F",
          "&:hover": {
            background: "linear-gradient(135deg, #E8C968, #D4AF37)",
          },
        },
        outlined: {
          borderColor: "#D4AF37",
          color: "#D4AF37",
          "&:hover": {
            borderColor: "#E8C968",
            backgroundColor: "rgba(212, 175, 55, 0.1)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#1A1A1A",
          borderRadius: 16,
          border: "1px solid rgba(212, 175, 55, 0.2)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            borderColor: "rgba(212, 175, 55, 0.4)",
            boxShadow: "0 12px 40px rgba(212, 175, 55, 0.15)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            "& fieldset": {
              borderColor: "rgba(212, 175, 55, 0.3)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(212, 175, 55, 0.5)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#D4AF37",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#CCCCCC",
            "&.Mui-focused": {
              color: "#D4AF37",
            },
          },
        },
      },
    },
  },
});

import React from "react";
import { Box, Container, Typography } from "@mui/material";
import { Swords } from "lucide-react";
import { Outlet } from "react-router-dom";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0F0F0F 0%, #1A0E2E 50%, #0F0F0F 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(106, 13, 173, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(212, 175, 55, 0.05) 0%, transparent 50%)",
          pointerEvents: "none",
        },
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          py: 4,
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            mb: 4,
            position: "relative",
            zIndex: 1,
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
              p: 2,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #D4AF37, #6A0DAD)",
              boxShadow: "0 0 30px rgba(212, 175, 55, 0.4)",
            }}
          >
            <Swords size={48} color="#0F0F0F" />
          </Box>

          <Typography variant="h1" component="h1" sx={{ mb: 2 }}>
            {title}
          </Typography>

          {subtitle && (
            <Typography variant="body1" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Outlet />
        </Box>
      </Container>
    </Box>
  );
};

export default AuthLayout;
  
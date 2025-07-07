import React from "react";
import { Box, Typography, Container, Grid, Link, Divider } from "@mui/material";
import { Zap, Mail, MessageCircle, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box sx={{ backgroundColor: "#0F0F0F", pt: 6, pb: 3 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Zap size={28} color="#D4AF37" />
              <Typography
                variant="h6"
                sx={{ ml: 1, fontWeight: 700, color: "#D4AF37" }}
              >
                ChromaQuest
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{ color: "#CCCCCC", mb: 3, maxWidth: 300 }}
            >
              The ultimate color prediction gaming experience. Join thousands of
              seers in the mystical world of color prophecy and claim your
              legendary status.
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: 1,
                  backgroundColor: "rgba(212, 175, 55, 0.1)",
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "rgba(212, 175, 55, 0.2)" },
                }}
              >
                <Twitter size={20} color="#D4AF37" />
              </Box>
              <Box
                sx={{
                  p: 1,
                  borderRadius: 1,
                  backgroundColor: "rgba(212, 175, 55, 0.1)",
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "rgba(212, 175, 55, 0.2)" },
                }}
              >
                <Instagram size={20} color="#D4AF37" />
              </Box>
              <Box
                sx={{
                  p: 1,
                  borderRadius: 1,
                  backgroundColor: "rgba(212, 175, 55, 0.1)",
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "rgba(212, 175, 55, 0.2)" },
                }}
              >
                <MessageCircle size={20} color="#D4AF37" />
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ color: "#D4AF37", mb: 2 }}>
              Game
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link
                href="#"
                sx={{
                  color: "#CCCCCC",
                  textDecoration: "none",
                  "&:hover": { color: "#D4AF37" },
                }}
              >
                How to Play
              </Link>
              <Link
                href="#"
                sx={{
                  color: "#CCCCCC",
                  textDecoration: "none",
                  "&:hover": { color: "#D4AF37" },
                }}
              >
                Tournament Rules
              </Link>
              <Link
                href="#"
                sx={{
                  color: "#CCCCCC",
                  textDecoration: "none",
                  "&:hover": { color: "#D4AF37" },
                }}
              >
                Leaderboard
              </Link>
              <Link
                href="#"
                sx={{
                  color: "#CCCCCC",
                  textDecoration: "none",
                  "&:hover": { color: "#D4AF37" },
                }}
              >
                Fair Play
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ color: "#D4AF37", mb: 2 }}>
              Support
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link
                href="#"
                sx={{
                  color: "#CCCCCC",
                  textDecoration: "none",
                  "&:hover": { color: "#D4AF37" },
                }}
              >
                Help Center
              </Link>
              <Link
                href="#"
                sx={{
                  color: "#CCCCCC",
                  textDecoration: "none",
                  "&:hover": { color: "#D4AF37" },
                }}
              >
                Contact Us
              </Link>
              <Link
                href="#"
                sx={{
                  color: "#CCCCCC",
                  textDecoration: "none",
                  "&:hover": { color: "#D4AF37" },
                }}
              >
                Live Chat
              </Link>
              <Link
                href="#"
                sx={{
                  color: "#CCCCCC",
                  textDecoration: "none",
                  "&:hover": { color: "#D4AF37" },
                }}
              >
                Bug Reports
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ color: "#D4AF37", mb: 2 }}>
              Legal
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link
                href="#"
                sx={{
                  color: "#CCCCCC",
                  textDecoration: "none",
                  "&:hover": { color: "#D4AF37" },
                }}
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                sx={{
                  color: "#CCCCCC",
                  textDecoration: "none",
                  "&:hover": { color: "#D4AF37" },
                }}
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                sx={{
                  color: "#CCCCCC",
                  textDecoration: "none",
                  "&:hover": { color: "#D4AF37" },
                }}
              >
                Responsible Gaming
              </Link>
              <Link
                href="#"
                sx={{
                  color: "#CCCCCC",
                  textDecoration: "none",
                  "&:hover": { color: "#D4AF37" },
                }}
              >
                Age Verification
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ color: "#D4AF37", mb: 2 }}>
              Community
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link
                href="#"
                sx={{
                  color: "#CCCCCC",
                  textDecoration: "none",
                  "&:hover": { color: "#D4AF37" },
                }}
              >
                Discord Server
              </Link>
              <Link
                href="#"
                sx={{
                  color: "#CCCCCC",
                  textDecoration: "none",
                  "&:hover": { color: "#D4AF37" },
                }}
              >
                Reddit Community
              </Link>
              <Link
                href="#"
                sx={{
                  color: "#CCCCCC",
                  textDecoration: "none",
                  "&:hover": { color: "#D4AF37" },
                }}
              >
                Strategy Guides
              </Link>
              <Link
                href="#"
                sx={{
                  color: "#CCCCCC",
                  textDecoration: "none",
                  "&:hover": { color: "#D4AF37" },
                }}
              >
                Seer Academy
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: "rgba(212, 175, 55, 0.2)" }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: "#CCCCCC" }}>
            © {currentYear} ChromaQuest. All rights reserved. Powered by
            mystical forces and advanced cryptography.
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2" sx={{ color: "#CCCCCC" }}>
              🔮 Certified Fair Play
            </Typography>
            <Typography variant="body2" sx={{ color: "#CCCCCC" }}>
              🛡️ Secure Gaming
            </Typography>
            <Typography variant="body2" sx={{ color: "#CCCCCC" }}>
              🏆 18+ Only
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

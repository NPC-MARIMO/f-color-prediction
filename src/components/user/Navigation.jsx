import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Menu, X, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Navigation = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = ["Features", "How to Play", "Leaderboard", "Reviews"];

  const drawer = (
    <Box sx={{ backgroundColor: "#0F0F0F", height: "100%", pt: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", pr: 2, pb: 2 }}>
        <IconButton onClick={handleDrawerToggle}>
          <X color="#D4AF37" />
        </IconButton>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item} sx={{ color: "#FFFFFF" }}>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ px: 2, mt: 2 }}>
        <Button variant="contained" fullWidth sx={{ mb: 1 }}>
          Play Now
        </Button>
        <Link
          to="/auth/login"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          <Button variant="outlined" fullWidth>
            Sign In
          </Button>
        </Link>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "rgba(15, 15, 15, 0.95)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Zap size={28} color="#D4AF37" />
            <Typography
              variant="h6"
              sx={{ ml: 1, fontWeight: 700, color: "#D4AF37" }}
            >
              ChromaQuest
            </Typography>
          </Box>

          {!isMobile ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              {menuItems.map((item) => (
                <Button key={item} color="inherit" sx={{ color: "#FFFFFF" }}>
                  {item}
                </Button>
              ))}
              <Link to="/auth/login" style={{ textDecoration: "none" }}>
                <Button variant="outlined" sx={{ ml: 2 }}>
                  Sign In
                </Button>
              </Link>
              <Button variant="contained">Play Now</Button>
            </Box>
          ) : (
            <IconButton color="inherit" onClick={handleDrawerToggle}>
              <Menu color="#D4AF37" />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        PaperProps={{ sx: { width: 250 } }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navigation;

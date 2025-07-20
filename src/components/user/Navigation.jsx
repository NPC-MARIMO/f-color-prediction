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
  Avatar,
} from "@mui/material";
import { Menu, X, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Navigation = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const {user} = useSelector((state) => state.auth.user || state.auth );

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
        {!isAuthenticated ? (
          <>
            <Link
              to="/auth/login"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <Button variant="outlined" fullWidth sx={{ mb: 1 }}>
                Sign In
              </Button>
            </Link>
            <Link
              to="/auth/register"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <Button variant="contained" fullWidth>
                Sign Up
              </Button>
            </Link>
          </>
        ) : (   
          <>
            <Link to="/user/game" style={{ textDecoration: "none" }}>
              <Button variant="contained" fullWidth>
                Play Now
              </Button>
            </Link>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Link to="/user/profile" style={{ textDecoration: "none" }}>
                <Avatar sx={{ bgcolor: "#D4AF37", color: "#0F0F0F" }}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </Avatar>
              </Link>
            </Box>
          </>
        )}
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
          boxShadow: "none",
        }}
      >
        <Toolbar>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Zap size={28} color="#D4AF37" />
            <Typography
              variant="h6"
              sx={{ ml: 1, fontWeight: 700, color: "#D4AF37" }}
            >
              Win2Win
            </Typography>
          </Box>

          {/* Desktop Menu */}
          {!isMobile ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              {menuItems.map((item) => (
                <Button key={item} sx={{ color: "#FFFFFF" }}>
                  {item}
                </Button>
              ))}

              {/* Auth Buttons */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {!isAuthenticated ? (
                  <>
                    <Link to="/auth/login" style={{ textDecoration: "none" }}>
                      <Button variant="outlined">Sign In</Button>
                    </Link>
                    <Link
                      to="/auth/register"
                      style={{ textDecoration: "none" }}
                    >
                      <Button variant="contained">Sign Up</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/user/game" style={{ textDecoration: "none" }}>
                      <Button variant="contained">Play Now</Button>
                    </Link>
                    <Link to="/user/profile" style={{ textDecoration: "none" }}>
                      <Avatar sx={{ bgcolor: "#D4AF37", color: "#0F0F0F", ml: 2 }}>
                        {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
                      </Avatar>
                    </Link>
                  </>
                )}
              </Box>
            </Box>
          ) : (
            // Mobile Menu Icon
            <IconButton color="inherit" onClick={handleDrawerToggle}>
              <Menu color="#D4AF37" />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer for Mobile */}
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

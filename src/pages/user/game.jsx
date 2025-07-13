import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";
import { useNavigate } from "react-router-dom";

const GAMES = [
  {
    id: "color-prediction",
    name: "Color Prediction",
    description:
      "Predict the mystical color and win big! Place your bets before the timer runs out. The game continues round after round, just like Aviator. Spectate or play as you wish.",
    icon: <PaletteIcon sx={{ fontSize: 48, color: "#D4AF37", mr: 2 }} />,
    background: "linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 100%)",
  },
  // Future games can be added here
];

const DEFAULT_BET_AMOUNT = 100;

const GameList = () => {
  const navigate = useNavigate();

  const handlePlayClick = (game) => {
    navigate(`/user/game/play/${game.id}`, { state: { betAmount: DEFAULT_BET_AMOUNT } });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
      <Typography
        variant="h4"
        align="center"
        sx={{ mb: 4, fontWeight: 700, color: "#D4AF37" }}
      >
        Choose Your Game
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {GAMES.map((game) => (
          <Grid item xs={12} sm={8} md={6} key={game.id}>
            <Card
              sx={{
                p: 3,
                borderRadius: 4,
                boxShadow: 6,
                background: game.background,
                color: "#fff",
                cursor: "pointer",
                transition: "transform 0.2s",
                '&:hover': { transform: 'scale(1.03)', boxShadow: 12 },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                {game.icon}
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {game.name}
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {game.description}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => handlePlayClick(game)}
                sx={{ mt: 1, fontWeight: 600, borderRadius: 2 }}
              >
                Play
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default GameList;

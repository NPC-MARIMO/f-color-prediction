import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import { Casino, Refresh, Save } from '@mui/icons-material';
import apiService from '../../services/apiService';

const COLORS = {
  background: "#0F0F0F",
  primary: "#D4AF37",
  text: "#FFFFFF",
  red: "#E11D48",
  green: "#10B981",
  blue: "#3B82F6",
  fadedText: "#AAAAAA",
  card: "#1A1A1A",
};

const GameSettings = () => {
  const [settings, setSettings] = useState({
    gameDuration: '',
    bettingDuration: '',
    commission: '',
    minBetAmount: '',
    maxBetAmount: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await apiService.getGameSettings();
      setSettings(response.settings || response);
    } catch (err) {
      setError('Failed to load game settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await apiService.updateGameSettings({
        ...settings,
        gameDuration: Number(settings.gameDuration),
        bettingDuration: Number(settings.bettingDuration),
        commission: Number(settings.commission),
        minBetAmount: Number(settings.minBetAmount),
        maxBetAmount: Number(settings.maxBetAmount),
      });
      setSuccess('Game settings updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ backgroundColor: COLORS.background, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ color: COLORS.primary }} />
        <Typography sx={{ color: COLORS.text, ml: 2 }}>Loading game settings...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: COLORS.background, minHeight: '100vh', color: COLORS.text, p: 3 }}>
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        <Paper sx={{ backgroundColor: COLORS.card, p: 4, border: `1px solid ${COLORS.primary}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Casino sx={{ color: COLORS.primary, mr: 1 }} />
            <Typography variant="h5" sx={{ color: COLORS.primary, fontWeight: 'bold' }}>
              Game Settings
            </Typography>
            <Button onClick={loadSettings} sx={{ ml: 'auto', color: COLORS.primary }} startIcon={<Refresh />}>
              Refresh
            </Button>
          </Box>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <form onSubmit={handleSave}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Game Duration (sec)"
                  name="gameDuration"
                  value={settings.gameDuration}
                  onChange={handleChange}
                  type="number"
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                  InputProps={{ style: { color: COLORS.text, background: '#222' } }}
                  InputLabelProps={{ style: { color: COLORS.primary } }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Betting Duration (sec)"
                  name="bettingDuration"
                  value={settings.bettingDuration}
                  onChange={handleChange}
                  type="number"
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                  InputProps={{ style: { color: COLORS.text, background: '#222' } }}
                  InputLabelProps={{ style: { color: COLORS.primary } }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Commission (%)"
                  name="commission"
                  value={settings.commission}
                  onChange={handleChange}
                  type="number"
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                  InputProps={{ style: { color: COLORS.text, background: '#222' } }}
                  InputLabelProps={{ style: { color: COLORS.primary } }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Min Bet Amount"
                  name="minBetAmount"
                  value={settings.minBetAmount}
                  onChange={handleChange}
                  type="number"
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                  InputProps={{ style: { color: COLORS.text, background: '#222' } }}
                  InputLabelProps={{ style: { color: COLORS.primary } }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Max Bet Amount"
                  name="maxBetAmount"
                  value={settings.maxBetAmount}
                  onChange={handleChange}
                  type="number"
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                  InputProps={{ style: { color: COLORS.text, background: '#222' } }}
                  InputLabelProps={{ style: { color: COLORS.primary } }}
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: COLORS.primary, color: '#222', fontWeight: 'bold', mt: 2 }}
              startIcon={<Save />}
              disabled={saving}
              fullWidth
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default GameSettings;

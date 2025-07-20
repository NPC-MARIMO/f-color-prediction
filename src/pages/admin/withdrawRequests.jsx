import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { TrendingDown, CheckCircle, Cancel, Refresh } from '@mui/icons-material';
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

const WithdrawRequests = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [notes, setNotes] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    loadWithdrawals();
  }, []);

  const loadWithdrawals = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPendingWithdrawals();
      setWithdrawals(response.withdrawals || response.requests || []);
    } catch (err) {
      setError('Failed to load withdrawal requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await apiService.approveWithdrawal(selectedWithdrawal._id, notes);
      setSuccess('Withdrawal approved successfully!');
      setShowApproveDialog(false);
      setNotes('');
      loadWithdrawals();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve withdrawal');
    }
  };

  const handleReject = async () => {
    try {
      await apiService.rejectWithdrawal(selectedWithdrawal._id, reason);
      setSuccess('Withdrawal rejected successfully!');
      setShowRejectDialog(false);
      setReason('');
      loadWithdrawals();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject withdrawal');
    }
  };

  const formatCurrency = (amount) => `₹${amount?.toLocaleString() || "0"}`;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Box sx={{ backgroundColor: COLORS.background, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ color: COLORS.primary }} />
        <Typography sx={{ color: COLORS.text, ml: 2 }}>Loading withdrawal requests...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: COLORS.background, minHeight: '100vh', color: COLORS.text, p: 3 }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Paper sx={{ backgroundColor: COLORS.card, p: 4, border: `1px solid ${COLORS.primary}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <TrendingDown sx={{ color: COLORS.primary, mr: 1 }} />
            <Typography variant="h5" sx={{ color: COLORS.primary, fontWeight: 'bold' }}>
              Pending Withdrawal Requests
            </Typography>
            <Button onClick={loadWithdrawals} sx={{ ml: 'auto', color: COLORS.primary }} startIcon={<Refresh />}>
              Refresh
            </Button>
          </Box>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: COLORS.primary }}>User</TableCell>
                  <TableCell sx={{ color: COLORS.primary }}>Amount</TableCell>
                  <TableCell sx={{ color: COLORS.primary }}>Status</TableCell>
                  <TableCell sx={{ color: COLORS.primary }}>Requested At</TableCell>
                  <TableCell sx={{ color: COLORS.primary }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {withdrawals.map((w) => (
                  <TableRow key={w._id}>
                    <TableCell sx={{ color: COLORS.text }}>{w.user?.email || w.user?.name || 'N/A'}</TableCell>
                    <TableCell sx={{ color: COLORS.green, fontWeight: 'bold' }}>{formatCurrency(w.amount)}</TableCell>
                    <TableCell>
                      <Chip label={w.status} sx={{ backgroundColor: COLORS.primary, color: '#222' }} size="small" />
                    </TableCell>
                    <TableCell sx={{ color: COLORS.fadedText }}>{formatDate(w.createdAt)}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        sx={{ mr: 1, backgroundColor: COLORS.green, color: '#fff' }}
                        onClick={() => {
                          setSelectedWithdrawal(w);
                          setShowApproveDialog(true);
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        sx={{ borderColor: COLORS.red, color: COLORS.red }}
                        onClick={() => {
                          setSelectedWithdrawal(w);
                          setShowRejectDialog(true);
                        }}
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Approve Dialog */}
        <Dialog open={showApproveDialog} onClose={() => setShowApproveDialog(false)}>
          <DialogTitle>Approve Withdrawal</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>Add notes for approval (optional):</Typography>
            <TextField
              fullWidth
              label="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              multiline
              rows={3}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowApproveDialog(false)} color="inherit">Cancel</Button>
            <Button onClick={handleApprove} color="success" variant="contained">Approve</Button>
          </DialogActions>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={showRejectDialog} onClose={() => setShowRejectDialog(false)}>
          <DialogTitle>Reject Withdrawal</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>Reason for rejection:</Typography>
            <TextField
              fullWidth
              label="Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              multiline
              rows={3}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowRejectDialog(false)} color="inherit">Cancel</Button>
            <Button onClick={handleReject} color="error" variant="contained">Reject</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default WithdrawRequests;

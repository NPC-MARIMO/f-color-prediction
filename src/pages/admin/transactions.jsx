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
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
} from '@mui/material';
import { MonetizationOn, Refresh, Visibility } from '@mui/icons-material';
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

const TRANSACTION_TYPES = [
  { value: '', label: 'All' },
  { value: 'deposit', label: 'Deposit' },
  { value: 'withdrawal', label: 'Withdrawal' },
  { value: 'win', label: 'Win' },
  { value: 'loss', label: 'Loss' },
];
const TRANSACTION_STATUSES = [
  { value: '', label: 'All' },
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
];

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadTransactions();
    loadStats();
  }, [page, type, status]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAdminTransactions(page, limit, type, status);
      setTransactions(response.transactions || []);
      setTotalPages(Math.ceil((response.total || 0) / limit));
    } catch (err) {
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await apiService.getTransactionStatsByPeriod(30);
      setStats(response.stats || response);
    } catch (err) {
      // ignore
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

  if (loading && transactions.length === 0) {
    return (
      <Box sx={{ backgroundColor: COLORS.background, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ color: COLORS.primary }} />
        <Typography sx={{ color: COLORS.text, ml: 2 }}>Loading transactions...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: COLORS.background, minHeight: '100vh', color: COLORS.text, p: 3 }}>
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ color: COLORS.primary, fontWeight: 'bold' }}>
            Transactions
          </Typography>
          <Button variant="outlined" startIcon={<Refresh />} onClick={loadTransactions} sx={{ color: COLORS.primary, borderColor: COLORS.primary }}>
            Refresh
          </Button>
        </Box>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {/* Stats */}
        {stats && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ backgroundColor: COLORS.card, p: 2, border: `1px solid ${COLORS.primary}` }}>
                <Typography variant="subtitle2" sx={{ color: COLORS.primary }}>Total Transactions</Typography>
                <Typography variant="h6" sx={{ color: COLORS.text }}>{stats.totalTransactions || 0}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ backgroundColor: COLORS.card, p: 2, border: `1px solid ${COLORS.green}` }}>
                <Typography variant="subtitle2" sx={{ color: COLORS.green }}>Total Volume</Typography>
                <Typography variant="h6" sx={{ color: COLORS.text }}>{formatCurrency(stats.totalVolume)}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ backgroundColor: COLORS.card, p: 2, border: `1px solid ${COLORS.blue}` }}>
                <Typography variant="subtitle2" sx={{ color: COLORS.blue }}>Deposits</Typography>
                <Typography variant="h6" sx={{ color: COLORS.text }}>{formatCurrency(stats.totalDeposits)}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ backgroundColor: COLORS.card, p: 2, border: `1px solid ${COLORS.red}` }}>
                <Typography variant="subtitle2" sx={{ color: COLORS.red }}>Withdrawals</Typography>
                <Typography variant="h6" sx={{ color: COLORS.text }}>{formatCurrency(stats.totalWithdrawals)}</Typography>
              </Paper>
            </Grid>
          </Grid>
        )}
        {/* Filters */}
        <Paper sx={{ backgroundColor: COLORS.card, p: 3, mb: 3, border: `1px solid ${COLORS.primary}` }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: COLORS.primary }}>Type</InputLabel>
                <Select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  sx={{ color: COLORS.text, '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary } }}
                >
                  {TRANSACTION_TYPES.map((t) => (
                    <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: COLORS.primary }}>Status</InputLabel>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  sx={{ color: COLORS.text, '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.primary } }}
                >
                  {TRANSACTION_STATUSES.map((s) => (
                    <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
        {/* Transactions Table */}
        <Paper sx={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.primary}` }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: COLORS.primary }}>Type</TableCell>
                  <TableCell sx={{ color: COLORS.primary }}>Amount</TableCell>
                  <TableCell sx={{ color: COLORS.primary }}>Status</TableCell>
                  <TableCell sx={{ color: COLORS.primary }}>User</TableCell>
                  <TableCell sx={{ color: COLORS.primary }}>Date</TableCell>
                  <TableCell sx={{ color: COLORS.primary }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((t) => (
                  <TableRow key={t._id}>
                    <TableCell>{t.type}</TableCell>
                    <TableCell>{formatCurrency(t.amount)}</TableCell>
                    <TableCell>
                      <Chip label={t.status} sx={{ backgroundColor: t.status === 'completed' ? COLORS.green : t.status === 'pending' ? COLORS.primary : COLORS.red, color: '#fff' }} size="small" />
                    </TableCell>
                    <TableCell>{t.user?.email || t.user?.name || 'N/A'}</TableCell>
                    <TableCell>{formatDate(t.createdAt)}</TableCell>
                    <TableCell>
                      <IconButton size="small" sx={{ color: COLORS.primary }} onClick={() => { setSelectedTransaction(t); setShowDetails(true); }}>
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, newPage) => setPage(newPage)}
              sx={{
                '& .MuiPaginationItem-root': { color: COLORS.text },
                '& .Mui-selected': { backgroundColor: COLORS.primary, color: '#222' },
              }}
            />
          </Box>
        </Paper>
        {/* Transaction Details Dialog */}
        <Dialog open={showDetails} onClose={() => setShowDetails(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ color: COLORS.primary, fontWeight: 'bold' }}>Transaction Details</DialogTitle>
          <DialogContent>
            {selectedTransaction && (
              <Box>
                <Typography sx={{ mb: 1 }}><b>Type:</b> {selectedTransaction.type}</Typography>
                <Typography sx={{ mb: 1 }}><b>Amount:</b> {formatCurrency(selectedTransaction.amount)}</Typography>
                <Typography sx={{ mb: 1 }}><b>Status:</b> {selectedTransaction.status}</Typography>
                <Typography sx={{ mb: 1 }}><b>User:</b> {selectedTransaction.user?.email || selectedTransaction.user?.name || 'N/A'}</Typography>
                <Typography sx={{ mb: 1 }}><b>Date:</b> {formatDate(selectedTransaction.createdAt)}</Typography>
                <Typography sx={{ mb: 1 }}><b>Description:</b> {selectedTransaction.description || '-'}</Typography>
                {/* Add more details as needed */}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDetails(false)} sx={{ color: COLORS.primary }}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AdminTransactions; 
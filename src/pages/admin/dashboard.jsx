import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
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
  Tooltip,
} from '@mui/material';
import {
  People,
  MonetizationOn,
  TrendingUp,
  TrendingDown,
  Casino,
  AccountBalance,
  Refresh,
  Visibility,
  CheckCircle,
  Cancel,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { logout } from '../../store/features/auth/authSlice';
import { useDispatch } from 'react-redux';

// You must import your apiService for the dashboard to work
import apiService from '../../services/apiService'; // <-- Make sure this path is correct

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

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await apiService.getAdminDashboard();
        console.log(response);
        
        // Support both { data: ... } and direct object
        setDashboard(response?.data?.dashboard);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
          err?.message ||
          'Failed to load dashboard data'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

  const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return "₹0";
    return `₹${amount.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return COLORS.green;
      case "pending":
        return COLORS.primary;
      case "failed":
        return COLORS.red;
      default:
        return COLORS.fadedText;
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case "deposit":
        return <TrendingUp sx={{ color: COLORS.green }} />;
      case "withdrawal":
        return <TrendingDown sx={{ color: COLORS.red }} />;
      case "win":
        return <CheckCircle sx={{ color: COLORS.green }} />;
      case "loss":
        return <Cancel sx={{ color: COLORS.red }} />;
      default:
        return <MonetizationOn sx={{ color: COLORS.primary }} />;
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          backgroundColor: COLORS.background,
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress sx={{ color: COLORS.primary }} />
        <Typography sx={{ color: COLORS.text }}>
          Loading dashboard...
        </Typography>
      </Box>
    );
  }

  // Defensive: fallback to [] if not loaded
  const recentUsers = Array.isArray(dashboard?.recent?.users) ? dashboard.recent.users : [];
  const recentTransactions = Array.isArray(dashboard?.recent?.transactions) ? dashboard.recent.transactions : [];

  return (
    <Box
      sx={{
        backgroundColor: COLORS.background,
        minHeight: "100vh",
        color: COLORS.text,
        p: 3,
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: "auto" }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" sx={{ color: COLORS.primary, fontWeight: "bold" }}>
            Admin Dashboard
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => window.location.reload()}
              sx={{ color: COLORS.primary, borderColor: COLORS.primary }}
            >
              Refresh
            </Button>
            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ color: COLORS.red, borderColor: COLORS.red }}
            >
              Logout
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.primary}` }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <People sx={{ color: COLORS.primary, mr: 1 }} />
                  <Typography variant="h6" sx={{ color: COLORS.primary }}>
                    Total Users
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: COLORS.text, fontWeight: "bold" }}>
                  {recentUsers.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.green}` }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <MonetizationOn sx={{ color: COLORS.green, mr: 1 }} />
                  <Typography variant="h6" sx={{ color: COLORS.green }}>
                    Today's Revenue
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: COLORS.text, fontWeight: "bold" }}>
                  {formatCurrency(dashboard?.today?.revenue)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.blue}` }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <AccountBalance sx={{ color: COLORS.blue, mr: 1 }} />
                  <Typography variant="h6" sx={{ color: COLORS.blue }}>
                    Today's Transactions
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: COLORS.text, fontWeight: "bold" }}>
                  {typeof dashboard?.today?.transactions === 'number'
                    ? dashboard.today.transactions
                    : 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.red}` }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <TrendingDown sx={{ color: COLORS.red, mr: 1 }} />
                  <Typography variant="h6" sx={{ color: COLORS.red }}>
                    Pending Withdrawals
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: COLORS.text, fontWeight: "bold" }}>
                  {typeof dashboard?.alerts?.pendingWithdrawals === 'number'
                    ? dashboard.alerts.pendingWithdrawals
                    : 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              component={Link}
              to="/admin/users"
              sx={{
                backgroundColor: COLORS.card,
                textDecoration: "none",
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-4px)" },
                border: `1px solid ${COLORS.primary}`,
              }}
            >
              <CardContent sx={{ textAlign: "center", py: 3 }}>
                <People sx={{ fontSize: 48, color: COLORS.primary, mb: 2 }} />
                <Typography variant="h6" sx={{ color: COLORS.primary, fontWeight: "bold" }}>
                  Manage Users
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              component={Link}
              to="/admin/withdrawRequests"
              sx={{
                backgroundColor: COLORS.card,
                textDecoration: "none",
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-4px)" },
                border: `1px solid ${COLORS.red}`,
              }}
            >
              <CardContent sx={{ textAlign: "center", py: 3 }}>
                <TrendingDown sx={{ fontSize: 48, color: COLORS.red, mb: 2 }} />
                <Typography variant="h6" sx={{ color: COLORS.red, fontWeight: "bold" }}>
                  Withdrawal Requests
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          

         
        </Grid>

        {/* Recent Activities */}
        <Grid container spacing={3}>
          {/* Recent Transactions */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ backgroundColor: COLORS.card, p: 3, border: `1px solid ${COLORS.primary}` }}>
              <Typography variant="h6" sx={{ color: COLORS.primary, mb: 2, fontWeight: "bold" }}>
                Recent Transactions
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: COLORS.primary }}>Type</TableCell>
                      <TableCell sx={{ color: COLORS.primary }}>Amount</TableCell>
                      <TableCell sx={{ color: COLORS.primary }}>Status</TableCell>
                      <TableCell sx={{ color: COLORS.primary }}>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ color: COLORS.fadedText }}>
                          No recent transactions.
                        </TableCell>
                      </TableRow>
                    ) : (
                      recentTransactions.map((transaction) => (
                        <TableRow key={transaction._id}>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              {getTransactionIcon(transaction.type)}
                              <Typography sx={{ ml: 1, textTransform: "capitalize" }}>
                                {transaction.type}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography
                              sx={{
                                color: transaction.type === "deposit" || transaction.type === "win"
                                  ? COLORS.green
                                  : COLORS.red,
                              }}
                            >
                              {transaction.type === "deposit" || transaction.type === "win" ? "+" : "-"}
                              {formatCurrency(transaction.amount)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={transaction.status}
                              size="small"
                              sx={{
                                backgroundColor: getStatusColor(transaction.status),
                                color: "#fff",
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ color: COLORS.fadedText }}>
                            {formatDate(transaction.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Recent Users */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ backgroundColor: COLORS.card, p: 3, border: `1px solid ${COLORS.primary}` }}>
              <Typography variant="h6" sx={{ color: COLORS.primary, mb: 2, fontWeight: "bold" }}>
                Recent Users
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: COLORS.primary }}>Email</TableCell>
                      <TableCell sx={{ color: COLORS.primary }}>Joined</TableCell>
                      <TableCell sx={{ color: COLORS.primary }}>Status</TableCell>
                      <TableCell sx={{ color: COLORS.primary }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ color: COLORS.fadedText }}>
                          No recent users.
                        </TableCell>
                      </TableRow>
                    ) : (
                      recentUsers.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell sx={{ color: COLORS.text }}>
                            {user.email}
                          </TableCell>
                          <TableCell sx={{ color: COLORS.text }}>
                            {formatDate(user.createdAt)}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label="Active"
                              size="small"
                              sx={{
                                backgroundColor: COLORS.green,
                                color: "#fff",
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  sx={{ color: COLORS.primary }}
                                  component={Link}
                                  to={`/admin/users/${user._id}`}
                                >
                                  <Visibility />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminDashboard;

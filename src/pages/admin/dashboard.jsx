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
  Block,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
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

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    activeGames: 0,
    pendingWithdrawals: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboard, transactions, users] = await Promise.all([
        apiService.getAdminDashboard(),
        apiService.getAdminTransactions(1, 5),
        apiService.getAdminUsers(1, 5)
      ]);

      setDashboardData(dashboard);
      setRecentTransactions(transactions.transactions || []);
      setRecentUsers(users.users || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
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
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadDashboardData}
            sx={{ color: COLORS.primary, borderColor: COLORS.primary }}
          >
            Refresh
          </Button>
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
                  {dashboardData.totalUsers?.toLocaleString() || "0"}
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
                    Total Revenue
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: COLORS.text, fontWeight: "bold" }}>
                  {formatCurrency(dashboardData.totalRevenue)}
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
                    Total Transactions
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: COLORS.text, fontWeight: "bold" }}>
                  {dashboardData.totalTransactions?.toLocaleString() || "0"}
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
                  {dashboardData.pendingWithdrawals || "0"}
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

          <Grid item xs={12} sm={6} md={3}>
            <Card
              component={Link}
              to="/admin/gameRounds"
              sx={{
                backgroundColor: COLORS.card,
                textDecoration: "none",
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-4px)" },
                border: `1px solid ${COLORS.blue}`,
              }}
            >
              <CardContent sx={{ textAlign: "center", py: 3 }}>
                <Casino sx={{ fontSize: 48, color: COLORS.blue, mb: 2 }} />
                <Typography variant="h6" sx={{ color: COLORS.blue, fontWeight: "bold" }}>
                  Game Settings
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              component={Link}
              to="/admin/transactions"
              sx={{
                backgroundColor: COLORS.card,
                textDecoration: "none",
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-4px)" },
                border: `1px solid ${COLORS.green}`,
              }}
            >
              <CardContent sx={{ textAlign: "center", py: 3 }}>
                <MonetizationOn sx={{ fontSize: 48, color: COLORS.green, mb: 2 }} />
                <Typography variant="h6" sx={{ color: COLORS.green, fontWeight: "bold" }}>
                  All Transactions
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
                    {recentTransactions.map((transaction) => (
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
                    ))}
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
                      <TableCell sx={{ color: COLORS.primary }}>Name</TableCell>
                      <TableCell sx={{ color: COLORS.primary }}>Email</TableCell>
                      <TableCell sx={{ color: COLORS.primary }}>Status</TableCell>
                      <TableCell sx={{ color: COLORS.primary }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentUsers.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell sx={{ color: COLORS.text }}>
                          {user.name || "N/A"}
                        </TableCell>
                        <TableCell sx={{ color: COLORS.text }}>
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.isBlocked ? "Blocked" : "Active"}
                            size="small"
                            sx={{
                              backgroundColor: user.isBlocked ? COLORS.red : COLORS.green,
                              color: "#fff",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Tooltip title="View Details">
                              <IconButton size="small" sx={{ color: COLORS.primary }}>
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={user.isBlocked ? "Unblock" : "Block"}>
                              <IconButton size="small" sx={{ color: user.isBlocked ? COLORS.green : COLORS.red }}>
                                {user.isBlocked ? <CheckCircle /> : <Block />}
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
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

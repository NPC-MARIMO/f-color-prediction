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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  InputAdornment,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  People,
  Search,
  Visibility,
  Block,
  CheckCircle,
  Refresh,
  FilterList,
  Person,
  Email,
  Phone,
  CalendarToday,
  AccountBalance,
  Casino,
} from '@mui/icons-material';
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

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('user');
  const [isBlocked, setIsBlocked] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [blockReason, setBlockReason] = useState('');
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [blockingUser, setBlockingUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, [page, search, role, isBlocked]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAdminUsers(page, limit, role, isBlocked, search);
      setUsers(response.users || []);
      setTotalPages(Math.ceil((response.total || 0) / limit));
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId, reason) => {
    try {
      await apiService.blockUser(userId, reason);
      setSuccess('User blocked successfully');
      setShowBlockDialog(false);
      setBlockReason('');
      setBlockingUser(null);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to block user');
    }
  };

  const handleViewUser = async (userId) => {
    try {
      const response = await apiService.getAdminUserById(userId);
      setSelectedUser(response.user);
      setShowUserDetails(true);
    } catch (err) {
      setError('Failed to load user details');
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

  const getStatusColor = (isBlocked) => {
    return isBlocked ? COLORS.red : COLORS.green;
  };

  if (loading && users.length === 0) {
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
          Loading users...
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
            User Management
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadUsers}
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

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {/* Filters */}
        <Paper sx={{ backgroundColor: COLORS.card, p: 3, mb: 3, border: `1px solid ${COLORS.primary}` }}>
          <Typography variant="h6" sx={{ color: COLORS.primary, mb: 2, fontWeight: "bold" }}>
            <FilterList sx={{ mr: 1, verticalAlign: 'middle' }} />
            Filters
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search by email or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: COLORS.fadedText }} />
                    </InputAdornment>
                  ),
                  style: { color: COLORS.text, background: "#222" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: COLORS.primary },
                    "&:hover fieldset": { borderColor: COLORS.primary },
                    "&.Mui-focused fieldset": { borderColor: COLORS.primary },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: COLORS.primary }}>Role</InputLabel>
                <Select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  sx={{
                    color: COLORS.text,
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: COLORS.primary },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: COLORS.primary },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: COLORS.primary },
                  }}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isBlocked}
                    onChange={(e) => setIsBlocked(e.target.checked)}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: COLORS.red,
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                        backgroundColor: COLORS.red,
                      },
                    }}
                  />
                }
                label="Show Blocked Users"
                sx={{ color: COLORS.text }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                onClick={() => {
                  setSearch('');
                  setRole('user');
                  setIsBlocked(false);
                }}
                sx={{ backgroundColor: COLORS.primary, color: "#222" }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Users Table */}
        <Paper sx={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.primary}` }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: COLORS.primary, fontWeight: "bold" }}>User</TableCell>
                  <TableCell sx={{ color: COLORS.primary, fontWeight: "bold" }}>Email</TableCell>
                  <TableCell sx={{ color: COLORS.primary, fontWeight: "bold" }}>Balance</TableCell>
                  <TableCell sx={{ color: COLORS.primary, fontWeight: "bold" }}>Games Played</TableCell>
                  <TableCell sx={{ color: COLORS.primary, fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ color: COLORS.primary, fontWeight: "bold" }}>Joined</TableCell>
                  <TableCell sx={{ color: COLORS.primary, fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Person sx={{ color: COLORS.primary, mr: 1 }} />
                        <Typography sx={{ color: COLORS.text }}>
                          {user.name || "N/A"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: COLORS.text }}>
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: COLORS.green, fontWeight: "bold" }}>
                        {formatCurrency(user.walletBalance || 0)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: COLORS.text }}>
                      {user.totalGamesPlayed || 0}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.isBlocked ? "Blocked" : "Active"}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(user.isBlocked),
                          color: "#fff",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: COLORS.fadedText }}>
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewUser(user._id)}
                            sx={{ color: COLORS.primary }}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={user.isBlocked ? "Unblock" : "Block"}>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setBlockingUser(user);
                              setShowBlockDialog(true);
                            }}
                            sx={{ color: user.isBlocked ? COLORS.green : COLORS.red }}
                          >
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

          {/* Pagination */}
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, newPage) => setPage(newPage)}
              sx={{
                "& .MuiPaginationItem-root": {
                  color: COLORS.text,
                },
                "& .Mui-selected": {
                  backgroundColor: COLORS.primary,
                  color: "#222",
                },
              }}
            />
          </Box>
        </Paper>

        {/* User Details Dialog */}
        <Dialog
          open={showUserDetails}
          onClose={() => setShowUserDetails(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              backgroundColor: COLORS.card,
              color: COLORS.text,
              border: `1px solid ${COLORS.primary}`,
            },
          }}
        >
          <DialogTitle sx={{ color: COLORS.primary, fontWeight: "bold" }}>
            User Details
          </DialogTitle>
          <DialogContent>
            {selectedUser && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: COLORS.primary }}>
                      <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Name
                    </Typography>
                    <Typography sx={{ color: COLORS.text }}>
                      {selectedUser.name || "N/A"}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: COLORS.primary }}>
                      <Email sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Email
                    </Typography>
                    <Typography sx={{ color: COLORS.text }}>
                      {selectedUser.email}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: COLORS.primary }}>
                      <CalendarToday sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Joined
                    </Typography>
                    <Typography sx={{ color: COLORS.text }}>
                      {formatDate(selectedUser.createdAt)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: COLORS.primary }}>
                      <AccountBalance sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Wallet Balance
                    </Typography>
                    <Typography sx={{ color: COLORS.green, fontWeight: "bold" }}>
                      {formatCurrency(selectedUser.walletBalance || 0)}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: COLORS.primary }}>
                      <Casino sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Games Played
                    </Typography>
                    <Typography sx={{ color: COLORS.text }}>
                      {selectedUser.totalGamesPlayed || 0}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: COLORS.primary }}>
                      Status
                    </Typography>
                    <Chip
                      label={selectedUser.isBlocked ? "Blocked" : "Active"}
                      size="small"
                      sx={{
                        backgroundColor: getStatusColor(selectedUser.isBlocked),
                        color: "#fff",
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setShowUserDetails(false)}
              sx={{ color: COLORS.primary }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Block User Dialog */}
        <Dialog
          open={showBlockDialog}
          onClose={() => {
            setShowBlockDialog(false);
            setBlockReason('');
            setBlockingUser(null);
          }}
          PaperProps={{
            sx: {
              backgroundColor: COLORS.card,
              color: COLORS.text,
              border: `1px solid ${COLORS.red}`,
            },
          }}
        >
          <DialogTitle sx={{ color: COLORS.red, fontWeight: "bold" }}>
            {blockingUser?.isBlocked ? "Unblock User" : "Block User"}
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              {blockingUser?.isBlocked 
                ? `Are you sure you want to unblock ${blockingUser?.name || blockingUser?.email}?`
                : `Are you sure you want to block ${blockingUser?.name || blockingUser?.email}?`
              }
            </Typography>
            {!blockingUser?.isBlocked && (
              <TextField
                fullWidth
                label="Reason for blocking"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                multiline
                rows={3}
                sx={{ mt: 2 }}
                InputProps={{
                  style: { color: COLORS.text, background: "#222" },
                }}
                InputLabelProps={{ style: { color: COLORS.primary } }}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setShowBlockDialog(false);
                setBlockReason('');
                setBlockingUser(null);
              }}
              sx={{ color: COLORS.fadedText }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleBlockUser(blockingUser?._id, blockReason)}
              sx={{ color: COLORS.red }}
            >
              {blockingUser?.isBlocked ? "Unblock" : "Block"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AdminUsers;

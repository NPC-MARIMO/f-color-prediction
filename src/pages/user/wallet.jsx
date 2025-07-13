import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import {
  AccountBalance,
  Add,
  Remove,
  History,
  TrendingUp,
  TrendingDown,
  Payment,
  AccountBalanceWallet,
  Receipt,
  CheckCircle,
  Cancel,
  Pending,
  Refresh,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import apiService from '../../services/apiService';

const Wallet = () => {
  const { user } = useSelector((state) => state.auth);
  
  // State management
  const [walletData, setWalletData] = useState({
    balance: 0,
    lockedBalance: 0,
    totalWon: 0,
    totalLost: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
  });

  useEffect(() => {
    if (user?.id) {
      loadWalletData();
      loadTransactions();
    }
  }, [user]);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getWalletBalance();
      setWalletData(response);
    } catch (err) {
      setError('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      const response = await apiService.getTransactionHistory();
      setTransactions(response.transactions || []);
    } catch (err) {
      console.error('Failed to load transactions:', err);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || depositAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.createDepositOrder(parseInt(depositAmount));
      
      // Initialize Razorpay
      const options = {
        key: process.env.VITE_RAZORPAY_KEY_ID,
        amount: response.amount,
        currency: 'INR',
        order_id: response.orderId,
        name: 'Color Prediction Game',
        description: 'Wallet Deposit',
        handler: async (response) => {
          try {
            await apiService.verifyDepositPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            setSuccess('Deposit successful!');
            setShowDeposit(false);
            setDepositAmount('');
            loadWalletData();
            loadTransactions();
          } catch (err) {
            setError('Payment verification failed');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#D4AF37',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create deposit order');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || withdrawAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (withdrawAmount > walletData.balance) {
      setError('Insufficient balance');
      return;
    }

    if (!bankDetails.accountNumber || !bankDetails.ifscCode || !bankDetails.accountHolderName) {
      setError('Please fill in all bank details');
      return;
    }

    try {
      setLoading(true);
      await apiService.createWithdrawalRequest({
        amount: parseInt(withdrawAmount),
        bankDetails,
      });
      setSuccess('Withdrawal request submitted successfully!');
      setShowWithdraw(false);
      setWithdrawAmount('');
      setBankDetails({
        accountNumber: '',
        ifscCode: '',
        accountHolderName: '',
      });
      loadWalletData();
      loadTransactions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit withdrawal request');
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <Add color="success" />;
      case 'withdrawal':
        return <Remove color="error" />;
      case 'win':
        return <TrendingUp color="success" />;
      case 'loss':
        return <TrendingDown color="error" />;
      default:
        return <Receipt color="primary" />;
    }
  };

  const getTransactionStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      case 'cancelled':
        return 'default';
      default:
        return 'default';
    }
  };

  const getTransactionStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle />;
      case 'pending':
        return <Pending />;
      case 'failed':
      case 'cancelled':
        return <Cancel />;
      default:
        return <Pending />;
    }
  };

  const availableBalance = walletData.balance - walletData.lockedBalance;

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" color="primary" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <AccountBalanceWallet sx={{ mr: 2 }} />
        My Wallet
      </Typography>

      {/* Error/Success Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Wallet Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalance color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Balance</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                ₹{walletData.balance.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Payment color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Available Balance</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                ₹{availableBalance.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Won</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                ₹{walletData.totalWon.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingDown color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Lost</Typography>
              </Box>
              <Typography variant="h4" color="error.main">
                ₹{walletData.totalLost.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowDeposit(true)}
          disabled={loading}
        >
          Deposit
        </Button>
        <Button
          variant="outlined"
          startIcon={<Remove />}
          onClick={() => setShowWithdraw(true)}
          disabled={loading || availableBalance <= 0}
        >
          Withdraw
        </Button>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => {
            loadWalletData();
            loadTransactions();
          }}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {/* Transactions */}
      <Card>
        <CardContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
              <Tab label="All Transactions" />
              <Tab label="Deposits" />
              <Tab label="Withdrawals" />
              <Tab label="Game Results" />
            </Tabs>
          </Box>

          {activeTab === 0 && (
            <TableContainer component={Paper} sx={{ bgcolor: 'transparent' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {getTransactionIcon(transaction.type)}
                          <Typography sx={{ ml: 1, textTransform: 'capitalize' }}>
                            {transaction.type}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography
                          color={transaction.type === 'deposit' || transaction.type === 'win' ? 'success.main' : 'error.main'}
                        >
                          {transaction.type === 'deposit' || transaction.type === 'win' ? '+' : '-'}
                          ₹{transaction.amount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getTransactionStatusIcon(transaction.status)}
                          label={transaction.status}
                          color={getTransactionStatusColor(transaction.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {transaction.description || transaction.type}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {activeTab === 1 && (
            <TableContainer component={Paper} sx={{ bgcolor: 'transparent' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Payment ID</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions
                    .filter(t => t.type === 'deposit')
                    .map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <Typography color="success.main">
                            +₹{transaction.amount.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getTransactionStatusIcon(transaction.status)}
                            label={transaction.status}
                            color={getTransactionStatusColor(transaction.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {transaction.paymentId || 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {activeTab === 2 && (
            <TableContainer component={Paper} sx={{ bgcolor: 'transparent' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Bank Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions
                    .filter(t => t.type === 'withdrawal')
                    .map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <Typography color="error.main">
                            -₹{transaction.amount.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getTransactionStatusIcon(transaction.status)}
                            label={transaction.status}
                            color={getTransactionStatusColor(transaction.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {transaction.bankDetails ? 
                            `${transaction.bankDetails.accountHolderName} - ${transaction.bankDetails.accountNumber}` : 
                            'N/A'
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {activeTab === 3 && (
            <TableContainer component={Paper} sx={{ bgcolor: 'transparent' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Game</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions
                    .filter(t => t.type === 'win' || t.type === 'loss')
                    .map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {getTransactionIcon(transaction.type)}
                            <Typography sx={{ ml: 1, textTransform: 'capitalize' }}>
                              {transaction.type}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography
                            color={transaction.type === 'win' ? 'success.main' : 'error.main'}
                          >
                            {transaction.type === 'win' ? '+' : '-'}
                            ₹{transaction.amount.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {transaction.gameId ? `Game #${transaction.gameId}` : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Deposit Dialog */}
      <Dialog open={showDeposit} onClose={() => setShowDeposit(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Deposit Money</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Amount (₹)"
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            sx={{ mt: 1 }}
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
            }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Minimum deposit: ₹100 | Maximum deposit: ₹50,000
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeposit(false)}>Cancel</Button>
          <Button onClick={handleDeposit} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Proceed to Payment'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={showWithdraw} onClose={() => setShowWithdraw(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Withdraw Money</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Amount (₹)"
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
            }}
          />
          <TextField
            fullWidth
            label="Account Holder Name"
            value={bankDetails.accountHolderName}
            onChange={(e) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Account Number"
            value={bankDetails.accountNumber}
            onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="IFSC Code"
            value={bankDetails.ifscCode}
            onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Typography variant="body2" color="text.secondary">
            Available balance: ₹{availableBalance.toLocaleString()}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowWithdraw(false)}>Cancel</Button>
          <Button onClick={handleWithdraw} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Submit Request'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Wallet;

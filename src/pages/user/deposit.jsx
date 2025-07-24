import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Box,
  Paper,
  Snackbar,
  Alert,
  TextField,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import {
  MonetizationOn,
  AccountBalance,
  Payment,
  TrendingUp,
  History,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import apiService from "../../services/apiService";

const COLORS = {
  background: "#121212",
  primary: "#D4AF37",
  text: "#FFFFFF",
  red: "#E11D48",
  green: "#10B981",
  blue: "#3B82F6",
  fadedText: "#AAAAAA",
};

const PAYMENT_METHODS = [
  { value: "upi", label: "UPI Payment", icon: "📱" },
  { value: "bank_transfer", label: "Bank Transfer", icon: "🏦" },
  { value: "card", label: "Credit/Debit Card", icon: "💳" },
];

const DEPOSIT_AMOUNTS = [1, 100, 500, 1000, 2000, 5000, 10000];

const DepositPage = () => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [depositHistory, setDepositHistory] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    loadBalance();
    loadDepositHistory();
  }, []);

  const loadBalance = async () => {
    try {
      const response = await apiService.getWalletBalance();
      setBalance(response?.balance || response?.wallet?.balance || 0);
    } catch (error) {
      console.error("Error loading balance:", error);
    }
  };

  const loadDepositHistory = async () => {
    try {
      setLoadingHistory(true);
      const response = await apiService.getTransactionHistory(1, 10);
      const deposits = response?.transactions?.filter(t => t.type === "deposit") || [];
      setDepositHistory(deposits);
    } catch (error) {
      console.error("Error loading deposit history:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleAmountSelect = (selectedAmount) => {
    setAmount(selectedAmount.toString());
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!amount || amount < 1) {
      setSnackbar({
        open: true,
        message: "Minimum deposit amount is ₹1",
        severity: "error",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const response = await apiService.createDepositOrder(parseInt(amount));
      
      if (response.paymentUrl) {
        // Redirect to payment gateway
        window.open(response.paymentUrl, "_blank");
        setSnackbar({
          open: true,
          message: "Redirecting to payment gateway...",
          severity: "info",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Deposit request created successfully!",
          severity: "success",
        });
      }
      
      // Reset form
      setAmount("");
      setPaymentMethod("upi");
      
      // Refresh balance and history
      setTimeout(() => {
        loadBalance();
        loadDepositHistory();
      }, 2000);
      
    } catch (error) {
      console.error("Error creating deposit:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to create deposit",
        severity: "error",
      });
    } finally {
      setIsProcessing(false);
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

  return (
    <Box
      sx={{
        backgroundColor: COLORS.background,
        minHeight: "100vh",
        color: COLORS.text,
        p: 2,
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto", mt: 2 }}>
        <Typography
          variant="h4"
          sx={{
            mb: 3,
            color: COLORS.primary,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
          }}
        >
          <MonetizationOn sx={{ mr: 2, color: COLORS.primary }} /> Deposit Funds
        </Typography>

        <Grid container spacing={3}>
          {/* Current Balance */}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                backgroundColor: "#1E1E1E",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                border: `1px solid ${COLORS.primary}`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <AccountBalance sx={{ color: COLORS.primary, mr: 1 }} />
                <Typography variant="h6" sx={{ color: COLORS.primary, fontWeight: "bold" }}>
                  Current Balance
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: COLORS.text, fontWeight: "bold" }}>
                {formatCurrency(balance)}
              </Typography>
            </Paper>
          </Grid>

          {/* Deposit Form */}
          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                p: 4,
                backgroundColor: "#1E1E1E",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                border: `1px solid ${COLORS.primary}`,
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: "bold", color: COLORS.primary, mb: 3 }}>
                Add Funds
              </Typography>

              <form onSubmit={handleDeposit}>
                {/* Amount Selection */}
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ mb: 2, color: COLORS.fadedText }}>
                    Select Amount (₹)
                  </Typography>
                  <Grid container spacing={1}>
                    {DEPOSIT_AMOUNTS.map((depositAmount) => (
                      <Grid item xs={6} sm={4} key={depositAmount}>
                        <Button
                          variant={amount === depositAmount.toString() ? "contained" : "outlined"}
                          onClick={() => handleAmountSelect(depositAmount)}
                          sx={{
                            width: "100%",
                            py: 1.5,
                            backgroundColor: amount === depositAmount.toString() ? COLORS.primary : "transparent",
                            color: amount === depositAmount.toString() ? "#222" : COLORS.primary,
                            borderColor: COLORS.primary,
                            fontWeight: "bold",
                            "&:hover": {
                              backgroundColor: amount === depositAmount.toString() ? COLORS.primary : `${COLORS.primary}20`,
                            },
                          }}
                        >
                          ₹{depositAmount.toLocaleString()}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* Custom Amount */}
                <TextField
                  label="Or Enter Custom Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  fullWidth
                  sx={{ mb: 3 }}
                  InputProps={{
                    style: { color: COLORS.text, background: "#222" },
                  }}
                  InputLabelProps={{ style: { color: COLORS.primary } }}
                  variant="outlined"
                  placeholder="Enter amount (min ₹1)"
                />

                {/* Payment Method */}
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel sx={{ color: COLORS.primary }}>Payment Method</InputLabel>
                  <Select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    sx={{
                      color: COLORS.text,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: COLORS.primary,
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: COLORS.primary,
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: COLORS.primary,
                      },
                    }}
                  >
                    {PAYMENT_METHODS.map((method) => (
                      <MenuItem key={method.value} value={method.value}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <span style={{ marginRight: 8 }}>{method.icon}</span>
                          {method.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Deposit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isProcessing || !amount || amount < 1}
                  sx={{
                    backgroundColor: COLORS.primary,
                    color: "#222",
                    fontWeight: "bold",
                    py: 1.5,
                    px: 4,
                    fontSize: "1.1rem",
                    "&:disabled": {
                      backgroundColor: "#666",
                      color: "#999",
                    },
                  }}
                  fullWidth
                >
                  {isProcessing ? (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CircularProgress size={20} sx={{ color: "#222", mr: 1 }} />
                      Processing...
                    </Box>
                  ) : (
                    `Deposit ₹${amount ? parseInt(amount).toLocaleString() : "0"}`
                  )}
                </Button>
              </form>
            </Paper>
          </Grid>

          {/* Deposit History */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 3,
                backgroundColor: "#1E1E1E",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                border: `1px solid ${COLORS.primary}`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <History sx={{ color: COLORS.primary, mr: 1 }} />
                <Typography variant="h6" sx={{ color: COLORS.primary, fontWeight: "bold" }}>
                  Recent Deposits
                </Typography>
              </Box>

              {loadingHistory ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress sx={{ color: COLORS.primary }} />
                </Box>
              ) : depositHistory.length > 0 ? (
                <Grid container spacing={2}>
                  {depositHistory.map((deposit) => (
                    <Grid item xs={12} sm={6} md={4} key={deposit._id}>
                      <Card sx={{ backgroundColor: "#222", border: `1px solid ${getStatusColor(deposit.status)}` }}>
                        <CardContent>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                            <Typography variant="h6" sx={{ color: COLORS.text, fontWeight: "bold" }}>
                              {formatCurrency(deposit.amount)}
                            </Typography>
                            <Chip
                              label={deposit.status}
                              size="small"
                              sx={{
                                backgroundColor: getStatusColor(deposit.status),
                                color: "#fff",
                                fontWeight: "bold",
                              }}
                            />
                          </Box>
                          <Typography variant="body2" sx={{ color: COLORS.fadedText, mb: 1 }}>
                            {deposit.paymentMethod || "UPI"}
                          </Typography>
                          <Typography variant="caption" sx={{ color: COLORS.fadedText }}>
                            {formatDate(deposit.createdAt)}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography sx={{ color: COLORS.fadedText }}>
                    No deposit history found
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            severity={snackbar.severity}
            sx={{ width: "100%" }}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default DepositPage; 
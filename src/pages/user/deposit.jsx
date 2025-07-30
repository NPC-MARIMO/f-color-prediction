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
} from "@mui/material";
import { MonetizationOn, AccountBalance, History } from "@mui/icons-material";
import apiService from "../../services/apiService";

const COLORS = {
  primary: "#D4AF37",
  text: "#FFFFFF",
  background: "#121212",
  green: "#10B981",
  red: "#E11D48",
};

const DEPOSIT_AMOUNTS = [100, 500, 1000, 2000, 5000, 10000];

const DepositPage = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [balance, setBalance] = useState(0);
  const [depositHistory, setDepositHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Load initial data
  useEffect(() => {
    fetchBalance();
    fetchDepositHistory();

    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await apiService.getWalletBalance();
      
      setBalance(response.wallet.balance || 0);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setSnackbar({
        open: true,
        message: "Failed to load balance",
        severity: "error",
      });
    }
  };

  const fetchDepositHistory = async () => {
    try {
      setLoadingHistory(true);
      const response = await apiService.api.get(
        "/api/payment/transaction-history"
      );

      setDepositHistory(response.data.transactions || response.transactions || []);
      console.log(response,'response');
      
    } catch (error) {
      console.error("Error fetching deposit history:", error);
      setSnackbar({
        open: true,
        message: "Failed to load deposit history",
        severity: "error",
      });
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();

    if (!amount || amount < 100) {
      setSnackbar({
        open: true,
        message: "Minimum deposit amount is ₹100",
        severity: "error",
      });
      return;
    }

    if (!window.Razorpay) {
      setSnackbar({
        open: true,
        message: "Payment system is loading. Please try again.",
        severity: "error",
      });
      return;
    }

    setLoading(true);

    try {
      // 1. Create Razorpay order via API
      const orderResponse = await apiService.createRazorpayOrder(parseInt(amount));

      // if (!orderResponse.data.success) {
      //   throw new Error(orderResponse.data.message || "Failed to create order");
      // }

      const { order, razorpayKeyId, user } = orderResponse;

      // 2. Initialize Razorpay checkout
      const options = {
        key: razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: "Your App Name",
        description: "Wallet Deposit",
        order_id: order.id,
        handler: async function (response) {
          try {
            // 3. Verify payment with backend
            const verificationResponse = await apiService.verifyRazorpayPayment(
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                amount: order.amount,
              }
            );

            if (verificationResponse.success) {
              setSnackbar({
                open: true,
                message: "Payment successful! Funds added to your account.",
                severity: "success",
              });
              setAmount("");
              fetchBalance();
              fetchDepositHistory();
            } else {
              throw new Error(
                verificationResponse.data.message ||
                  "Payment verification failed"
              );
            }
          } catch (error) {
            setSnackbar({
              open: true,
              message: error.message || "Payment verification failed",
              severity: "error",
            });
          }
        },
        prefill: {
          name: user.name || "",
          email: user.email || "",
          contact: user.phone || "",
        },
        theme: {
          color: COLORS.primary,
        },
        modal: {
          ondismiss: () => {
            setSnackbar({
              open: true,
              message: "Payment cancelled",
              severity: "info",
            });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        setSnackbar({
          open: true,
          message: `Payment failed: ${response.error.description}`,
          severity: "error",
        });
      });
      rzp.open();
    } catch (error) {
      console.error("Deposit error:", error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          error.message ||
          "Payment processing failed",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: COLORS.background, minHeight: "100vh", p: 3 }}>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Typography
          variant="h4"
          sx={{
            color: COLORS.primary,
            mb: 4,
            display: "flex",
            alignItems: "center",
          }}
        >
          <MonetizationOn sx={{ mr: 2 }} /> Deposit Funds
        </Typography>

        <Grid container spacing={3}>
          {/* Balance Card */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, backgroundColor: "#1E1E1E", borderRadius: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <AccountBalance sx={{ color: COLORS.primary, mr: 1 }} />
                <Typography variant="h6" sx={{ color: COLORS.primary }}>
                  Current Balance
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: COLORS.text }}>
                ₹{balance.toLocaleString()}
              </Typography>
            </Paper>
          </Grid>

          {/* Deposit Form */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4, backgroundColor: "#1E1E1E", borderRadius: 2 }}>
              <Typography variant="h5" sx={{ color: COLORS.primary, mb: 3 }}>
                Add Funds
              </Typography>

              <form onSubmit={handleDeposit}>
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ mb: 2, color: "#AAA" }}>
                    Select Amount (₹)
                  </Typography>
                  <Grid container spacing={1}>
                    {DEPOSIT_AMOUNTS.map((amt) => (
                      <Grid item xs={6} sm={4} key={amt}>
                        <Button
                          fullWidth
                          variant={
                            amount === amt.toString() ? "contained" : "outlined"
                          }
                          onClick={() => setAmount(amt.toString())}
                          sx={{
                            backgroundColor:
                              amount === amt.toString()
                                ? COLORS.primary
                                : "transparent",
                            color:
                              amount === amt.toString()
                                ? "#222"
                                : COLORS.primary,
                            borderColor: COLORS.primary,
                            py: 1.5,
                            "&:hover": {
                              backgroundColor:
                                amount === amt.toString()
                                  ? COLORS.primary
                                  : `${COLORS.primary}20`,
                            },
                          }}
                        >
                          ₹{amt.toLocaleString()}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                <TextField
                  fullWidth
                  label="Or enter custom amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  sx={{ mb: 3 }}
                  InputProps={{
                    style: { color: COLORS.text, backgroundColor: "#222" },
                  }}
                  InputLabelProps={{ style: { color: COLORS.primary } }}
                />

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={loading || !amount || amount < 100}
                  sx={{
                    backgroundColor: COLORS.primary,
                    color: "#222",
                    py: 1.5,
                    fontSize: "1.1rem",
                    "&:disabled": {
                      backgroundColor: "#444",
                      color: "#888",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: "#222" }} />
                  ) : (
                    `Deposit ₹${amount || "0"}`
                  )}
                </Button>
              </form>
            </Paper>
          </Grid>

          {/* Deposit History */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, backgroundColor: "#1E1E1E", borderRadius: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <History sx={{ color: COLORS.primary, mr: 1 }} />
                <Typography variant="h6" sx={{ color: COLORS.primary }}>
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
                      <Card sx={{ backgroundColor: "#222" }}>
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{ color: COLORS.text }}
                            >
                              ₹{deposit.amount}
                            </Typography>
                            <Chip
                              label={deposit.status}
                              size="small"
                              sx={{
                                backgroundColor:
                                  deposit.status === "completed"
                                    ? COLORS.green
                                    : COLORS.red,
                                color: "white",
                              }}
                            />
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{ color: "#AAA", mb: 1 }}
                          >
                            {new Date(deposit.createdAt).toLocaleString()}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#AAA" }}>
                            Transaction ID: {deposit.transactionId}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography sx={{ color: "#AAA", textAlign: "center", py: 4 }}>
                  No deposit history found
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
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
  );
};

export default DepositPage;

import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import {
  Person,
  Edit,
  EmojiEvents,
  TrendingUp,
  TrendingDown,
  Casino,
  AccountBalance,
  Star,
  Timeline,
  ArrowDownward,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/features/auth/authSlice";
import apiService from "../../services/apiService";
import socketService from "../../services/socketService";

const palette = {
  background: "#0F0F0F",
  text: "#FFFFFF",
  primary: "#D4AF37",
  secondary: "#6A0DAD",
  success: "#00C897",
  danger: "#FF4C4C",
  card: "#1A1A1A",
  fadedText: "#AAAAAA",
};

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth.user);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    totalGames: 0,
    gamesWon: 0,
    gamesLost: 0,
    totalWon: 0,
    totalLost: 0,
    bestWin: 0,
    currentStreak: 0,
    longestStreak: 0,
    isOnline: false,
    lastLogin: null,
  });

  const [gameHistory, setGameHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [editForm, setEditForm] = useState({ name: "", email: "" });

  // Withdraw dialog state
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  // Wallet balance state (fetched from server)
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletLoading, setWalletLoading] = useState(false);

  // Bank/UPI form state for withdraw dialog
  const [bankFormType, setBankFormType] = useState("bank"); // "bank" or "upi"
  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    beneficiaryName: "",
    ifsc: "",
    bankName: "",
    upi: "",
  });

  useEffect(() => {
    if (user?.id || user?._id) {
      loadProfileData();
      loadGameHistory();
      fetchWalletBalance();
    }
    // eslint-disable-next-line
  }, [user]);

  const fetchWalletBalance = async () => {
    try {
      const response = await apiService.getWalletBalance();

      setWalletBalance(response.wallet.balance || 0);
    } catch (error) {
      console.error("Error fetching balance:", error);
      // setSnackbar is not defined in this file, so we comment it out
      // setSnackbar({
      //   open: true,
      //   message: "Failed to load balance",
      //   severity: "error",
      // });
    }
  };

  const loadProfileData = () => {
    const totalGames = user?.totalGamesPlayed || 0;
    const gamesWon = user?.totalGamesWon || 0;
    const gamesLost = totalGames - gamesWon;

    setProfileData({
      name: user?.name || "Player",
      email: user?.email || "",
      totalGames,
      gamesWon,
      gamesLost,
      totalWon: user?.totalAmountWon || 0,
      totalLost: (user?.totalDeposited || 0) - (user?.totalAmountWon || 0),
      bestWin: user?.totalAmountWon || 0,
      currentStreak: 0,
      longestStreak: 0,
      isOnline: user?.isOnline || false,
      lastLogin: user?.createdAt || new Date().toISOString(),
    });
  };

  const loadGameHistory = async () => {
    try {
      const response = await apiService.getGameHistory();
      const games = response?.games || [];
      const bestWin = Math.max(...games.map((g) => g.payout || 0), 0);

      setGameHistory(games);
      setProfileData((prev) => ({
        ...prev,
        bestWin,
      }));
    } catch (err) {
      console.error("Failed to load game history:", err);
    }
  };

  const handleEditProfile = () => {
    setEditForm({
      name: profileData.name,
      email: profileData.email,
    });
    setShowEditProfile(true);
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setProfileData({
        ...profileData,
        name: editForm.name,
        email: editForm.email,
      });
      setSuccess("Profile updated successfully!");
      setShowEditProfile(false);
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    socketService.disconnect();
    dispatch(logout());
  };

  const getGameResultIcon = (result) => {
    switch (result) {
      case "win":
        return <EmojiEvents sx={{ color: palette.success }} />;
      case "loss":
        return <TrendingDown sx={{ color: palette.danger }} />;
      default:
        return <Casino sx={{ color: palette.secondary }} />;
    }
  };

  const getGameResultColor = (result) => {
    switch (result) {
      case "win":
        return "success";
      case "loss":
        return "error";
      default:
        return "default";
    }
  };

  const formatCurrency = (amount) => `₹${Number(amount).toLocaleString()}`;

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // Withdraw logic
  const handleOpenWithdrawDialog = () => {
    setWithdrawDialogOpen(true);
    setWithdrawAmount("");
    setError("");
    setSuccess("");
    setBankFormType("bank");
    setBankDetails({
      accountNumber: "",
      beneficiaryName: "",
      ifsc: "",
      bankName: "",
      upi: "",
    });
  };

  const handleCloseWithdrawDialog = () => {
    setWithdrawDialogOpen(false);
    setWithdrawAmount("");
    setError("");
    setSuccess("");
    setBankFormType("bank");
    setBankDetails({
      accountNumber: "",
      beneficiaryName: "",
      ifsc: "",
      bankName: "",
      upi: "",
    });
  };

  const handleBankDetailsChange = (e) => {
    const { name, value } = e.target;
    setBankDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWithdrawRequest = async () => {
    setError("");
    setSuccess("");
    if (!withdrawAmount || isNaN(withdrawAmount) || Number(withdrawAmount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (Number(withdrawAmount) > walletBalance) {
      setError("Insufficient wallet balance.");
      return;
    }

    // Validate bank/upi details
    if (bankFormType === "bank") {
      if (
        !bankDetails.accountNumber ||
        !bankDetails.beneficiaryName ||
        !bankDetails.ifsc ||
        !bankDetails.bankName
      ) {
        setError("Please fill all bank details.");
        return;
      }
    } else if (bankFormType === "upi") {
      if (!bankDetails.upi) {
        setError("Please enter your UPI ID.");
        return;
      }
    }

    setWithdrawLoading(true);
    try {
      // You may need to adjust the API call according to your backend
      await apiService.createWithdrawalRequest({
        amount: Number(withdrawAmount),
        ...(bankFormType === "bank"
          ? {
              bankDetails: {
                accountNumber: bankDetails.accountNumber,
                beneficiaryName: bankDetails.beneficiaryName,
                ifsc: bankDetails.ifsc,
                bankName: bankDetails.bankName,
              },
            }
          : {
              upi: bankDetails.upi,
            }),
        method: bankFormType,
      });
      setSuccess("Withdraw request created successfully!");
      setWithdrawDialogOpen(false);
      setWithdrawAmount("");
      setBankFormType("bank");
      setBankDetails({
        accountNumber: "",
        beneficiaryName: "",
        ifsc: "",
        bankName: "",
        upi: "",
      });
      // Refresh wallet balance after withdraw request
      fetchWalletBalance();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create withdraw request"
      );
    } finally {
      setWithdrawLoading(false);
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        maxWidth: 1200,
        mx: "auto",
        bgcolor: palette.background,
        color: palette.text,
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          color: palette.primary,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Person sx={{ mr: 2, color: palette.primary }} /> My Profile
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: palette.card, borderRadius: 3 }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: "3rem",
                  bgcolor: palette.primary,
                  mx: "auto",
                  mb: 2,
                  color: palette.background,
                }}
              >
                {profileData.name?.charAt(0).toUpperCase() || "U"}
              </Avatar>
              <Typography variant="h5">{profileData.name}</Typography>
              <Typography sx={{ color: palette.fadedText }}>
                {profileData.email}
              </Typography>
              <Typography sx={{ color: "#666", fontSize: 12, mt: 1 }}>
                User ID: {user?._id || "N/A"}
              </Typography>
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <Button
                  variant="outlined"
                  sx={{ borderColor: palette.danger, color: palette.danger }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {[
              [
                "Total Games",
                profileData.totalGames,
                <EmojiEvents sx={{ color: palette.primary }} />,
              ],
              [
                "Games Won",
                profileData.gamesWon,
                <EmojiEvents sx={{ color: palette.success }} />,
              ],
              [
                "Total Won",
                formatCurrency(profileData.totalWon),
                <TrendingUp sx={{ color: palette.success }} />,
              ],
              [
                "Wallet Balance",
                walletLoading
                  ? <CircularProgress size={20} sx={{ color: palette.primary }} />
                  : formatCurrency(walletBalance),
                <AccountBalance sx={{ color: palette.success }} />,
              ],
            ].map(([label, value, icon], i) => (
              <Grid item xs={6} md={3} key={i}>
                <Card sx={{ bgcolor: palette.card, borderRadius: 3 }}>
                  <CardContent sx={{ textAlign: "center" }}>
                    {icon}
                    <Typography variant="h6" sx={{ color: palette.text }}>
                      {value}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: palette.fadedText }}
                    >
                      {label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {/* Add Deposit, Withdraw, and Bank Details Links */}
            <Grid
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 20,
              }}
              item
              xs={12}
              md={3}
            >
              <Card
                component="a"
                href="/user/deposit"
                sx={{
                  bgcolor: palette.card,
                  borderRadius: 3,
                  height: "100%",
                  width: "500px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  boxShadow: "none",
                  transition: "box-shadow 0.2s, transform 0.2s",
                  cursor: "pointer",
                  mb: 2,
                  "&:hover": {
                    boxShadow: "0 4px 24px 0 rgba(212, 175, 55, 0.15)",
                    transform: "translateY(-2px) scale(1.03)",
                  },
                }}
              >
                <CardContent sx={{ textAlign: "center", p: 3 }}>
                  <TrendingUp
                    sx={{ fontSize: 40, color: palette.primary, mb: 1 }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ color: palette.primary, fontWeight: "bold", mb: 0.5 }}
                  >
                    Deposit
                  </Typography>
                  <Typography variant="body2" sx={{ color: palette.fadedText }}>
                    Add funds to your wallet
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {/* Withdraw Card */}
            <Grid
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 20,
              }}
              item
              xs={12}
              md={3}
            >
              <Card
                sx={{
                  bgcolor: palette.card,
                  borderRadius: 3,
                  height: "100%",
                  width: "500px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  boxShadow: "none",
                  transition: "box-shadow 0.2s, transform 0.2s",
                  cursor: "pointer",
                  mb: 2,
                  "&:hover": {
                    boxShadow: "0 4px 24px 0 rgba(212, 175, 55, 0.15)",
                    transform: "translateY(-2px) scale(1.03)",
                  },
                }}
                onClick={handleOpenWithdrawDialog}
              >
                <CardContent sx={{ textAlign: "center", p: 3 }}>
                  <ArrowDownward
                    sx={{ fontSize: 40, color: palette.primary, mb: 1 }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ color: palette.primary, fontWeight: "bold", mb: 0.5 }}
                  >
                    Withdraw
                  </Typography>
                  <Typography variant="body2" sx={{ color: palette.fadedText }}>
                    Create a withdraw request
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {/* Bank Details Card */}
            <Grid
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 20,
              }}
              item
              xs={12}
              md={3}
            >
              <Card
                component="a"
                href="/user/bank"
                sx={{
                  bgcolor: palette.card,
                  borderRadius: 3,
                  height: "100%",
                  display: "flex",
                  width: 500,
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  boxShadow: "none",
                  transition: "box-shadow 0.2s, transform 0.2s",
                  cursor: "pointer",
                  "&:hover": {
                    boxShadow: "0 4px 24px 0 rgba(212, 175, 55, 0.15)",
                    transform: "translateY(-2px) scale(1.03)",
                  },
                }}
              >
                <CardContent sx={{ textAlign: "center", p: 3 }}>
                  <AccountBalance
                    sx={{ fontSize: 40, color: palette.primary, mb: 1 }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ color: palette.primary, fontWeight: "bold", mb: 0.5 }}
                  >
                    Bank Details
                  </Typography>
                  <Typography variant="body2" sx={{ color: palette.fadedText }}>
                    Add or update your bank info for withdrawals
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Withdraw Dialog */}
      <Dialog open={withdrawDialogOpen} onClose={handleCloseWithdrawDialog}>
        <DialogTitle sx={{ color: palette.primary }}>Withdraw Request</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2, color: palette.fadedText }}>
            Enter the amount you want to withdraw from your wallet.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            inputProps={{ min: 1, max: walletBalance || undefined }}
            sx={{ mb: 2 }}
          />
          <Typography variant="body2" sx={{ color: palette.fadedText }}>
            Wallet Balance:{" "}
            {walletLoading ? (
              <CircularProgress size={16} sx={{ color: palette.primary }} />
            ) : (
              formatCurrency(walletBalance)
            )}
          </Typography>

          {/* Bank/UPI Form */}
          <Box sx={{ mt: 3, mb: 1 }}>
            <Typography variant="subtitle1" sx={{ color: palette.primary, mb: 1 }}>
              Withdrawal Method
            </Typography>
            <RadioGroup
              row
              value={bankFormType}
              onChange={(e) => setBankFormType(e.target.value)}
              sx={{ mb: 2 }}
            >
              <FormControlLabel
                value="bank"
                control={<Radio sx={{ color: palette.primary, "&.Mui-checked": { color: palette.secondary } }} />}
                label="Bank Account"
              />
              <FormControlLabel
                value="upi"
                control={<Radio sx={{ color: palette.primary, "&.Mui-checked": { color: palette.secondary } }} />}
                label="UPI"
              />
            </RadioGroup>
            {bankFormType === "bank" ? (
              <Box>
                <TextField
                  margin="dense"
                  label="Account Number"
                  name="accountNumber"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={bankDetails.accountNumber}
                  onChange={handleBankDetailsChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="dense"
                  label="Beneficiary Name"
                  name="beneficiaryName"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={bankDetails.beneficiaryName}
                  onChange={handleBankDetailsChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="dense"
                  label="IFSC Code"
                  name="ifsc"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={bankDetails.ifsc}
                  onChange={handleBankDetailsChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="dense"
                  label="Bank Name"
                  name="bankName"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={bankDetails.bankName}
                  onChange={handleBankDetailsChange}
                  sx={{ mb: 2 }}
                />
              </Box>
            ) : (
              <Box>
                <TextField
                  margin="dense"
                  label="UPI ID"
                  name="upi"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={bankDetails.upi}
                  onChange={handleBankDetailsChange}
                  sx={{ mb: 2 }}
                />
              </Box>
            )}
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWithdrawDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleWithdrawRequest}
            variant="contained"
            sx={{
              bgcolor: palette.primary,
              color: palette.background,
              "&:hover": { bgcolor: palette.secondary },
            }}
            disabled={withdrawLoading || walletLoading}
          >
            {withdrawLoading ? (
              <CircularProgress size={24} sx={{ color: palette.background }} />
            ) : (
              "Request Withdraw"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Game History Section */}
      <Card sx={{ mt: 4, bgcolor: palette.card }}>
        <CardContent>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            textColor="inherit"
            indicatorColor="secondary"
            sx={{
              mb: 2,
              "& .MuiTab-root": { color: palette.text },
              "& .Mui-selected": { color: palette.secondary },
            }}
          >
            <Tab label="Recent Games" />
            <Tab label="Wins" />
            <Tab label="Losses" />
          </Tabs>

          <TableContainer component={Paper} sx={{ bgcolor: "transparent" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: palette.primary }}>Game</TableCell>
                  {activeTab === 0 && (
                    <TableCell sx={{ color: palette.primary }}>
                      Result
                    </TableCell>
                  )}
                  <TableCell sx={{ color: palette.primary }}>Bet</TableCell>
                  <TableCell sx={{ color: palette.primary }}>
                    {activeTab === 2 ? "Loss" : "Payout"}
                  </TableCell>
                  <TableCell sx={{ color: palette.primary }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gameHistory
                  .filter((game) =>
                    activeTab === 1
                      ? game.result === "win"
                      : activeTab === 2
                      ? game.result === "loss"
                      : true
                  )
                  .map((game) => (
                    <TableRow key={game.id}>
                      <TableCell sx={{ color: palette.text }}>
                        Game #{game.id}
                      </TableCell>
                      {activeTab === 0 && (
                        <TableCell>
                          <Chip
                            icon={getGameResultIcon(game.result)}
                            label={game.result}
                            color={getGameResultColor(game.result)}
                            size="small"
                          />
                        </TableCell>
                      )}
                      <TableCell sx={{ color: palette.text }}>
                        {formatCurrency(game.betAmount)}
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            color:
                              game.result === "win"
                                ? palette.success
                                : palette.danger,
                          }}
                        >
                          {game.result === "win" ? "+" : "-"}
                          {formatCurrency(game.payout || game.betAmount)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: palette.fadedText }}>
                        {formatDate(game.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;

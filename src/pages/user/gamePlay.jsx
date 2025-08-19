import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Box,
  Paper,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useMediaQuery,
  useTheme,
  TextField,
  CircularProgress,
  Grid,
} from "@mui/material";
import { MonetizationOn, AccessTime, History } from "@mui/icons-material";
import apiService from "../../services/apiService";
import socketService from "../../services/socketService";

const COLORS = {
  background: "#0f172a",
  primary: "#2563eb",
  text: "#FFFFFF",
  red: "#ef4444",
  green: "#22c55e",
  violet: "#8b5cf6",
};

const BET_OPTIONS = [
  { label: "Green", value: "green", color: COLORS.green, payout: 1.9 },
  { label: "Violet", value: "violet", color: COLORS.violet, payout: 3.3 },
  { label: "Red", value: "red", color: COLORS.red, payout: 1.9 },
];

const GAME_MODES = [
  { label: "WinGo 30sec", value: "30sec" },
  { label: "WinGo 1 Min", value: "1min" },
  { label: "WinGo 3 Min", value: "3min" },
  { label: "WinGo 5 Min", value: "5min" },
];

const MULTIPLIERS = ["X1", "X5", "X10", "X20", "X50", "X100"];

const PHASES = {
  BETTING: "betting",
  SPINNING: "spinning",
  RESULTS: "completed",
};

const WinGoGame = () => {
  const [round, setRound] = useState(null);
  const [timer, setTimer] = useState(0);
  const [betAmount, setBetAmount] = useState(10);
  const [selectedBet, setSelectedBet] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [confirmBetOpen, setConfirmBetOpen] = useState(false);
  const [pendingBet, setPendingBet] = useState(null);
  const [balance, setBalance] = useState(0);
  const [userId, setUserId] = useState(null);
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [gameMode, setGameMode] = useState("30sec");
  const [multiplier, setMultiplier] = useState("X1");
  const [betType, setBetType] = useState("color"); // 'color', 'bigSmall', or 'number'
  const [winningNumber, setWinningNumber] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [chosenNumber, setChosenNumber] = useState(""); // For number bet

  // On mount: get userId, connect to socket, request round, fetch balance
  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    const user = auth?.user?._id || auth?.user?.user?._id || auth?.user?.id;
    if (user) {
      setUserId(user);
      socketService.connect(user);

      const timeout = setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
          setSnackbar({
            open: true,
            message: "Connection timeout. Please refresh.",
            severity: "warning",
          });
        }
      }, 10000);

      return () => clearTimeout(timeout);
    } else {
      setSnackbar({
        open: true,
        message: "Please login to play",
        severity: "error",
      });
    }
  }, []);

  // --- ADDED: Refresh page 5 seconds after winningNumber is set ---
  useEffect(() => {
    if (winningNumber !== null) {
      const timeout = setTimeout(() => {
        window.location.reload();
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [winningNumber]);
  // --- END ADDED ---

  // Socket connection and listeners
  useEffect(() => {
    if (!userId) return;

    const handleConnect = () => {
      setConnectionStatus("connected");
      setIsLoading(false);
      socketService.getCurrentRound();
      fetchCurrentRound();
    };

    const handleDisconnect = () => {
      setConnectionStatus("disconnected");
      setSnackbar({
        open: true,
        message: "Connection lost. Trying to reconnect...",
        severity: "warning",
      });
    };

    const handleRoundUpdate = (data) => {
      setRound(data);
      updateTimerFromRound(data);
    };

    const handleRoundResultEvent = (data) => {
      setRound((prev) => ({ ...prev, ...data, status: PHASES.RESULTS }));
      setWinningNumber(data.resultNumber);
      handleRoundResult(data.resultNumber);
      updateGameHistory(data);
    };

    const handleGameTimeUpdate = (data) => {
      if (data.round) {
        setRound(data.round);
        updateTimerFromRound(data.round);
      } else if (data.timeLeft !== undefined) {
        setTimer(Math.max(0, data.timeLeft));
      }
    };

    const handleTimerUpdate = (data) => {
      if (data.timeLeft !== undefined) {
        setTimer(Math.max(0, data.timeLeft));
      }
    };

    const handleCurrentRound = (data) => {
      setRound(data);
      updateTimerFromRound(data);
      setIsLoading(false);
    };

    // Setup socket listeners
    socketService.on("connect", handleConnect);
    socketService.on("disconnect", handleDisconnect);
    socketService.on("round:update", handleRoundUpdate);
    socketService.on("round:result", handleRoundResultEvent);
    socketService.on("round:current", handleCurrentRound);
    socketService.on("game:time-update", handleGameTimeUpdate);
    socketService.on("timer:update", handleTimerUpdate);

    // Initial fetches
    refreshBalance();
    fetchGameHistory();

    return () => {
      socketService.off("connect", handleConnect);
      socketService.off("disconnect", handleDisconnect);
      socketService.off("round:update", handleRoundUpdate);
      socketService.off("round:result", handleRoundResultEvent);
      socketService.off("round:current", handleCurrentRound);
      socketService.off("game:time-update", handleGameTimeUpdate);
      socketService.off("timer:update", handleTimerUpdate);
    };
  }, [userId]);

  // Timer logic
  useEffect(() => {
    if (!round?.endTime) {
      setTimer(0);
      return;
    }

    const updateTimer = () => {
      const end = new Date(round.endTime).getTime();
      const now = Date.now();
      const timeLeft = Math.max(0, Math.floor((end - now) / 1000));
      setTimer(timeLeft);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [round?.endTime]);

  const fetchCurrentRound = async () => {
    try {
      const response = await apiService.getCurrentRound();
      setRound(response.round || response);
      setIsLoading(false);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to fetch game status",
        severity: "error",
      });
      setIsLoading(false);
    }
  };

  const refreshBalance = async () => {
    try {
      if (!userId) return;
      const res = await apiService.getWalletBalance();
      setBalance(res?.balance || res?.wallet?.balance || 0);
    } catch (err) {
      // ignore
    }
  };

  const fetchGameHistory = async () => {
    try {
      const res = await apiService.getGameHistory(1, 10);
      setGameHistory(res?.rounds || res?.history || res || []);
    } catch (err) {
      // ignore
    }
  };

  const updateGameHistory = (newRound) => {
    setGameHistory((prev) => [newRound, ...prev.slice(0, 9)]);
  };

  // --- REWRITE: Place bet using /api/game/place-bet and support color, number, size ---
  const handleConfirmBet = async () => {
    if (!pendingBet || !userId) {
      setConfirmBetOpen(false);
      return;
    }
    setIsPlacingBet(true);

    // Prepare bet payload
    let payload = {
      amount: betAmount * parseInt(multiplier.substring(1)),
    };
    if (betType === "color") {  
      payload.chosenColor = pendingBet.value;
    } else if (betType === "bigSmall") {
      payload.chosenSize = pendingBet.value;
    } else if (betType === "number") {
      payload.chosenNumber = chosenNumber;
    }

    try {
      // Use the new controller route
      const res = await apiService.placeBetOnCurrentRound(payload);
      setSelectedBet({
        ...pendingBet,
        amount: payload.amount,
        ...(betType === "number" ? { value: chosenNumber, label: `Number ${chosenNumber}` } : {}),
      });
      setConfirmBetOpen(false);
      setSnackbar({
        open: true,
        message: `Bet placed: ₹${payload.amount} on ${betType === "number" ? `Number ${chosenNumber}` : pendingBet.label}`,
        severity: "success",
      });
      refreshBalance();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.message || "Failed to place bet",
        severity: "error",
      });
    } finally {
      setIsPlacingBet(false);
      setConfirmBetOpen(false);
    }
  };

  // --- END REWRITE ---

  const handleRoundResult = (resultNumber) => {
    if (!selectedBet) return;

    // Determine if bet won based on result number
    let isWin = false;
    if (betType === "color") {
      if (selectedBet.value === "green" && resultNumber === 5) {
        isWin = true;
      } else if (
        selectedBet.value === "violet" &&
        [1, 3, 7, 9].includes(resultNumber)
      ) {
        isWin = true;
      } else if (
        selectedBet.value === "red" &&
        [0, 2, 4, 6, 8].includes(resultNumber)
      ) {
        isWin = true;
      }
    } else if (betType === "bigSmall") {
      if (
        (selectedBet.value === "big" && resultNumber >= 5) ||
        (selectedBet.value === "small" && resultNumber < 5)
      ) {
        isWin = true;
      }
    } else if (betType === "number") {
      if (parseInt(selectedBet.value) === resultNumber) {
        isWin = true;
      }
    }

    if (isWin) {
      const winAmount = Math.round(selectedBet.amount * (selectedBet.payout || 9)); // payout for number is 9x
      setSnackbar({
        open: true,
        message: `You won ₹${winAmount}!`,
        severity: "success",
      });
    } else {
      setSnackbar({
        open: true,
        message: `You lost ₹${selectedBet.amount}.`,
        severity: "error",
      });
    }
    setSelectedBet(null);
    refreshBalance();
  };

  const updateTimerFromRound = (roundData) => {
    if (!roundData?.endTime) return;
    const end = new Date(roundData.endTime).getTime();
    const now = Date.now();
    const timeLeft = Math.max(0, Math.floor((end - now) / 1000));
    setTimer(timeLeft);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const formatINR = (amount) => `₹${amount?.toLocaleString() || "0"}`;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (isLoading) {
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
          {connectionStatus === "disconnected"
            ? "Connecting to game server..."
            : "Loading game status..."}
        </Typography>
      </Box>
    );
  }

  // --- Number bet options for UI ---
  const NUMBER_OPTIONS = Array.from({ length: 10 }, (_, i) => ({
    label: i.toString(),
    value: i.toString(),
    color: COLORS.primary,
    payout: 9,
  }));

  return (
    <Box
      sx={{
        backgroundColor: COLORS.background,
        minHeight: "100vh",
        color: COLORS.text,
        p: 2,
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: COLORS.primary }}
          ></Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              size="small"
              sx={{ backgroundColor: COLORS.primary }}
            >
              Withdraw
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{ backgroundColor: COLORS.green }}
            >
              Deposit
            </Button>
          </Box>
        </Box>

        <Typography
          variant="body2"
          sx={{ color: "#94a3b8", mb: 3 }}
        ></Typography>

        {/* Game Modes */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={1}>
            {GAME_MODES.map((mode) => (
              <Grid item xs={6} sm={3} key={mode.value}>
                <Button
                  fullWidth
                  variant={gameMode === mode.value ? "contained" : "outlined"}
                  onClick={() => setGameMode(mode.value)}
                  sx={{
                    py: 1,
                    backgroundColor:
                      gameMode === mode.value ? COLORS.primary : "transparent",
                    color: gameMode === mode.value ? "white" : COLORS.text,
                    borderColor: COLORS.primary,
                  }}
                >
                  {mode.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Game Status */}
        <Paper
          sx={{
            p: 2,
            mb: 3,
            backgroundColor: "#1e293b",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
            {round?.status === PHASES.BETTING
              ? "Place Your Bets"
              : round?.status === PHASES.SPINNING
              ? "Spinning..."
              : "Round Completed"}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            <AccessTime sx={{ color: COLORS.primary }} />
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {formatTime(timer)}
            </Typography>
          </Box>

          {round?.status === PHASES.RESULTS && winningNumber !== null && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Winning Number:</Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  color: ['1', '3', '7', '9'].includes(winningNumber)
                    ? "green"
                    : ['2', '4', '6', '8'].includes(winningNumber)
                    ? "red"
                    : ['0','5'].includes(winningNumber) ? "violet" : null,
                }}
              >
                {winningNumber}
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Game ID */}
        <Typography
          variant="body2"
          sx={{ color: "#94a3b8", textAlign: "center", mb: 3 }}
        >
          Game ID: {round?._id || "Loading..."}
        </Typography>

        {/* Betting Area */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 3,
          }}
        >
          {/* Left Panel - Color/Number/BigSmall Selection */}
          <Paper
            sx={{
              flex: 1,
              p: 2,
              backgroundColor: "#1e293b",
              borderRadius: "8px",
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}
            >
              Select Color
            </Typography>

            <Grid container spacing={2}>
              {BET_OPTIONS.map((bet) => (
                <Grid item xs={4} key={bet.value}>
                  <Button
                    fullWidth
                    variant={
                      selectedBet?.value === bet.value && betType === "color"
                        ? "contained"
                        : "outlined"
                    }
                    onClick={() => {
                      if (round?.status !== PHASES.BETTING || selectedBet)
                        return;
                      setPendingBet(bet);
                      setConfirmBetOpen(true);
                      setBetType("color");
                    }}
                    disabled={round?.status !== PHASES.BETTING || !!selectedBet}
                    sx={{
                      py: 3,
                      backgroundColor: bet.color,
                      color: "white",
                      borderColor: bet.color,
                      "&:hover": {
                        backgroundColor: bet.color,
                        color: "white",
                      },
                    }}
                  >
                    {bet.label}
                  </Button>
                </Grid>
              ))}
            </Grid>

            <Typography
              variant="h6"
              sx={{ mt: 3, mb: 2, fontWeight: "bold", textAlign: "center" }}
            >
              Big/Small
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant={
                    selectedBet?.value === "big" && betType === "bigSmall"
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() => {
                    if (round?.status !== PHASES.BETTING || selectedBet) return;
                    setPendingBet({
                      label: "Big",
                      value: "big",
                      color: "#ffaa57",
                      payout: 1.9,
                    });
                    setConfirmBetOpen(true);
                    setBetType("bigSmall");
                  }}
                  disabled={round?.status !== PHASES.BETTING || !!selectedBet}
                  sx={{
                    py: 2,
                    backgroundColor: "#ffaa57",
                    color: "white",
                    borderColor: "#ffaa57",
                    "&:hover": {
                      backgroundColor: "#ffaa57",
                      color: "white",
                    },
                  }}
                >
                  Big
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant={
                    selectedBet?.value === "small" && betType === "bigSmall"
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() => {
                    if (round?.status !== PHASES.BETTING || selectedBet) return;
                    setPendingBet({
                      label: "Small",
                      value: "small",
                      color: "#6ea7f4",
                      payout: 1.9,
                    });
                    setConfirmBetOpen(true);
                    setBetType("bigSmall");
                  }}
                  disabled={round?.status !== PHASES.BETTING || !!selectedBet}
                  sx={{
                    py: 2,
                    backgroundColor: "#6ea7f4",
                    color: "white",
                    borderColor: "#6ea7f4",
                    "&:hover": {
                      backgroundColor: "#6ea7f4",
                      color: "white",
                    },
                  }}
                >
                  Small
                </Button>
              </Grid>
            </Grid>

            {/* Number Bet */}
            <Typography
              variant="h6"
              sx={{ mt: 3, mb: 2, fontWeight: "bold", textAlign: "center" }}
            >
              Number
            </Typography>
            <Grid container spacing={1}>
              {NUMBER_OPTIONS.map((num) => (
                <Grid
                  item
                  xs={2.4}
                  sm={1.2}
                  md={1.2}
                  key={num.value}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Button
                    variant={
                      selectedBet?.value === num.value && betType === "number"
                        ? "contained"
                        : "outlined"
                    }
                    onClick={() => {
                      if (round?.status !== PHASES.BETTING || selectedBet)
                        return;
                      setPendingBet({
                        label: num.label,
                        value: num.value,
                        color: num.color,
                        payout: num.payout,
                      });
                      setChosenNumber(num.value);
                      setConfirmBetOpen(true);
                      setBetType("number");
                    }}
                    disabled={round?.status !== PHASES.BETTING || !!selectedBet}
                    sx={{
                      py: 0,
                      minWidth: 0,
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      backgroundColor: (() => {
                        if (['1', '3', '7', '9'].includes(num.value)) return "green";
                        if (['2', '4', '6', '8'].includes(num.value)) return "red";
                        if (['0', '5'].includes(num.value)) return "violet";
                        return num.color;
                      })(),
                      color: "white",
                      borderColor: (() => {
                        if (['1', '3', '7', '9'].includes(num.value)) return "green";
                        if (['2', '4', '6', '8'].includes(num.value)) return "red";
                        if (['0', '5'].includes(num.value)) return "violet";
                        return num.color;
                      })(),
                      fontWeight:
                        selectedBet?.value === num.value && betType === "number"
                          ? "bold"
                          : "normal",
                      fontSize: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow:
                        selectedBet?.value === num.value && betType === "number"
                          ? "0 0 0 2px #fff, 0 0 8px 2px #fff"
                          : undefined,
                      "&:hover": {
                        backgroundColor: (() => {
                          if (['1', '3', '7', '9'].includes(num.value)) return "#008000cc";
                          if (['2', '4', '6', '8'].includes(num.value)) return "#ff0000cc";
                          if (['0', '5'].includes(num.value)) return "#8f00ffcc";
                          return `${num.color}cc`;
                        })(),
                        color: "white",
                      },
                    }}
                  >
                    {num.label}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Right Panel - Bet Controls */}
          <Paper
            sx={{
              width: isMobile ? "100%" : 300,
              p: 2,
              backgroundColor: "#1e293b",
              borderRadius: "8px",
            }}
          >
            {/* Balance */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography>Balance:</Typography>
              <Typography sx={{ fontWeight: "bold" }}>
                {formatINR(balance)}
              </Typography>
            </Box>

            {/* Bet Amount */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ mb: 1 }}>Bet Amount:</Typography>
              <TextField
                fullWidth
                type="number"
                value={betAmount}
                onChange={(e) => {
                  const val = Math.max(1, Math.floor(Number(e.target.value)));
                  setBetAmount(isNaN(val) ? 1 : val);
                }}
                inputProps={{ min: 1, step: 1 }}
                sx={{
                  "& .MuiInputBase-input": {
                    color: "white",
                    background: "#334155",
                    borderRadius: 1,
                    p: 1,
                  },
                }}
                variant="outlined"
                disabled={round?.status !== PHASES.BETTING || !!selectedBet}
              />
            </Box>

            {/* Multipliers */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ mb: 1 }}>Multiplier:</Typography>
              <Grid container spacing={1}>
                {MULTIPLIERS.map((mult) => (
                  <Grid item xs={4} key={mult}>
                    <Button
                      fullWidth
                      variant={multiplier === mult ? "contained" : "outlined"}
                      onClick={() => setMultiplier(mult)}
                      disabled={
                        round?.status !== PHASES.BETTING || !!selectedBet
                      }
                      sx={{
                        py: 1,
                        backgroundColor:
                          multiplier === mult ? COLORS.primary : "transparent",
                        color: multiplier === mult ? "white" : COLORS.text,
                        borderColor: COLORS.primary,
                      }}
                    >
                      {mult}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Current Bet */}
            {selectedBet && (
              <Paper
                sx={{
                  p: 2,
                  mb: 2,
                  backgroundColor: "#334155",
                  borderRadius: "8px",
                }}
              >
                <Typography sx={{ fontWeight: "bold" }}>Your Bet:</Typography>
                <Typography>
                  {betType === "number"
                    ? `Number ${selectedBet.value}`
                    : selectedBet.label}{" "}
                  ({formatINR(selectedBet.amount)})
                </Typography>
              </Paper>
            )}
          </Paper>
        </Box>

        {/* Bet Confirmation Dialog */}
        <Dialog
          open={confirmBetOpen}
          onClose={() => setConfirmBetOpen(false)}
          PaperProps={{
            sx: {
              backgroundColor: "#1e293b",
              color: COLORS.text,
            },
          }}
        >
          <DialogTitle>Confirm Bet</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Place {formatINR(betAmount * parseInt(multiplier.substring(1)))}{" "}
              on{" "}
              <span style={{ color: pendingBet?.color }}>
                {betType === "number"
                  ? `Number ${chosenNumber}`
                  : pendingBet?.label}
              </span>
              ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBetOpen(false)}>Cancel</Button>
            <Button
              onClick={handleConfirmBet}
              color="primary"
              autoFocus
              disabled={isPlacingBet}
            >
              {isPlacingBet ? "Placing..." : "Confirm"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar Notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
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

export default WinGoGame;

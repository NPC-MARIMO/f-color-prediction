import React, { useState, useEffect, useRef } from "react";
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
} from "@mui/material";
import { MonetizationOn, AccessTime } from "@mui/icons-material";
import apiService from "../../services/apiService";
import socketService from "../../services/socketService";

const COLORS = {
  background: "#121212",
  primary: "#D4AF37",
  text: "#FFFFFF",
  red: "#E11D48",
  green: "#10B981",
  blue: "#3B82F6",
};

const BET_OPTIONS = [
  { label: "RED", value: "red", color: COLORS.red, payout: 1.9 },
  { label: "GREEN", value: "green", color: COLORS.green, payout: 1.9 },
  { label: "BLUE", value: "blue", color: COLORS.blue, payout: 1.9 },
];

const PHASES = {
  BETTING: "betting",
  SPINNING: "spinning",
  RESULTS: "completed",
};
const SPIN_DURATION = 1;

const RouletteGame = () => {
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
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelTransition, setWheelTransition] = useState("none");
  const prevTargetRef = useRef(0);
  const [balance, setBalance] = useState(0);
  const [userId, setUserId] = useState(null);
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const pendingResultRef = useRef(null);
  const refreshTimeoutRef = useRef(null);
  const [isContinuousSpinning, setIsContinuousSpinning] = useState(false);
  const enableBettingTimeoutRef = useRef(null);
  const [winningColor, setWinningColor] = useState(null);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
      if (enableBettingTimeoutRef.current)
        clearTimeout(enableBettingTimeoutRef.current);
    };
  }, []);

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

  // Socket connection and listeners
  useEffect(() => {
    if (!userId) return;

    const handleConnect = () => {
      console.log("Socket connected");
      setConnectionStatus("connected");
      setIsLoading(false);
      socketService.getCurrentRound();
      fetchCurrentRound();
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
      setConnectionStatus("disconnected");
      setSnackbar({
        open: true,
        message: "Connection lost. Trying to reconnect...",
        severity: "warning",
      });
    };

    const checkConnectionStatus = () => {
      const isConnected = socketService.getConnectionStatus();
      if (isConnected) {
        setConnectionStatus("connected");
        setIsLoading(false);
        socketService.getCurrentRound();
        fetchCurrentRound();
      } else {
        setConnectionStatus("disconnected");
      }
    };

    checkConnectionStatus();

    const handleRoundUpdate = (data) => {
      console.log("[SOCKET] round:update event received:", data);
      setRound(data);
      updateTimerFromRound(data);

      // Clear any existing timeouts
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
      if (enableBettingTimeoutRef.current) {
        clearTimeout(enableBettingTimeoutRef.current);
        enableBettingTimeoutRef.current = null;
      }

      if (data.status === PHASES.SPINNING) {
        setIsContinuousSpinning(true);
        setIsSpinning(true);
      } else if (data.status === PHASES.RESULTS) {
        // When status changes to completed, stop spinning
        setIsContinuousSpinning(false);
        setIsSpinning(false);
        setWheelTransition("none");

  
        // Enable betting for next round 30 seconds after completion
        enableBettingTimeoutRef.current = setTimeout(() => {
          console.log("Enabling betting for next round");
          setSelectedBet(null); // Clear previous bet
        }, 30000);
      } else if (data.status === PHASES.BETTING) {
        setWinningColor(null); // Reset color transition for new round
        // Clear any pending timeouts if we're back to betting phase
        if (refreshTimeoutRef.current) {
          clearTimeout(refreshTimeoutRef.current);
          refreshTimeoutRef.current = null;
        }
        if (enableBettingTimeoutRef.current) {
          clearTimeout(enableBettingTimeoutRef.current);
          enableBettingTimeoutRef.current = null;
        }
      }
    };

    const showResultAfterSpin = (resultData) => {
      setRound((prev) => ({ ...prev, ...resultData, status: PHASES.RESULTS }));
      setWinningColor(resultData.resultColor); // Set winning color for transition
      updateTimerFromRound(resultData);
      handleRoundResult(resultData.resultColor);
    };

    const handleRoundResultEvent = (data) => {
      console.log("[SOCKET] round:result event received:", data);
      if (isSpinning) {
        pendingResultRef.current = data;
      } else {
        showResultAfterSpin(data);
      }
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
    fetchHistory();

    // Periodic connection status check
    const connectionCheckInterval = setInterval(() => {
      const isConnected = socketService.updateConnectionStatus();
      if (isConnected && connectionStatus === "disconnected") {
        setConnectionStatus("connected");
      } else if (!isConnected && connectionStatus === "connected") {
        setConnectionStatus("disconnected");
      }
    }, 3000);

    return () => {
      clearInterval(connectionCheckInterval);
      socketService.off("connect", handleConnect);
      socketService.off("disconnect", handleDisconnect);
      socketService.off("round:update", handleRoundUpdate);
      socketService.off("round:result", handleRoundResultEvent);
      socketService.off("round:current", handleCurrentRound);
      socketService.off("game:time-update", handleGameTimeUpdate);
      socketService.off("timer:update", handleTimerUpdate);
    };
  }, [userId]);

  // Fetch current round status
  const fetchCurrentRound = async () => {
    try {
      console.log("Fetching current round via API...");
      const response = await apiService.getCurrentRound();
      console.log("API response for current round:", response);
      setRound(response.round || response);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching current round:", err);
      setSnackbar({
        open: true,
        message: "Failed to fetch game status",
        severity: "error",
      });
      setIsLoading(false);
    }
  };

  // Timer logic
  useEffect(() => {
    console.log("Timer effect triggered with round:", round);
    console.log("Round endTime:", round?.endTime);

    if (!round?.endTime) {
      console.log("No endTime found, clearing timer");
      setTimer(0);
      return;
    }

    const updateTimer = () => {
      const end = new Date(round.endTime).getTime();
      const now = Date.now();
      const timeLeft = Math.max(0, Math.floor((end - now) / 1000));
      setTimer(timeLeft);
    };

    // Set initial timer
    updateTimer();

    // Start interval
    const interval = setInterval(updateTimer, 1000);

    console.log("Timer interval started for round:", round._id || "unknown");

    return () => {
      console.log("Clearing timer interval");
      clearInterval(interval);
    };
  }, [round?.endTime, round?._id]);

  // When round status is completed, wait 25 seconds and then refresh the page
  useEffect(() => {
    if (round?.status === PHASES.RESULTS) {
      const timeout = setTimeout(() => {
        window.location.reload();
      }, 30000  );
      return () => clearTimeout(timeout);
    }
  }, [round?.status]);

  // Fetch wallet balance
  const refreshBalance = async () => {
    try {
      if (!userId) return;
      const res = await apiService.getWalletBalance();
      setBalance(res?.balance || res?.wallet?.balance || 0);
    } catch (err) {
      console.error("Error refreshing balance:", err);
    }
  };

  // Fetch round history
  const fetchHistory = async () => {
    try {
      if (!userId) return;
      const res = await apiService.getGameHistory(1, 10);
      const history = res?.rounds || res?.history || res || [];
      console.log("[BACKEND] Game history:", history);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to fetch history",
        severity: "error",
      });
      console.error("Error fetching history:", err);
    }
  };

  // Place bet
  const handleConfirmBet = async () => {
    if (!pendingBet || !userId) {
      setConfirmBetOpen(false);
      return;
    }
    setIsPlacingBet(true);
    try {
      await apiService.placeColorBet({
        chosenColor: pendingBet.value,
        amount: betAmount,
      });
      setSelectedBet({ ...pendingBet, amount: betAmount });
      setConfirmBetOpen(false);
      setSnackbar({
        open: true,
        message: `Bet placed: ₹${betAmount} on ${pendingBet.label}`,
        severity: "success",
      });
      refreshBalance();
      // Call fetchCurrentRound after 2 seconds
      setTimeout(() => {
        fetchCurrentRound();
      }, 2000);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to place bet",
        severity: "error",
      });
    } finally {
      setIsPlacingBet(false);
      setConfirmBetOpen(false);
    }
  };

  // Handle round result
  const handleRoundResult = (resultColor) => {
    if (!selectedBet) return;
    if (selectedBet.value === resultColor) {
      const winAmount = Math.round(selectedBet.amount * selectedBet.payout);
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

  // Wheel animation
  const triggerWheelAnimation = (resultColor) => {
    console.log("triggerWheelAnimation called with resultColor:", resultColor);
    console.log("Current isSpinning state:", isSpinning);

    const colorToAngle = { red: 0, green: 120, blue: 240 };
    const spins = 5;
    const targetAngle = colorToAngle[resultColor];
    const currentRotation = prevTargetRef.current % 360;
    const delta = (360 + targetAngle - currentRotation) % 360;
    const target = prevTargetRef.current + spins * 360 + delta;

    console.log(
      "Wheel animation - current rotation:",
      prevTargetRef.current,
      "target:",
      target
    );

    setWheelTransition("none");
    setWheelRotation(prevTargetRef.current);
    setTimeout(() => {
      setWheelTransition(
        `transform ${SPIN_DURATION}s cubic-bezier(.17,.67,.83,.67)`
      );
      setWheelRotation(target);
      console.log(
        "Wheel animation started, will complete in",
        SPIN_DURATION,
        "seconds"
      );
      setTimeout(() => {
        console.log("Wheel animation completed");
        setIsSpinning(false);
        prevTargetRef.current = target;
        if (pendingResultRef.current) {
          showResultAfterSpin(pendingResultRef.current);
          pendingResultRef.current = null;
        }
      }, SPIN_DURATION * 1000);
    }, 20);
  };

  // Timer helper
  const updateTimerFromRound = (roundData) => {
    console.log("updateTimerFromRound called with:", roundData);
    if (!roundData?.endTime) {
      console.log("No endTime in roundData, skipping timer update");
      return;
    }
    const end = new Date(roundData.endTime).getTime();
    const now = Date.now();
    const timeLeft = Math.max(0, Math.floor((end - now) / 1000));
    console.log(
      "updateTimerFromRound - endTime:",
      roundData.endTime,
      "timeLeft:",
      timeLeft
    );
    setTimer(timeLeft);
  };

  const formatINR = (amount) => `₹${amount?.toLocaleString() || "0"}`;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Loading state
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
        <Button
          variant="outlined"
          onClick={() => {
            setIsLoading(false);
            fetchCurrentRound();
          }}
          sx={{ color: COLORS.primary, borderColor: COLORS.primary }}
        >
          Skip Loading
        </Button>
      </Box>
    );
  }

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
        {/* Connection Status */}
        <Paper
          sx={{
            p: 1,
            mb: 2,
            backgroundColor:
              connectionStatus === "connected" ? "#1E1E1E" : "#2D1B1B",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: "8px",
            border: `1px solid ${
              connectionStatus === "connected" ? COLORS.green : COLORS.red
            }`,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color:
                connectionStatus === "connected" ? COLORS.green : COLORS.red,
            }}
          >
            {connectionStatus === "connected"
              ? "🟢 Connected"
              : "🔴 Disconnected"}
          </Typography>
          <Button
            size="small"
            onClick={fetchCurrentRound}
            sx={{ color: COLORS.primary }}
          >
            Refresh
          </Button>
        </Paper>

        {/* Debug Info */}
        {process.env.NODE_ENV === "development" && (
          <Paper
            sx={{
              p: 1,
              mb: 2,
              backgroundColor: "#2D1B1B",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          >
            <Typography variant="caption" sx={{ color: "#AAA" }}>
              Debug: Round ID: {round?._id || "none"} | Status:{" "}
              {round?.status || "none"} | EndTime: {round?.endTime || "none"} |
              Timer: {timer}s
            </Typography>
          </Paper>
        )}

        {/* Game Status Bar */}
        <Paper
          sx={{
            p: 2,
            mb: 3,
            backgroundColor: "#1E1E1E",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: COLORS.primary }}
            >
              {round?.status === PHASES.BETTING
                ? "BETTING PHASE"
                : round?.status === PHASES.SPINNING
                ? "SPINNING"
                : "RESULTS"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#AAA" }}>
              {round?.status === PHASES.BETTING
                ? "Place your bet now!"
                : round?.status === PHASES.SPINNING
                ? "Wheel is spinning..."
                : round?.resultColor
                ? `Winner: ${round.resultColor.toUpperCase()}`
                : "Calculating results..."}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AccessTime sx={{ color: COLORS.primary }} />
            <Typography variant="h6" sx={{ color: COLORS.primary }}>
              {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
            </Typography>
            <Button
              size="small"
              onClick={() => {
                console.log("Manual timer refresh clicked");
                if (round?.endTime) {
                  updateTimerFromRound(round);
                }
              }}
              sx={{ color: COLORS.primary, minWidth: "auto", p: 0.5 }}
            >
              🔄
            </Button>
          </Box>
        </Paper>

        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 3,
          }}
        >
          {/* Wheel Area */}
          <Paper
            sx={{
              flex: 1,
              p: 3,
              backgroundColor: "#1E1E1E",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold", color : "#fff" }}>
              COLOR WHEEL
            </Typography>
            {/* Wheel Visualization */}
            <Box sx={{ position: "relative", width: 320, height: 320, mb: 4 }}>
              {/* Pointer */}
              <Box
                sx={{
                  position: "absolute",
                  top: -18,
                  left: "calc(50% - 18px)",
                  width: 0,
                  height: 0,
                  borderLeft: "18px solid transparent",
                  borderRight: "18px solid transparent",
                  borderBottom: `32px solid ${COLORS.primary}`,
                  zIndex: 3,
                  filter: "drop-shadow(0 0 5px rgba(212, 175, 55, 0.8))",
                }}
              />
              <svg
                width="320"
                height="320"
                viewBox="0 0 320 320"
                style={{
                  transform: isContinuousSpinning
                    ? undefined // handled by CSS class
                    : `rotate(${wheelRotation}deg)`,
                  transition: isContinuousSpinning
                    ? undefined
                    : wheelTransition,
                  zIndex: 2,
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
                className={isContinuousSpinning ? "wheel-spin-infinite" : ""}
              >
                {/* Red sector */}
                <path
                  d="M160,160 L160,20 A140,140 0 0,1 280.62,230.62 Z"
                  fill={winningColor ? COLORS[winningColor] : COLORS.red}
                  className={winningColor ? "wheel-sector-transition" : ""}
                  stroke="#fff"
                  strokeWidth="2"
                />
                {/* Green sector */}
                <path
                  d="M160,160 L280.62,230.62 A140,140 0 0,1 39.38,230.62 Z"
                  fill={winningColor ? COLORS[winningColor] : COLORS.green}
                  className={winningColor ? "wheel-sector-transition" : ""}
                  stroke="#fff"
                  strokeWidth="2"
                />
                {/* Blue sector */}
                <path
                  d="M160,160 L39.38,230.62 A140,140 0 0,1 160,20 Z"
                  fill={winningColor ? COLORS[winningColor] : COLORS.blue}
                  className={winningColor ? "wheel-sector-transition" : ""}
                  stroke="#fff"
                  strokeWidth="2"
                />
                {/* Center circle */}
                <circle cx="160" cy="160" r="40" fill={COLORS.primary} />
                {/* Labels */}
                <text
                  x="160"
                  y="45"
                  textAnchor="middle"
                  fill="white"
                  fontWeight="bold"
                >
                  RED
                </text>
                <text
                  x="265"
                  y="245"
                  textAnchor="middle"
                  fill="white"
                  fontWeight="bold"
                >
                  GREEN
                </text>
                <text
                  x="55"
                  y="245"
                  textAnchor="middle"
                  fill="white"
                  fontWeight="bold"
                >
                  BLUE
                </text>
              </svg>
            </Box>
            {/* Results Display */}
            {round?.status === PHASES.RESULTS && round?.resultColor && (
              <Box
                sx={{
                  p: 2,
                  width: "100%",
                  backgroundColor: COLORS[round.resultColor],
                  borderRadius: "8px",
                  textAlign: "center",
                  mb: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "white" }}
                >
                  WINNER: {round.resultColor.toUpperCase()}
                </Typography>
              </Box>
            )}
          </Paper>
          {/* Betting Area */}
          <Paper
            sx={{
              width: isMobile ? "100%" : 350,
              p: 3,
              backgroundColor: "#1E1E1E",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold" , color:"#fff"}}>
              PLACE YOUR BET
            </Typography>
            {/* Balance Display */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
                p: 2,
                backgroundColor: "rgba(212, 175, 55, 0.1)",
                borderRadius: "8px",
                border: `1px solid ${COLORS.primary}`,
              }}
            >
              <Typography sx={{ color: "#AAA" }}>BALANCE:</Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <MonetizationOn sx={{ color: COLORS.primary, mr: 1 }} />
                <Typography sx={{ fontWeight: "bold", color: COLORS.primary }}>
                  {formatINR(balance)}
                </Typography>
              </Box>
            </Box>
            {/* Bet Amount Input */}
            <Box sx={{ mb: 4 }}>
              <Typography sx={{ mb: 1.5, color: "#AAA" }}>
                BET AMOUNT:
              </Typography>
              <TextField
                type="number"
                value={betAmount}
                onChange={(e) => {
                  const val = Math.max(1, Math.floor(Number(e.target.value)));
                  setBetAmount(isNaN(val) ? 1 : val);
                }}
                inputProps={{ min: 1, step: 1 }}
                sx={{
                  width: "100%",
                  "& .MuiInputBase-input": {
                    color: "#fff",
                    fontWeight: "bold",
                    background: "#222",
                    borderRadius: 1,
                    p: 1,
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: COLORS.primary,
                    },
                    "&:hover fieldset": {
                      borderColor: COLORS.primary,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: COLORS.primary,
                    },
                  },
                }}
                variant="outlined"
                placeholder="Enter amount"
                disabled={round?.status !== PHASES.BETTING || !!selectedBet}
                error={betAmount > balance}
                helperText={betAmount > balance ? "Insufficient balance" : " "}
              />
            </Box>
            {/* Color Selection */}
            <Box sx={{ mb: 4 }}>
              <Typography sx={{ mb: 1.5, color: "#AAA" }}>
                SELECT COLOR:
              </Typography>
              <Box sx={{ display: "grid", gap: 1.5 }}>
                {BET_OPTIONS.map((bet) => (
                  <Button
                    key={bet.value}
                    variant={
                      selectedBet?.value === bet.value
                        ? "contained"
                        : "outlined"
                    }
                    onClick={() => {
                      if (round?.status !== PHASES.BETTING || selectedBet)
                        return;
                      setPendingBet(bet);
                      setConfirmBetOpen(true);
                    }}
                    disabled={
                      round?.status !== PHASES.BETTING ||
                      (!!selectedBet && round?.status === PHASES.BETTING) || // Only disable if in betting phase and already has bet
                      betAmount > balance
                    }
                    sx={{
                      py: 2,
                      justifyContent: "space-between",
                      backgroundColor:
                        selectedBet?.value === bet.value
                          ? bet.color
                          : "transparent",
                      color:
                        selectedBet?.value === bet.value ? "white" : bet.color,
                      borderColor: bet.color,
                      "&:hover": {
                        backgroundColor: `${bet.color}20`,
                      },
                    }}
                  >
                    <span>{bet.label}</span>
                    <span>1.9x</span>
                  </Button>
                ))}
              </Box>
            </Box>
            {/* Current Bet Display */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
                p: 2,
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                borderRadius: "8px",
              }}
            >
              <Typography sx={{ color: "#AAA" }}>YOUR BET:</Typography>
              <Typography sx={{ fontWeight: "bold", color : "#fff" }}>
                {selectedBet
                  ? `${selectedBet.label} (${formatINR(selectedBet.amount)})`
                  : "None"}
              </Typography>
            </Box>
          </Paper>
        </Box>
        {/* Bet Confirmation Dialog */}
        <Dialog
          open={confirmBetOpen}
          onClose={() => setConfirmBetOpen(false)}
          PaperProps={{
            sx: {
              backgroundColor: "#1E1E1E",
              color: COLORS.text,
              border: `1px solid ${COLORS.primary}`,
            },
          }}
        >
          <DialogTitle>Confirm Bet</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Place {formatINR(betAmount)} on{" "}
              <span style={{ color: pendingBet?.color }}>
                {pendingBet?.label}
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

export default RouletteGame;

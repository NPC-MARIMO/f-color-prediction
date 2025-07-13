import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Divider,
} from "@mui/material";
import { User, Lock, Eye, EyeOff, Sword } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Login } from "../../store/features/auth/authFeatures";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get auth state from Redux
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  // Navigate to profile if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/user/profile");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    if (localError) setLocalError("");
  };

  const onSwitchToSignup = () => {
    navigate("/auth/register");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation
      if (!formData.email || !formData.password) {
      setLocalError("Please fill in all fields");
        return;
      }

      if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setLocalError("Please enter a valid email address");
        return;
      }

    try {
      const result = await dispatch(Login({
        email: formData.email,
        password: formData.password
      }));
      
      if (Login.fulfilled.match(result)) {
        // Navigation will be handled by useEffect when isAuthenticated becomes true
      } else {
        setLocalError(result.payload?.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setLocalError("Login failed. Please try again.");
    }
  };

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 450,
        background:
          "linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(26, 26, 26, 0.85) 100%)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(212, 175, 55, 0.4)",
        boxShadow: "0 8px 40px rgba(212, 175, 55, 0.2)",
        borderRadius: 3,
        overflow: "hidden",
        color: "#ffffff", // Added white text color
      }}
    >
      <Box
        sx={{
          background: "rgba(212, 175, 55, 0.1)",
          py: 2,
          textAlign: "center",
          borderBottom: "1px solid rgba(212, 175, 55, 0.3)",
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 700,
            color: "#D4AF37",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Sword size={24} />
          Welcome Back, Adventurer
        </Typography>
      </Box>

      <CardContent sx={{ p: 4, pt: 3, color: "#ffffff" }}>
        {" "}
        {/* Added white text color */}
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange("email")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <User size={20} color="#D4AF37" />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  color: "#ffffff", // Added white text color for input
                  "& fieldset": {
                    borderColor: "rgba(212, 175, 55, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(212, 175, 55, 0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#D4AF37",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#D4AF37",
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange("password")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={20} color="#D4AF37" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: "rgba(212, 175, 55, 0.7)" }}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#ffffff", // Added white text color for input
                  "& fieldset": {
                    borderColor: "rgba(212, 175, 55, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(212, 175, 55, 0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#D4AF37",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#D4AF37",
                },
              }}
            />
          </Box>

          {(error || localError) && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                bgcolor: "rgba(211, 47, 47, 0.1)",
                color: "#ffffff", // Changed to white text
                border: "1px solid rgba(211, 47, 47, 0.3)",
              }}
            >
              {error || localError}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mb: 2,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
              bgcolor: "#D4AF37",
              color: "#1A1A1A",
              "&:hover": {
                bgcolor: "rgba(212, 175, 55, 0.8)",
              },
              "&:disabled": {
                bgcolor: "rgba(212, 175, 55, 0.5)",
                color: "rgba(26, 26, 26, 0.7)",
              },
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: "#1A1A1A" }} />
                Entering the Realm...
              </>
            ) : (
              "Enter the Realm"
            )}
          </Button>

          <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
            <Divider
              sx={{ flexGrow: 1, borderColor: "rgba(212, 175, 55, 0.2)" }}
            />
            <Typography
              variant="caption"
              sx={{ px: 2, color: "#ffffff" }} // Changed to white text
            >
              OR
            </Typography>
            <Divider
              sx={{ flexGrow: 1, borderColor: "rgba(212, 175, 55, 0.2)" }}
            />
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="body2"
              sx={{ color: "#ffffff" }} // Changed to white text
            >
              New to the realm?{" "}
              <Link
                component="button"
                type="button"
                onClick={onSwitchToSignup}
                sx={{
                  color: "#D4AF37",
                  textDecoration: "none",
                  fontWeight: 600,
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Create Your Legend
              </Link>
            </Typography>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;

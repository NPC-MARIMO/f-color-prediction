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
import { User, Mail, Lock, Eye, EyeOff, ScrollText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SendOtp, VerifyOtp, Register } from "../../store/features/auth/authFeatures";

const SignupForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get auth state from Redux
  const { loading, error, isAuthenticated, verified } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  // Debug: Log the auth state
  useEffect(() => {
    console.log('Auth state:', { isAuthenticated, loading, error, verified });
  }, [isAuthenticated, loading, error, verified]);

  // Navigate to profile if already authenticated
  useEffect(() => {
    console.log('Checking authentication, isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      console.log('Redirecting to /user/profile');
      navigate("/user/profile");
    }
  }, [isAuthenticated, navigate]);

  // Temporary cleanup - remove this after testing
  useEffect(() => {
    // Clear any existing auth data for testing
    localStorage.removeItem('auth');
    console.log('Cleared localStorage auth data');
    console.log();
  }, []);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    if (localError) setLocalError("");
  };

  const onSwitchToLogin = () => {
    navigate("/auth/login");
  };

  const handleSendOTP = async () => {
    if (!formData.email) {
      setLocalError("Please enter your email first");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setLocalError("Please enter a valid email address");
      return;
    }

    setOtpLoading(true);
    setSuccess("");

    try {
      const result = await dispatch(SendOtp(formData.email));
      console.log('SendOtp result:', result);
      
      if (SendOtp.fulfilled.match(result)) {
        console.log('OTP sent successfully, setting otpSent to true');
      setOtpSent(true);
      setSuccess("OTP sent to your email!");
      } else {
        console.log('OTP send failed:', result.payload);
        setLocalError(result.payload?.message || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.log('OTP send error:', err);
      setLocalError("Failed to send OTP. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!formData.otp) {
      setLocalError("Please enter the OTP");
      return;
    }

    setSuccess("");

    try {
      const result = await dispatch(VerifyOtp({ 
        email: formData.email, 
        otp: formData.otp 
      }));
      
      if (VerifyOtp.fulfilled.match(result)) {
        setSuccess("OTP verified successfully!");
      } else {
        setLocalError(result.payload?.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setLocalError("OTP verification failed. Please try again.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccess("");

      // Validation
    if (!formData.password || !formData.confirmPassword) {
      setLocalError("Please fill in all fields");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match");
        return;
      }

      if (formData.password.length < 6) {
      setLocalError("Password must be at least 6 characters");
        return;
      }

    try {
      const result = await dispatch(Register({
        email: formData.email,
        password: formData.password,
        verified: verified // Use verified status from Redux state
      }));
      
      if (Register.fulfilled.match(result)) {
        setSuccess("Registration successful! Redirecting...");
        // Navigation will be handled by useEffect when isAuthenticated becomes true
      } else {
        setLocalError(result.payload?.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setLocalError("Registration failed. Please try again.");
    }
  };

  // Check if all required fields are filled
  const isFormComplete = () => {
    return (
      formData.email &&
      formData.password &&
      formData.confirmPassword &&
      verified
    );
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
          <ScrollText size={24} />
          Begin Your Legend
        </Typography>
      </Box>

      <CardContent sx={{ p: 4, pt: 3 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            

            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
                disabled={otpSent}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={20} color="#D4AF37" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#FFFFFF",
                    "& fieldset": {
                      borderColor: "rgba(212, 175, 55, 0.3)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(212, 175, 55, 0.5)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#D4AF37",
                    },
                    "&.Mui-disabled": {
                      color: "rgba(255, 255, 255, 0.5)",
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
              <Button
                variant="outlined"
                onClick={handleSendOTP}
                disabled={otpSent || otpLoading}
                sx={{
                  minWidth: 120,
                  borderColor: "rgba(212, 175, 55, 0.5)",
                  color: "#D4AF37",
                  "&:hover": {
                    borderColor: "#D4AF37",
                    backgroundColor: "rgba(212, 175, 55, 0.1)",
                  },
                  "&:disabled": {
                    borderColor: "rgba(212, 175, 55, 0.2)",
                    color: "rgba(212, 175, 55, 0.5)",
                  },
                }}
              >
                {otpLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : otpSent ? (
                  "Sent"
                ) : (
                  "Send OTP"
                )}
              </Button>
            </Box>

            {otpSent && (
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Enter OTP"
                  value={formData.otp}
                  onChange={handleChange("otp")}
                  disabled={verified}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={20} color="#D4AF37" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#FFFFFF",
                      "& fieldset": {
                        borderColor: "rgba(212, 175, 55, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(212, 175, 55, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#D4AF37",
                      },
                      "&.Mui-disabled": {
                        color: "rgba(255, 255, 255, 0.5)",
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
                <Button
                  variant="outlined"
                  onClick={handleVerifyOTP}
                  disabled={verified || loading}
                  sx={{
                    minWidth: 120,
                    borderColor: "rgba(212, 175, 55, 0.5)",
                    color: "#D4AF37",
                    "&:hover": {
                      borderColor: "#D4AF37",
                      backgroundColor: "rgba(212, 175, 55, 0.1)",
                    },
                    "&:disabled": {
                      borderColor: "rgba(212, 175, 55, 0.2)",
                      color: "rgba(212, 175, 55, 0.5)",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : verified ? (
                    "Verified"
                  ) : (
                    "Verify"
                  )}
                </Button>
              </Box>
            )}

            {verified && (
              <>
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
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      color: "#FFFFFF",
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
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={20} color="#D4AF37" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                          sx={{ color: "rgba(212, 175, 55, 0.7)" }}
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#FFFFFF",
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
              </>
            )}
          </Box>

          {(error || localError) && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                bgcolor: "rgba(211, 47, 47, 0.1)",
                color: "#ff8a80",
                border: "1px solid rgba(211, 47, 47, 0.3)",
              }}
            >
              {error || localError}
            </Alert>
          )}

          {success && (
            <Alert
              severity="success"
              sx={{
                mb: 2,
                bgcolor: "rgba(46, 125, 50, 0.1)",
                color: "#a5d6a7",
                border: "1px solid rgba(46, 125, 50, 0.3)",
              }}
            >
              {success}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={!isFormComplete() || loading}
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
                bgcolor: "rgba(212, 175, 55, 0.3)",
                color: "rgba(26, 26, 26, 0.5)",
              },
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: "#1A1A1A" }} />
                Creating Your Legend...
              </>
            ) : (
              "Create Your Legend"
            )}
          </Button>

          <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
            <Divider
              sx={{ flexGrow: 1, borderColor: "rgba(212, 175, 55, 0.2)" }}
            />
            <Typography
              variant="caption"
              sx={{ px: 2, color: "rgba(255, 255, 255, 0.5)" }}
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
              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              Already have an account?{" "}
              <Link
                component="button"
                type="button"
                onClick={onSwitchToLogin}
                sx={{
                  color: "#D4AF37",
                  textDecoration: "none",
                  fontWeight: 600,
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Enter the Realm
              </Link>
            </Typography>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignupForm;

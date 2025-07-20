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
} from "@mui/material";
import { MonetizationOn } from "@mui/icons-material";
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

const BankDetailsPage = () => {
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [holderName, setHolderName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [hasBankDetails, setHasBankDetails] = useState(false);
  const theme = useTheme();

  // Load bank details on component mount
  useEffect(() => {
    loadBankDetails();
  }, []);

  const loadBankDetails = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getBankDetails();
      if (response.bankDetails) {
        const details = response.bankDetails;
        setBankName(details.bankName || "");
        setAccountNumber(details.accountNumber || "");
        setIfsc(details.ifsc || "");
        setHolderName(details.accountHolderName || "");
        setUpiId(details.upiId || "");
        setHasBankDetails(true);
        setIsEditing(false);
      } else {
        setHasBankDetails(false);
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Error loading bank details:", error);
      setSnackbar({
        open: true,
        message: "Failed to load bank details",
        severity: "error",
      });
      setHasBankDetails(false);
      setIsEditing(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const bankData = {
        accountHolderName: holderName,
        accountNumber: accountNumber,
        ifsc: ifsc,
        bankName: bankName,
        upiId: upiId,
      };

      if (hasBankDetails) {
        // Update existing details
        await apiService.updateBankDetails(bankData);
        setSnackbar({
          open: true,
          message: "Bank details updated successfully!",
          severity: "success",
        });
      } else {
        // Save new details
        await apiService.saveBankDetails(bankData);
        setSnackbar({
          open: true,
          message: "Bank details saved successfully!",
          severity: "success",
        });
        setHasBankDetails(true);
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving bank details:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to save bank details",
        severity: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your bank details?")) {
      try {
        await apiService.deleteBankDetails();
        setSnackbar({
          open: true,
          message: "Bank details deleted successfully!",
          severity: "success",
        });
        setHasBankDetails(false);
        setIsEditing(true);
        setBankName("");
        setAccountNumber("");
        setIfsc("");
        setHolderName("");
        setUpiId("");
      } catch (error) {
        console.error("Error deleting bank details:", error);
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "Failed to delete bank details",
          severity: "error",
        });
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleReset = () => {
    setBankName("");
    setAccountNumber("");
    setIfsc("");
    setHolderName("");
    setUpiId("");
  };

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
          Loading bank details...
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
        p: 2,
      }}
    >
      <Box sx={{ maxWidth: 500, mx: "auto", mt: 6 }}>
        {/* Show existing bank details if available and not editing */}
        {hasBankDetails && !isEditing && (
          <Paper
            sx={{
              p: 3,
              mb: 4,
              backgroundColor: "#181818",
              border: `1px solid ${COLORS.primary}`,
              borderRadius: "12px",
              color: COLORS.text,
            }}
          >
            <Typography variant="h6" sx={{ color: COLORS.primary, mb: 2, fontWeight: 'bold' }}>
              Your Bank Details
            </Typography>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ color: COLORS.fadedText }}>Bank Name</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{bankName}</Typography>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ color: COLORS.fadedText }}>Account Number</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{accountNumber}</Typography>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ color: COLORS.fadedText }}>IFSC Code</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{ifsc}</Typography>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ color: COLORS.fadedText }}>Account Holder Name</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{holderName}</Typography>
            </Box>
            {upiId && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: COLORS.fadedText }}>UPI ID</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{upiId}</Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                sx={{ borderColor: COLORS.primary, color: COLORS.primary, fontWeight: 'bold' }}
                onClick={handleEdit}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                sx={{ borderColor: COLORS.red, color: COLORS.red, fontWeight: 'bold' }}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Box>
          </Paper>
        )}
        {/* Bank details form - show when editing or no details exist */}
        {(isEditing || !hasBankDetails) && (
          <Paper
            sx={{
              p: 4,
              backgroundColor: "#1E1E1E",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
              border: `1px solid ${COLORS.primary}`,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold", color: COLORS.primary, mb: 2 }}>
              {hasBankDetails ? "Edit Bank Details" : "Add Bank Details"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#AAA", mb: 3 }}>
              Store your bank details securely. These will be used for withdrawals.
            </Typography>
            <form onSubmit={handleSave}>
              <TextField
                label="Bank Name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
                fullWidth
                sx={{ mb: 2 }}
                InputProps={{
                  style: { color: COLORS.text, background: "#222" },
                }}
                InputLabelProps={{ style: { color: COLORS.primary } }}
                variant="outlined"
              />
              <TextField
                label="Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
                fullWidth
                sx={{ mb: 2 }}
                InputProps={{
                  style: { color: COLORS.text, background: "#222" },
                }}
                InputLabelProps={{ style: { color: COLORS.primary } }}
                variant="outlined"
                type="number"
              />
              <TextField
                label="IFSC Code"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value)}
                required
                fullWidth
                sx={{ mb: 2 }}
                InputProps={{
                  style: { color: COLORS.text, background: "#222" },
                }}
                InputLabelProps={{ style: { color: COLORS.primary } }}
                variant="outlined"
              />
              <TextField
                label="Account Holder Name"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                required
                fullWidth
                sx={{ mb: 2 }}
                InputProps={{
                  style: { color: COLORS.text, background: "#222" },
                }}
                InputLabelProps={{ style: { color: COLORS.primary } }}
                variant="outlined"
              />
              <TextField
                label="UPI ID (Optional)"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                fullWidth
                sx={{ mb: 3 }}
                InputProps={{
                  style: { color: COLORS.text, background: "#222" },
                }}
                InputLabelProps={{ style: { color: COLORS.primary } }}
                variant="outlined"
              />
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ backgroundColor: COLORS.primary, color: "#222", fontWeight: "bold" }}
                  disabled={isSaving}
                  fullWidth
                >
                  {isSaving ? "Saving..." : (hasBankDetails ? "Update" : "Save")}
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  sx={{ borderColor: COLORS.primary, color: COLORS.primary, fontWeight: "bold" }}
                  onClick={handleReset}
                  fullWidth
                >
                  Reset
                </Button>
              </Box>
              {hasBankDetails && (
                <Button
                  type="button"
                  variant="text"
                  sx={{ color: COLORS.fadedText, mt: 2 }}
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              )}
            </form>
          </Paper>
        )}
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

export default BankDetailsPage; 
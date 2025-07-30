import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert, Button } from '@mui/material';
import apiService from '../../services/apiService';

const COLORS = {
  background: '#121212',
  primary: '#D4AF37',
  text: '#FFFFFF',
  red: '#E11D48',
  green: '#10B981',
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const RazorpayCallback = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, failed
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      const razorpay_payment_id = query.get('razorpay_payment_id');
      const razorpay_order_id = query.get('razorpay_order_id');
      const razorpay_signature = query.get('razorpay_signature');
      const payment_status = query.get('payment_status');

      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        setStatus('failed');
        setMessage('Missing payment details in callback URL.');
        return;
      }

      try {
        const result = await apiService.verifyRazorpayPayment({
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
          payment_status,
        });
        
        if (result.success || result.status === 'success') {
          setStatus('success');
          setMessage('Payment successful! Your deposit has been credited.');
        } else {
          setStatus('failed');
          setMessage(result.message || 'Payment verification failed.');
        }
      } catch (err) {
        setStatus('failed');
        setMessage(err.response?.data?.message || 'Payment verification failed.');
      }
    };
    verifyPayment();
    // eslint-disable-next-line
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: COLORS.background,
        minHeight: '100vh',
        color: COLORS.text,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Typography variant="h4" sx={{ color: COLORS.primary, mb: 3, fontWeight: 'bold' }}>
        Payment Status
      </Typography>
      {status === 'verifying' && (
        <>
          <CircularProgress sx={{ color: COLORS.primary, mb: 2 }} />
          <Typography>Verifying your payment...</Typography>
        </>
      )}
      {status === 'success' && (
        <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>
      )}
      {status === 'failed' && (
        <Alert severity="error" sx={{ mb: 2 }}>{message}</Alert>
      )}
      <Button
        variant="contained"
        sx={{ backgroundColor: COLORS.primary, color: '#222', fontWeight: 'bold', mt: 3 }}
        onClick={() => navigate('/user/wallet')}
      >
        Go to Wallet
      </Button>
    </Box>
  );
};

export default RazorpayCallback; 
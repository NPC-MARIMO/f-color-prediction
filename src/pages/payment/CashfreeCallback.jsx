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

const CashfreeCallback = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, failed
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      const orderId = query.get('order_id') || query.get('orderId');
      const referenceId = query.get('reference_id') || query.get('referenceId');
      const txStatus = query.get('txStatus');
      const paymentMode = query.get('paymentMode');
      const signature = query.get('signature');
      // Add any other params you expect from Cashfree

      if (!orderId || !referenceId || !txStatus) {
        setStatus('failed');
        setMessage('Missing payment details in callback URL.');
        return;
      }

      try {
        const result = await apiService.verifyDepositPayment({
          orderId,
          referenceId,
          txStatus,
          paymentMode,
          signature,
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

export default CashfreeCallback; 
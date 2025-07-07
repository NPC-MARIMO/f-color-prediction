import { createSlice } from "@reduxjs/toolkit";
import { SendOtp, VerifyOtp, Register, Login } from "./authFeatures";

// Get initial state from localStorage if available
const getInitialState = () => {
  try {
    const authData = localStorage.getItem('auth');
    console.log('localStorage auth data:', authData);
    if (authData) {
      const parsed = JSON.parse(authData);
      console.log('Parsed auth data:', parsed);
      // Only restore authentication if we have valid user data
      if (parsed.user && parsed.isAuthenticated) {
        console.log('Restoring auth state from localStorage');
        return {
          user: parsed.user,
          isAuthenticated: parsed.isAuthenticated,
          loading: false,
          error: null,
          verified: parsed.verified || false,
        };
      } else {
        console.log('Invalid auth data in localStorage, using default state');
      }
    } else {
      console.log('No auth data in localStorage');
    }
  } catch (error) {
    console.error('Error parsing auth data from localStorage:', error);
  }
  
  console.log('Using default auth state');
  return {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    verified: false,
  };
};

const initialState = getInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.verified = false;
      // Clear from localStorage
      localStorage.removeItem('auth');
    },
  },
  extraReducers: (builder) => {
    // SendOtp
    builder
      .addCase(SendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(SendOtp.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(SendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // VerifyOtp
    builder
      .addCase(VerifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(VerifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Store the verified status from backend response
        state.verified = action.payload.verified || false;
      })
      .addCase(VerifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Register
    builder
      .addCase(Register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
        // Save to localStorage
        localStorage.setItem('auth', JSON.stringify({
          user: action.payload,
          isAuthenticated: true,
          verified: state.verified
        }));
      })
      .addCase(Register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Login
    builder
      .addCase(Login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
        // Save to localStorage
        localStorage.setItem('auth', JSON.stringify({
          user: action.payload,
          isAuthenticated: true,
          verified: state.verified
        }));
      })
      .addCase(Login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;

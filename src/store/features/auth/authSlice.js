import { createSlice } from "@reduxjs/toolkit";
import { SendOtp, VerifyOtp, Register, Login } from "./authFeatures";

// Get initial state from localStorage if available
const getInitialState = () => {
  try {
    const authData = localStorage.getItem('auth');
    if (authData) {
      const parsed = JSON.parse(authData);
      // Support both user and admin in localStorage
      if (
        (parsed.user && parsed.isAuthenticated) ||
        (parsed.admin && parsed.isAdminAuthenticated)
      ) {
        return {
          user: parsed.user || null,
          admin: parsed.admin || null,
          isAuthenticated: parsed.isAuthenticated || false,
          isAdminAuthenticated: parsed.isAdminAuthenticated || false,
          loading: false,
          error: null,
          verified: parsed.verified || false,
        };
      }
    }
  } catch (error) {
    console.error('Error parsing auth data from localStorage:', error);
  }

  // Default state
  return {
    user: null,
    admin: null,
    isAuthenticated: false,
    isAdminAuthenticated: false,
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
      state.admin = null;
      state.isAuthenticated = false;
      state.isAdminAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.verified = false;
      // Clear all auth-related data
      localStorage.removeItem('auth');
      localStorage.removeItem('token'); // If you store token separately
      // If using cookies, clear them here as well
    },
    // Optional: explicit admin logout
    adminLogout(state) {
      state.admin = null;
      state.isAdminAuthenticated = false;
      // Remove only admin info from localStorage
      const authData = localStorage.getItem('auth');
      if (authData) {
        try {
          const parsed = JSON.parse(authData);
          delete parsed.admin;
          delete parsed.isAdminAuthenticated;
          localStorage.setItem('auth', JSON.stringify(parsed));
        } catch (e) {
          localStorage.removeItem('auth');
        }
      }
    },
    // Optional: explicit user logout
    userLogout(state) {
      state.user = null;
      state.isAuthenticated = false;
      // Remove only user info from localStorage
      const authData = localStorage.getItem('auth');
      if (authData) {
        try {
          const parsed = JSON.parse(authData);
          delete parsed.user;
          delete parsed.isAuthenticated;
          localStorage.setItem('auth', JSON.stringify(parsed));
        } catch (e) {
          localStorage.removeItem('auth');
        }
      }
    }
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

    // Register (for user)
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
        // Save to localStorage, preserving admin if present
        const authData = localStorage.getItem('auth');
        let parsed = {};
        if (authData) {
          try {
            parsed = JSON.parse(authData);
          } catch (e) {
            parsed = {};
          }
        }
        parsed.user = action.payload;
        parsed.isAuthenticated = true;
        parsed.verified = state.verified;
        localStorage.setItem('auth', JSON.stringify(parsed));
      })
      .addCase(Register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Login (for user or admin)
    builder
      .addCase(Login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        // Determine if this is an admin login or user login
        // This assumes the backend returns a property like isAdmin or role
        const payload = action.payload;
        const isAdmin = payload && (payload.isAdmin === true || payload.role === 'admin');

        // Save to localStorage, preserving the other type if present
        const authData = localStorage.getItem('auth');
        let parsed = {};
        if (authData) {
          try {
            parsed = JSON.parse(authData);
          } catch (e) {
            parsed = {};
          }
        }

        if (isAdmin) {
          state.admin = payload;
          state.isAdminAuthenticated = true;
          parsed.admin = payload;
          parsed.isAdminAuthenticated = true;
        } else {
          state.user = payload;
          state.isAuthenticated = true;
          parsed.user = payload;
          parsed.isAuthenticated = true;
        }
        parsed.verified = state.verified;
        localStorage.setItem('auth', JSON.stringify(parsed));
      })
      .addCase(Login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, adminLogout, userLogout } = authSlice.actions;

export default authSlice.reducer;

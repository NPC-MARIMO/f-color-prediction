import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add User-Id header (for both user and admin)
    this.api.interceptors.request.use(
      (config) => {
        const authData = JSON.parse(localStorage.getItem('auth') || '{}');
        // Check for user or admin id
        let userId = null;
        if (authData.user?.id || authData.user?._id) {
          userId = authData.user?.id || authData.user?._id;
        } else if (authData.admin?.id || authData.admin?._id) {
          userId = authData.admin?.id || authData.admin?._id;
        }
        if (userId) {
          config.headers['User-Id'] = userId;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('auth');
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication APIs
  async sendOtp(email) {
    const response = await this.api.post('/api/auth/send-otp', { email });
    return response.data;
  }

  async verifyOtp(email, otp) {
    const response = await this.api.post('/api/auth/verify-otp', { email, otp });
    return response.data;
  }

  async register(userData) {
    const response = await this.api.post('/api/auth/register', userData);
    return response.data;
  }

  async login(credentials) {
    const response = await this.api.post('/api/auth/login', credentials);
    return response.data;
  }

  // Game Management APIs
  async getAvailableRooms(page = 1, limit = 10) {
    const response = await this.api.get(`/api/game/available-rooms?page=${page}&limit=${limit}`);
    return response.data;
  }

  async getRoomDetails(roomId) {
    const response = await this.api.get(`/api/game/room/${roomId}`);
    return response.data;
  }

  async createRoom(roomData) {
    const response = await this.api.post('/api/game/create-room', roomData);
    return response.data;
  }

  async joinRoom(roomId) {
    const response = await this.api.post(`/api/game/join-room/${roomId}`);
    return response.data;
  }

  async placeBet(roomId, betData) {
    const response = await this.api.post(`/api/game/room/${roomId}/place-bet`, betData);
    return response.data;
  }

  async placeColorBet(betData) {
    const userId = this.getUserId();
    
    const response = await this.api.post('/api/game/place-bet', betData, {
      headers: {
        'User-Id': userId,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }

  // --- Added: Place bet on current round (supports color, number, size) ---
  async placeBetOnCurrentRound(betData) {
    const userId = this.getUserId();
    const response = await this.api.post('/api/game/place-bet', betData, {
      headers: {
        'User-Id': userId,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }
  // --- End Added ---

  async getGameHistory(page = 1, limit = 10) {
    const userId = this.getUserId();
    
    const response = await this.api.get(`/api/game/history?page=${page}&limit=${limit}`, {
      headers: {
        'User-Id': userId,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }

  async getCurrentRound() {
    const userId = this.getUserId();
    
    const response = await this.api.get('/api/game/current-round', {
      headers: {
        'User-Id': userId,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }

  // Payment Management APIs
  async createRazorpayOrder(amount) {
    // Razorpay: POST /api/payment/create-razorpay-order
    const response = await this.api.post("/api/payment/create-deposit-order", {
      amount,
    });
    return response.data;
  }

  async verifyRazorpayPayment(paymentData) {
    // Razorpay: POST /api/payment/verify-razorpay-payment
    const response = await this.api.post(
      "/api/payment/verify-deposit-payment",
      paymentData
    );
    return response.data;
  }

  async createWithdrawalRequest(withdrawalData) {
    const response = await this.api.post('/api/payment/create-withdrawal-request', withdrawalData);
    return response.data;
  }

  async getTransactionHistory(page = 1, limit = 10) {
    const response = await this.api.get(`/api/payment/transaction-history?page=${page}&limit=${limit}`);
    return response.data;
  }

  async createDepositOrder(amount) {
    const response = await this.api.post('/api/payment/create-deposit-order', { amount });
    return response.data;
  }

  async verifyDepositPayment(paymentData) {
    const response = await this.api.post('/api/payment/verify-deposit-payment', paymentData);
    return response.data;
  }

  // Wallet Management APIs
  async  getWalletBalance() {
    const userId = this.getUserId();
    
    const response = await this.api.get('/api/wallet/balance', {
      headers: {
        'User-Id': userId,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }

  async getWalletStats() {
    const userId = this.getUserId();
    
    const response = await this.api.get('/api/wallet/stats', {
      headers: {
        'User-Id': userId,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }

  async getRecentTransactions() {
    const userId = this.getUserId();
    
    const response = await this.api.get(`/api/payment/transaction-history`, {
      headers: {
        "User-Id": userId,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }

  // Admin APIs
  async getAllTransactions(page = 1, limit = 10) {
    const response = await this.api.get(`/api/transaction/all?page=${page}&limit=${limit}`);
    return response.data;
  }

  async getTransactionStats() {
    const response = await this.api.get('/api/transaction/stats');
    return response.data;
  }

  async getTransactionById(transactionId) {
    const response = await this.api.get(`/api/transaction/${transactionId}`);
    return response.data;
  }

  async updateTransactionStatus(transactionId, status) {
    const response = await this.api.patch(`/api/transaction/${transactionId}/status`, { status });
    return response.data;
  }

  async refundTransaction(transactionId) {
    const response = await this.api.post(`/api/transaction/${transactionId}/refund`);
    return response.data;
  }

  // Admin User Management APIs
  async getAdminUsers(page = 1, limit = 20, role = 'user', isBlocked = false, search = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      role,
      isBlocked: isBlocked.toString(),
      search
    });
    const response = await this.api.get(`/api/admin/users?${params}`);
    return response.data;
  }

  async getAdminUserById(userId) {
    const response = await this.api.get(`/api/admin/users/${userId}`);
    return response.data;
  }

  async blockUser(userId, reason) {
    const response = await this.api.patch(`/api/admin/users/${userId}/block`, { reason });
    return response.data;
  }

  // Admin Game Settings APIs
  async getGameSettings() {
    const response = await this.api.get('/api/admin/game/settings');
    return response.data;
  }

  async updateGameSettings(settings) {
    const response = await this.api.put('/api/admin/game/settings', settings);
    return response.data;
  }

  // Admin Withdrawal Management APIs
  async getPendingWithdrawals(page = 1, limit = 20) {
    const response = await this.api.get(`/api/admin/withdrawals/pending?page=${page}&limit=${limit}`);
    return response.data;
  }

  async approveWithdrawal(transactionId, notes) {
    const response = await this.api.post(`/api/admin/withdrawals/${transactionId}/approve`, { notes });
    return response.data;
  }

  async rejectWithdrawal(transactionId, reason) {
    const response = await this.api.post(`/api/admin/withdrawals/${transactionId}/reject`, { reason });
    return response.data;
  }

  // Admin Dashboard API
  async getAdminDashboard() {
    const response = await this.api.get('/api/admin/dashboard');
    return response;
  }

  // Admin Transaction APIs
  async getAdminTransactions(page = 1, limit = 20, type = '', status = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    if (type) params.append('type', type);
    if (status) params.append('status', status);
    const response = await this.api.get(`/api/transaction/all?${params}`);
    return response.data;
  }

  async getTransactionStatsByPeriod(period = 30) {
    const response = await this.api.get(`/api/transaction/stats?period=${period}`);
    return response.data;
  }

  async updateTransactionStatusAdmin(transactionId, status, notes) {
    const response = await this.api.patch(`/api/transaction/${transactionId}/status`, { status, notes });
    return response.data;
  }

  async refundTransactionAdmin(transactionId, reason) {
    const response = await this.api.post(`/api/transaction/${transactionId}/refund`, { reason });
    return response.data;
  }

  // Bank Details API
  async saveBankDetails(bankData) {
    const userId = this.getUserId();
    
    const response = await this.api.post('/api/user/bank-details', bankData, {
      headers: {
        'User-Id': userId,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }

  async getBankDetails() {
    const userId = this.getUserId();
    
    const response = await this.api.get('/api/user/bank-details', {
      headers: {
        'User-Id': userId,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }

  async updateBankDetails(bankData) {
    const userId = this.getUserId();
    
    const response = await this.api.put('/api/user/bank-details', bankData, {
      headers: {
        'User-Id': userId,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }

  async deleteBankDetails() {
    const userId = this.getUserId();
    
    const response = await this.api.delete('/api/user/bank-details', {
      headers: {
        'User-Id': userId,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }

  // Utility methods
  getUserId() {
    const user = JSON.parse(localStorage.getItem('auth') || '{}');
    return user.user.user?.id || user.user.user?._id;
    
  }

  getAuthHeaders() {
    const user = JSON.parse(localStorage.getItem('auth') || '{}');
    return {
      'Content-Type': 'application/json',
      'User-Id': user.user?.id || user.user?._id || '',
    };
  }

  isAuthenticated() {
    const auth = localStorage.getItem('auth');
    if (!auth) return false;
    
    try {
      const parsed = JSON.parse(auth);
      return parsed.isAuthenticated && parsed.user;
    } catch {
      return false;
    }
  }

  getCurrentUser() {
    const auth = localStorage.getItem('auth');
    if (!auth) return null;
    
    try {
      const parsed = JSON.parse(auth);
      return parsed.user;
    } catch {
      return null;
    }
  }

  logout() {
    localStorage.removeItem('auth');
  }
}

// Create singleton instance
const apiService = new ApiService();
export default apiService; 
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

    // Request interceptor to add User-Id header
    this.api.interceptors.request.use(
      (config) => {
        const user = JSON.parse(localStorage.getItem('auth') || '{}');
        if (user.user?.id || user.user?._id) {
          config.headers['User-Id'] = user.user?.id || user.user?._id;
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
  async createDepositOrder(amount) {
    const response = await this.api.post('/api/payment/create-deposit-order', { amount });
    return response.data;
  }

  async verifyDepositPayment(paymentData) {
    const response = await this.api.post('/api/payment/verify-deposit-payment', paymentData);
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

  // Wallet Management APIs
  async getWalletBalance() {
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

  async getRecentTransactions(limit = 10) {
    const userId = this.getUserId();
    
    const response = await this.api.get(`/api/wallet/recent-transactions?limit=${limit}`, {
      headers: {
        'User-Id': userId,
        'Content-Type': 'application/json'
      }
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

  // Utility methods
  getUserId() {
    const user = JSON.parse(localStorage.getItem('auth') || '{}');
    console.log(user);
    
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
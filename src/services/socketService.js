import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.userId = null;
    this.listeners = new Map();
  }

  // Initialize socket connection
  connect(userId) {
    this.userId = userId;
    this.socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      transports: ['websocket'],
      autoConnect: true,
    });

    this.setupEventListeners();
  }

  // Setup event listeners
  setupEventListeners() {
    this.socket.on('connect', () => {
      this.isConnected = true;
      this.emit('connect');
      this.joinUser();
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      this.emit('disconnect');
    });

    this.socket.on('error', (data) => {
      console.error('Socket error:', data);
      this.emit('error', data);
    });

    // User Events
    this.socket.on('joined:user', (data) => {
      this.emit('joined:user', data);
    });

    // Room Events
    this.socket.on('room:joined', (data) => {
      this.emit('room:joined', data);
    });

    this.socket.on('room:left', (data) => {
      this.emit('room:left', data);
    });

    this.socket.on('room:update', (data) => {
      this.emit('room:update', data);
    });

    this.socket.on('player:joined', (data) => {
      this.emit('player:joined', data);
    });

    this.socket.on('player:left', (data) => {
      this.emit('player:left', data);
    });

    // Game Events
    this.socket.on('game:started', (data) => {
      this.emit('game:started', data);
    });

    this.socket.on('betting:started', (data) => {
      this.emit('betting:started', data);
    });

    this.socket.on('color:bet-placed', (data) => {
      this.emit('color:bet-placed', data);
    });

    this.socket.on('color:bet-confirmed', (data) => {
      this.emit('color:bet-confirmed', data);
    });

    this.socket.on('game:time-update', (data) => {
      this.emit('game:time-update', data);
    });

    this.socket.on('timer:update', (data) => {
      this.emit('timer:update', data);
    });

    this.socket.on('game:result', (data) => {
      this.emit('game:result', data);
    });

    // Round Events
    this.socket.on('round:update', (data) => {
      this.emit('round:update', data);
    });

    this.socket.on('round:result', (data) => {
      this.emit('round:result', data);
    });

    this.socket.on('round:current', (data) => {
      this.emit('round:current', data);
    });

    // Data Events
    this.socket.on('available:rooms', (data) => {
      this.emit('available:rooms', data);
    });

    this.socket.on('room:details', (data) => {
      this.emit('room:details', data);
    });

    this.socket.on('wallet:balance', (data) => {
      this.emit('wallet:balance', data);
    });

    this.socket.on('game:history', (data) => {
      this.emit('game:history', data);
    });
  }

  // Join user to socket
  joinUser() {
    if (this.userId) {
      this.socket.emit('join:user', { userId: this.userId });
    }
  }

  // Join room
  joinRoom(roomId) {
    this.socket.emit('join:room', { roomId, userId: this.userId });
  }

  // Leave room
  leaveRoom(roomId) {
    this.socket.emit('leave:room', { roomId, userId: this.userId });
  }

  // Place color bet
  placeColorBet(roomId, chosenColor) {
    this.socket.emit('place:color-bet', { 
      roomId, 
      userId: this.userId, 
      chosenColor 
    });
  }

  // Get available rooms
  getAvailableRooms(page = 1, limit = 10) {
    this.socket.emit('get:available-rooms', { page, limit });
  }

  // Get room details
  getRoomDetails(roomId) {
    this.socket.emit('get:room-details', { roomId });
  }

  // Get wallet balance
  getWalletBalance() {
    this.socket.emit('get:wallet-balance', { userId: this.userId });
  }

  // Get game history
  getGameHistory(page = 1, limit = 10) {
    this.socket.emit('get:game-history', { userId: this.userId, page, limit });
  }

  // Get current round
  getCurrentRound() {
    this.socket.emit('round:get');
  }

  // Add event listener
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  // Remove event listener
  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Emit event to listeners
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        callback(data);
      });
    }
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.userId = null;
      this.listeners.clear();
    }
  }

  // Get connection status
  getConnectionStatus() {
    return this.isConnected && this.socket?.connected;
  }

  // Force connection status update
  updateConnectionStatus() {
    const wasConnected = this.isConnected;
    this.isConnected = this.socket?.connected || false;
    
    if (wasConnected !== this.isConnected) {
      if (this.isConnected) {
        this.emit('connect');
      } else {
        this.emit('disconnect');
      }
    }
    
    return this.isConnected;
  }
}

// Create singleton instance
const socketService = new SocketService();
export default socketService; 
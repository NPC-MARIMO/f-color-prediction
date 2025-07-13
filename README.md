# Color Prediction Game Frontend

A modern, real-time multiplayer Color Prediction Game built with React, Redux Toolkit, Material-UI, and Socket.IO.

## 🎨 Color Palette

- **Background**: `#0F0F0F`
- **Primary Accent**: `#D4AF37` (Gold)
- **Secondary Accent**: `#6A0DAD` (Purple)
- **Text Primary**: `#FFFFFF`
- **Success (Win)**: `#00C897`
- **Danger (Loss)**: `#FF4C4C`

## 🚀 Features

### Authentication System
- ✅ User Registration with email verification
- ✅ OTP-based registration (send OTP → verify OTP → register)
- ✅ User Login with session-based authentication
- ✅ No JWT - uses User-ID header authentication
- ✅ Admin/User role management
- ✅ Account blocking functionality
- ✅ KYC verification status tracking

### User Management
- ✅ User profiles with game statistics
- ✅ Online/offline status tracking
- ✅ Socket ID management for real-time features
- ✅ Last login tracking
- ✅ Bank details storage for withdrawals
- ✅ Game statistics (total games played, won, amount won)

### Wallet System
- ✅ Wallet balance management
- ✅ Locked balance for active games
- ✅ Available balance calculation
- ✅ Transaction history with detailed records
- ✅ Deposit/withdrawal tracking
- ✅ Win/loss statistics
- ✅ Currency support (INR)

### Payment Integration (Razorpay)
- ✅ Deposit orders creation
- ✅ Payment verification with signature validation
- ✅ Webhook handling for automatic payment processing
- ✅ Withdrawal requests with bank details
- ✅ Transaction status tracking (pending/completed/failed/cancelled)
- ✅ Refund functionality for admin
- ✅ Payment history with detailed records

### Multiplayer RTC Game System

#### Room Management
- ✅ Create game rooms with custom entry fees
- ✅ Join existing rooms with real-time updates
- ✅ Room capacity management (2-50 players)
- ✅ Room status tracking (waiting/active/completed/cancelled)
- ✅ Available spots calculation
- ✅ Room details with player information
- ✅ Leave room functionality

#### Game Flow
- ✅ Entry fee deduction when joining room
- ✅ Minimum players requirement (default: 2)
- ✅ Game start when conditions met
- ✅ Betting phase with color selection (red/green/blue)
- ✅ Real-time betting with live updates
- ✅ Automatic result generation (random color)
- ✅ Multiple winners support
- ✅ Prize pool distribution among winners
- ✅ Commission deduction (5% default)

### Real-Time Features
- ✅ Live player updates (join/leave notifications)
- ✅ Real-time room status updates
- ✅ Live betting with instant notifications
- ✅ Game countdown timers
- ✅ Result announcements with winner details
- ✅ Socket room management for targeted updates

### Game Statistics & History
- ✅ Total games played
- ✅ Total games won
- ✅ Total amount won
- ✅ Win rate calculation
- ✅ Game history with detailed results
- ✅ Betting history with color choices
- ✅ Payout history with amounts

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI (MUI)
- **Real-time Communication**: Socket.IO Client
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS + MUI Theme
- **Payment Gateway**: Razorpay
- **Build Tool**: Vite

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd color-prediction-game-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin-specific components
│   └── user/           # User-specific components
├── layout/             # Layout components
│   ├── adminLayout.jsx
│   ├── authLayout.jsx
│   └── userLayout.jsx
├── pages/              # Page components
│   ├── admin/          # Admin pages
│   ├── auth/           # Authentication pages
│   └── user/           # User pages
├── services/           # API and Socket services
│   ├── apiService.js   # HTTP API service
│   └── socketService.js # Socket.IO service
├── store/              # Redux store
│   ├── features/       # Redux slices
│   │   └── auth/       # Authentication slice
│   └── store.js        # Store configuration
├── theme.js            # MUI theme configuration
├── App.jsx             # Main app component
└── main.jsx           # App entry point
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` |
| `VITE_RAZORPAY_KEY_ID` | Razorpay Key ID | Required for payments |

### Theme Configuration

The app uses a custom Material-UI theme with the following features:

- **Dark Mode**: Primary theme with dark background
- **Custom Colors**: Game-specific color palette
- **Responsive Design**: Mobile-first approach
- **Animations**: Smooth transitions and hover effects
- **Typography**: Custom font weights and sizes

## 🎮 Game Flow

### 1. User Registration
```
Email → Send OTP → Verify OTP → Register → Login
```

### 2. Wallet Management
```
Deposit → Razorpay Payment → Wallet Credited
Withdraw → Bank Details → Admin Approval → Bank Transfer
```

### 3. Game Process
```
Create/Join Room → Entry Fee Deducted → Wait for Players
Game Starts → Betting Phase → Choose Color → Wait for Result
Result Generated → Winners Split Prize Pool → Losers Lose Entry Fee
```

## 📱 Responsive Design

The application is fully responsive and optimized for:

- **Desktop**: Full feature set with detailed statistics
- **Tablet**: Optimized layout with touch-friendly controls
- **Mobile**: Streamlined interface for on-the-go gaming

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes
- **Input Validation**: All user inputs validated
- **XSS Protection**: Sanitized user inputs
- **CORS Protection**: Cross-origin request handling
- **Authentication**: Session-based with User-ID headers
- **Payment Security**: Razorpay signature verification

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Environment Setup for Production
```env
VITE_API_URL=https://your-backend-api.com
VITE_RAZORPAY_KEY_ID=your_production_razorpay_key
```

## 📊 API Integration

### Authentication Endpoints
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Game Management
- `GET /api/game/available-rooms` - Get available rooms
- `GET /api/game/room/:roomId` - Get room details
- `POST /api/game/create-room` - Create new room
- `POST /api/game/join-room/:roomId` - Join room
- `POST /api/game/room/:roomId/place-bet` - Place color bet
- `GET /api/game/game-history` - Get game history

### Payment Management
- `POST /api/payment/create-deposit-order` - Create deposit order
- `POST /api/payment/verify-deposit-payment` - Verify payment
- `POST /api/payment/create-withdrawal-request` - Create withdrawal
- `GET /api/payment/transaction-history` - Get transaction history

### Wallet Management
- `GET /api/wallet/balance` - Get wallet balance
- `GET /api/wallet/stats` - Get wallet statistics
- `GET /api/wallet/recent-transactions` - Get recent transactions

## 🔌 Socket Events

### Client to Server
- `join:user` - Join user to socket
- `join:room` - Join game room
- `leave:room` - Leave game room
- `place:color-bet` - Place color bet
- `get:available-rooms` - Get available rooms
- `get:room-details` - Get room details
- `get:wallet-balance` - Get wallet balance
- `get:game-history` - Get game history

### Server to Client
- `joined:user` - User joined successfully
- `room:joined` - Room joined successfully
- `room:left` - Room left successfully
- `room:update` - Room status update
- `player:joined` - New player joined
- `player:left` - Player left
- `game:started` - Game started
- `betting:started` - Betting phase started
- `color:bet-placed` - Color bet placed
- `color:bet-confirmed` - Bet confirmed
- `game:time-update` - Game countdown
- `game:result` - Game result
- `available:rooms` - Available rooms list
- `room:details` - Room details
- `wallet:balance` - Wallet balance
- `game:history` - Game history

## 🎯 Key Components

### Game Component (`src/pages/user/game.jsx`)
- Room creation and management
- Real-time betting interface
- Color selection (Red/Green/Blue)
- Live game updates
- Player statistics

### Wallet Component (`src/pages/user/wallet.jsx`)
- Balance display and management
- Deposit/withdrawal functionality
- Transaction history
- Razorpay integration
- Bank details management

### Profile Component (`src/pages/user/profile.jsx`)
- User statistics and achievements
- Game history with filtering
- Profile editing
- Account management

### Authentication Components
- Registration with OTP verification
- Login with session management
- Form validation and error handling
- Responsive design

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Dark Theme**: Easy on the eyes for extended gaming
- **Smooth Animations**: Enhanced user experience
- **Real-time Updates**: Live notifications and updates
- **Mobile Responsive**: Optimized for all devices
- **Accessibility**: WCAG compliant design
- **Loading States**: User feedback during operations
- **Error Handling**: Comprehensive error messages

## 🔧 Development

### Adding New Features
1. Create component in appropriate directory
2. Add Redux slice if needed
3. Update routing in `App.jsx`
4. Add API endpoints in `apiService.js`
5. Add socket events in `socketService.js`

### Styling Guidelines
- Use Material-UI components
- Follow the established color palette
- Maintain responsive design
- Use consistent spacing and typography
- Add hover effects and transitions

### State Management
- Use Redux for global state
- Use local state for component-specific data
- Follow Redux Toolkit patterns
- Implement proper error handling

## 🐛 Troubleshooting

### Common Issues

1. **Socket Connection Failed**
   - Check backend server is running
   - Verify `VITE_API_URL` environment variable
   - Check network connectivity

2. **Payment Integration Issues**
   - Verify Razorpay credentials
   - Check webhook configuration
   - Ensure proper signature verification

3. **Authentication Problems**
   - Clear localStorage and re-login
   - Check User-ID header in requests
   - Verify backend authentication middleware

4. **Build Issues**
   - Clear node_modules and reinstall
   - Check for dependency conflicts
   - Verify environment variables

## 📈 Performance Optimization

- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Compressed images and icons
- **Bundle Analysis**: Regular bundle size monitoring
- **Caching**: Efficient caching strategies
- **Minification**: Production build optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for the Color Prediction Game Community** 
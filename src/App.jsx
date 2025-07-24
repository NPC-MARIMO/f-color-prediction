import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AuthLayout from "./layout/authLayout";
import Register from "./pages/auth/register.jsx";
import Login from "./pages/auth/login.jsx";
import UserLayout from "./layout/userLayout.jsx";
import Home from "./pages/user/home";
import Game from "./pages/user/game.jsx";
import Wallet from "./pages/user/wallet.jsx";
import Transaction from "./pages/user/transaction.jsx";
import Withdraw from "./pages/user/withdraw.jsx";
import Support from "./pages/user/support.jsx";
import Profile from "./pages/user/profile.jsx";
import AdminLayout from "./layout/adminLayout.jsx";
import Dashboard from "./pages/admin/dashboard.jsx";
import Users from "./pages/admin/users.jsx";
import WithdrawRequests from "./pages/admin/withdrawRequests.jsx";
import GameRounds from "./pages/admin/gameRounds.jsx";
import GamePlay from "./pages/user/gamePlay.jsx";
import BankDetailsPage from "./pages/user/bank.jsx";
import DepositPage from "./pages/user/deposit.jsx";
import CashfreeCallback from "./pages/payment/CashfreeCallback.jsx";

// Protected Route Component
const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (requireAuth && !isAuthenticated) {
    // Redirect to login if not authenticated and route requires auth
    return <Navigate to="/auth/login" replace />;
  }

  if (!requireAuth && isAuthenticated) {
    // Redirect to profile if authenticated and trying to access auth routes
    return <Navigate to="/user/profile" replace />;
  }

  return children;
};

// Public Route Component (for auth pages)
const PublicRoute = ({ children }) => {
  return <ProtectedRoute requireAuth={false}>{children}</ProtectedRoute>;
};

export default function App() {
  return (
    <div>
      <Router>
        <Routes>
          {/* Public routes - redirect to profile if authenticated */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <UserLayout />
              </PublicRoute>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="Home" element={<Home />} />
          </Route>

          {/* Auth routes - redirect to profile if authenticated */}
          <Route
            path="/auth"
            element={
              <PublicRoute>
                <AuthLayout />
              </PublicRoute>
            }
          >
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
          </Route>

          {/* Protected user routes - redirect to login if not authenticated */}
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route path="home" element={<Home />} />
            <Route path="game" element={<Game />} />
            <Route path="game/play/:gameId" element={<GamePlay />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="transactions" element={<Transaction />} />
            <Route path="withdraw" element={<Withdraw />} />
            <Route path="support" element={<Support />} />
            <Route path="profile" element={<Profile />} />
            <Route path="bank" element={<BankDetailsPage />} />
            <Route path="deposit" element={<DepositPage />} />
          </Route>

          {/* Protected admin routes - redirect to login if not authenticated */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="gameRounds" element={<GameRounds />} />
            <Route path="withdrawRequests" element={<WithdrawRequests />} />
          </Route>

          <Route path="*" element={<h1>404</h1>} />
          <Route path="/payment/cashfree-callback" element={<CashfreeCallback />} />
        </Routes>
      </Router>
    </div>
  );
}

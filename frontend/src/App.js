// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './components/common/AuthLayout';
import SplashScreen from './pages/SplashScreen';
import LandingPage from './pages/LandingPage'; 
import LoginPage from './pages/Authentication/LoginPage';
import RegisterPage from './pages/Authentication/RegisterPage';
import VerifyEmailPage from './pages/Authentication/VerifyEmailPage';
import ForgotPasswordPage from './pages/Authentication/ForgotPasswordPage';
import ResetPasswordPage from './pages/Authentication/ResetPasswordPage';
import RequestRolePage from './pages/Authentication/RequestRolePage';

import EventsPage from './pages/EventManagement/EventsPage';
import EventDetailsPage from './pages/EventManagement/EventDetailsPage';
import SavedEventsPage from './pages/SavedEvents/SavedEventsPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
        theme="colored"  
      />

      <Routes>
        {/* Splash screen → Entry Point */}
        <Route path="/" element={<SplashScreen />} />

        {/* Public Landing Page */}
        <Route path="/home" element={<LandingPage />} />

        {/* Auth Pages → Wrapped with shared layout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/request-role" element={<RequestRolePage />} />
        </Route>

        {/* Event Pages */}
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />

        {/* Saved Events */}
        <Route path="/saved" element={<SavedEventsPage />} />

        {/* Catch-all Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

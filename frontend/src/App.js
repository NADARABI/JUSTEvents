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

import SavedEventsPage from './pages/SavedEvents/SavedEventsPage';
import FeedbackPage from './pages/Feedback/FeedbackPage';
import EventFeedbackList from './components/Feedback/EventFeedbackList';
import EventsPage from './pages/EventManagement/EventsPage'; 

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <Routes>
        {/* Splash screen → entry point */}
        <Route path="/" element={<SplashScreen />} />

        {/* Landing page → public content */}
        <Route path="/home" element={<LandingPage />} />

        {/* Auth pages → wrapped with shared layout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/request-role" element={<RequestRolePage />} />
        </Route>

        {/* Event & Feedback Pages */}
        <Route path="/events" element={<EventsPage />} />
        <Route path="/saved" element={<SavedEventsPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/mock-feedback" element={<EventFeedbackList eventId={1} />} />

        {/* Catch-all fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

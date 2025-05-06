import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './components/common/AuthLayout';

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

import CreateEventPage from './pages/EventManagement/CreateEventPage';
import EditEventPage from './pages/EventManagement/EditEventPage';
import MyEventsPage from './pages/Organizer/MyEventsPage';
import PrivateRoute from './components/Routes/PrivateRoute'; // تأكد من المسار الصحيح

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* Auth & landing pages under shared layout */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/request-role" element={<RequestRolePage />} />
        </Route>

        {/* Saved Events */}
        <Route path="/saved" element={<SavedEventsPage />} />

        {/* Submit Feedback */}
        <Route path="/feedback" element={<FeedbackPage />} />

        {/* View Feedback (for testing) */}
        <Route path="/mock-feedback" element={<EventFeedbackList eventId={1} />} />

        {/* Organizer-only routes */}
        <Route
          path="/events/create"
          element={
            <PrivateRoute role="Organizer">
              <CreateEventPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/events/edit/:id"
          element={
            <PrivateRoute role="Organizer">
              <EditEventPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/organizer/my-events"
          element={
            <PrivateRoute role="Organizer">
              <MyEventsPage />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

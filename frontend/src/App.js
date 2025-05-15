import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import AuthLayout from './components/common/AuthLayout';
import SplashScreen from './pages/SplashScreen';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Authentication/LoginPage';
import RegisterPage from './pages/Authentication/RegisterPage';
import VerifyEmailPage from './pages/Authentication/VerifyEmailPage';
import ForgotPasswordPage from './pages/Authentication/ForgotPasswordPage';
import ResetPasswordPage from './pages/Authentication/ResetPasswordPage';
import RequestRolePage from './pages/Authentication/RequestRolePage';
import SSOCallbackPage from './pages/Authentication/SSOCallbackPage';

import EventsPage from './pages/EventManagement/EventsPage';
import EventDetailsPage from './pages/EventManagement/EventDetailsPage';
import SavedEventsPage from './pages/SavedEvents/SavedEventsPage';

import FeedbackPage from './pages/Feedback/FeedbackPage';
import CreateEventPage from './pages/EventManagement/CreateEventPage';
import EditEventPage from './pages/EventManagement/EditEventPage';
import MyEventsPage from './pages/Organizer/MyEventsPage';
import OrganizerDashboardPage from './pages/Organizer/OrganizerDashboardPage';

import PrivateRoute from './components/Routes/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Admin Layout + Dashboard
import SystemAdminLayout from './pages/AdminSystem/layout/SystemAdminLayout';
import DashboardPage from './pages/AdminSystem/Dashboard/DashboardPage';
import PendingUsersPage from './pages/AdminSystem/PendingUsers/PendingUsersPage';
import PendingEventsPage from './pages/AdminSystem/EventApprovals/PendingEventsPage';
import NotificationsPage from './pages/AdminSystem/Notifications/NotificationsPage';

function App() {
  return (

    <BrowserRouter>
      <ToastContainer />
      <Routes>

    <UserProvider>
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
          <Route path="/home" element={<LandingPage />} />

          {/* Auth Pages - Wrapped with AuthLayout */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>

          {/* SSO Callback - Separate */}
          <Route path="/sso/callback" element={<SSOCallbackPage />} />

          {/* Request Role Page - Separate and Independent */}
integration-1
          <Route path="/request-role" element={<RequestRolePage />} />

        {/* Saved Events */}
        <Route path="/saved" element={<SavedEventsPage />} />

        {/* Submit Feedback */}
        <Route path="/feedback" element={<FeedbackPage />} />

        {/* View Feedback (for testing) */}
        <Route path="/mock-feedback" element={<EventFeedbackList eventId={1} />} />

        {/* System Admin Panel */}
        <Route path="/admin/*" element={<SystemAdminLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="pending-users" element={<PendingUsersPage />} />
          <Route path="pending-events" element={<PendingEventsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
          {/* Event Pages */}
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />

          {/* Protected Routes */}
          <Route 
            path="/saved" 
            element={
              <PrivateRoute role={["Student", "Organizer"]}>
                <SavedEventsPage />
              </PrivateRoute>
            } 
          />

          <Route
            path="/feedback"
            element={
              <PrivateRoute role={["Student", "Organizer"]}>
                <FeedbackPage />
              </PrivateRoute>
            }
          />

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
          <Route
            path="/organizer/dashboard"
            element={
              <PrivateRoute role="Organizer">
                <OrganizerDashboardPage />
              </PrivateRoute>
            }
          />

          {/* Catch-all Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
 integration-1
  );
}

export default App;

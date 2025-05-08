// src/App.js
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

function App() {
  return (
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
          {/* Auth Pages → Wrapped with shared layout */}
          <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          {/* Remove PrivateRoute for this */}
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/request-role" element={<RequestRolePage />} />
          </Route>


          {/* Event Pages */}
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />

          {/* Saved Events (Protected) */}
          <Route 
            path="/saved" 
            element={
              <PrivateRoute role={["Student", "Organizer"]}>
                <SavedEventsPage />
              </PrivateRoute>
            } 
          />

          {/* Submit Feedback (Protected) */}
          <Route
            path="/feedback"
            element={
              <PrivateRoute role={["Student", "Organizer"]}>
                <FeedbackPage />
              </PrivateRoute>
            }
          />

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
          <Route
            path="/organizer/dashboard"
            element={
              <PrivateRoute role="Organizer">
                <OrganizerDashboardPage />
              </PrivateRoute>
            }
          />

          {/* Admin-only routes (Uncomment when ready) */}
          {/*
          <Route
            path="/admin/pending-events"
            element={
              <PrivateRoute role="Campus Admin">
                <PendingEventsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/pending-users"
            element={
              <PrivateRoute role="System Admin">
                <PendingUsersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/bookings/pending"
            element={
              <PrivateRoute role="Campus Admin">
                <PendingBookingsPage />
              </PrivateRoute>
            }
          />
          */}

          {/* Catch-all Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;

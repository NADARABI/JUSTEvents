// src/App.js
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useEffect } from 'react';
import { setNavigateHandler } from './services/api';
import { UserProvider } from './context/UserContext';

import AuthLayout from './components/common/AuthLayout';
import PrivateRoute from './components/Routes/PrivateRoute';

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
import CreateEventPage from './pages/EventManagement/CreateEventPage';
import EditEventPage from './pages/EventManagement/EditEventPage';

import SavedEventsPage from './pages/SavedEvents/SavedEventsPage';
import EventFeedbackList from './components/Feedback/EventFeedbackList';
import CampusMap from './pages/CampusMap/CampusMap';

import MyEventsPage from './pages/Organizer/MyEventsPage';
import OrganizerDashboardPage from './pages/Organizer/OrganizerDashboardPage';

// System Admin Panel
import SystemAdminLayout from './pages/AdminSystem/layout/SystemAdminLayout';
import DashboardPage from './pages/AdminSystem/Dashboard/DashboardPage';
import PendingUsersPage from './pages/AdminSystem/PendingUsers/PendingUsersPage';
import PendingEventsPage from './pages/AdminSystem/EventApprovals/PendingEventsPage';
import NotificationsPage from './pages/AdminSystem/Notifications/NotificationsPage';

// Campus Admin Panel
import CampusBookingRequestsPage from './pages/campusAdmin/CampusBookingRequestsPage';
import CampusRoomAnalyticsPage from './pages/campusAdmin/CampusRoomAnalyticsPage';
import ManageBuildingsPage from './pages/campusAdmin/ManageBuildingsPage';
import ManageRoomsPage from './pages/campusAdmin/ManageRoomsPage';

function AppRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigateHandler(navigate); // Sync navigate to axios interceptors
  }, [navigate]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} theme="colored" />
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<SplashScreen />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route path="/campus-map" element={<CampusMap />} />
        <Route path="/mock-feedback" element={<EventFeedbackList eventId={1} />} />

        {/* Auth Pages */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
        <Route path="/sso/callback" element={<SSOCallbackPage />} />
        <Route path="/request-role" element={<RequestRolePage />} />

        {/* Student/Organizer */}
        <Route
          path="/saved"
          element={
            <PrivateRoute>
              <SavedEventsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/feedback"
          element={
            <PrivateRoute roles={["Student", "Organizer"]}>
              {/* <FeedbackPage /> */}
            </PrivateRoute>
          }
        />

        {/* Organizer */}
        <Route
          path="/events/create"
          element={
            <PrivateRoute roles="Organizer">
              <CreateEventPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/events/edit/:id"
          element={
            <PrivateRoute roles="Organizer">
              <EditEventPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/organizer/my-events"
          element={
            <PrivateRoute roles="Organizer">
              <MyEventsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/organizer/dashboard"
          element={
            <PrivateRoute roles="Organizer">
              <OrganizerDashboardPage />
            </PrivateRoute>
          }
        />

        {/* Campus Admin */}
        <Route
          path="/campus-admin/room-requests"
          element={
            <PrivateRoute roles="Campus Admin">
              <CampusBookingRequestsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/campus-admin/analytics"
          element={
            <PrivateRoute roles="Campus Admin">
              <CampusRoomAnalyticsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/campus-admin/manage-buildings"
          element={
            <PrivateRoute roles="Campus Admin">
              <ManageBuildingsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/campus-admin/manage-rooms"
          element={
            <PrivateRoute roles="Campus Admin">
              <ManageRoomsPage />
            </PrivateRoute>
          }
        />

        {/* System Admin */}
        <Route path="/admin/*" element={<SystemAdminLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="pending-users" element={<PendingUsersPage />} />
          <Route path="pending-events" element={<PendingEventsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;

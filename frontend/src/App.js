import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
//import FeedbackPage from './pages/Feedback/FeedbackPage';
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
import CampusRoomManagementPage from './pages/campusAdmin/CampusRoomManagementPage';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<SplashScreen />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />
          <Route path="/mock-feedback" element={<EventFeedbackList eventId={1} />} />

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>

          {/* Independent Auth */}
          <Route path="/sso/callback" element={<SSOCallbackPage />} />
          <Route path="/request-role" element={<RequestRolePage />} />

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
               {/* <FeedbackPage /> */}
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

<<<<<<< HEAD
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

          {/* Campus Admin Routes */}
          <Route
          path="/campus-admin/room-requests"
          element={
          <PrivateRoute role="Campus Admin">
            <CampusBookingRequestsPage />
            </PrivateRoute>
          }
          />
          <Route
          path="/campus-admin/analytics"
          element={
          <PrivateRoute role="Campus Admin">
            <CampusRoomAnalyticsPage />
            </PrivateRoute>
        }
        />

        <Route
        path="/campus-admin/manage-rooms"
        element={
        <PrivateRoute role="Campus Admin">
          <CampusRoomManagementPage />
          </PrivateRoute>
        }
        />


          {/* System Admin Panel */}
          <Route path="/admin/*" element={<SystemAdminLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="pending-users" element={<PendingUsersPage />} />
            <Route path="pending-events" element={<PendingEventsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>


          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
=======
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />

        <Route path="/campus-map" element={<CampusMap />} />
      </Routes>
    </BrowserRouter>
>>>>>>> 017334182f9f58d8e135caad4823bf730cf4802e
  );
}

export default App;

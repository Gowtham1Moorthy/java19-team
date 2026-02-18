import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Resources from './pages/Resources';
import Bookings from './pages/Bookings';
import UserForm from './pages/UserForm';
import ResourceForm from './pages/ResourceForm';
import BookingForm from './pages/BookingForm';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="users/new" element={<UserForm />} />
            <Route path="users/:id/edit" element={<UserForm />} />
            <Route path="resources" element={<Resources />} />
            <Route path="resources/new" element={<ResourceForm />} />
            <Route path="resources/:id/edit" element={<ResourceForm />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="bookings/new" element={<BookingForm />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

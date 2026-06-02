import { Navigate, Outlet } from 'react-router-dom';
import { authStore } from '../stores/auth.store';

export default function ProtectedRoute() {
  return authStore.isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
}
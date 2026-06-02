import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import LowStockPage from './pages/LowStockPage';
import SettingsPage from './pages/SettingsPage';
import Layout from './components/Layout';
import ProtectedRoute from './routes/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          element={<ProtectedRoute />}
        >
          <Route element={<Layout />}>
            <Route
              path="/"
              element={<DashboardPage />}
            />

            <Route
              path="/products"
              element={<ProductsPage />}
            />

            <Route
              path="/low-stock"
              element={<LowStockPage />}
            />

            <Route
              path="/settings"
              element={<SettingsPage />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { OrdersProvider } from './context/OrdersContext';
import { ProductsProvider } from './context/ProductsContext';
import { AdminRoute } from './components/AdminRoute';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <OrdersProvider>
        <ProductsProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<AdminLogin />} />
              <Route
                path="/"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </ProductsProvider>
      </OrdersProvider>
    </AuthProvider>
  );
}

export default App;

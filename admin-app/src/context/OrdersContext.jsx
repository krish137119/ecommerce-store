import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../api/client';

const OrdersContext = createContext();

export function OrdersProvider({ children }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }
    try {
      const endpoint = user.role === 'admin' ? '/orders/all' : '/orders/mine';
      const data = await api(endpoint);
      setOrders(data.orders);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const updateOrderStatus = useCallback(async (orderId, status) => {
    const data = await api(`/orders/${orderId}/status`, { method: 'PATCH', body: { status } });
    setOrders(prev => prev.map(order => (order.id === orderId ? data.order : order)));
    return data.order;
  }, []);

  return (
    <OrdersContext.Provider value={{ orders, loading, updateOrderStatus }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}

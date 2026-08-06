import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from './AuthContext';

const CartContext = createContext();
const STORAGE_KEY = 'shopeasy-cart';

function loadCartFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to load cart from localStorage:', e);
  }
  return [];
}

function saveCartToStorage(cartItems) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  } catch (e) {
    console.warn('Failed to save cart to localStorage:', e);
  }
}

function toLocalItems(serverItems) {
  return (serverItems || []).map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    mrp: item.mrp || null,
    image: item.image,
    category: item.category,
    stock: item.stock,
    quantity: item.quantity
  }));
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const signedIn = Boolean(user);
  const userId = user?.id || null;
  const [cartItems, setCartItems] = useState(() => loadCartFromStorage());

  useEffect(() => {
    if (!signedIn) {
      setCartItems(loadCartFromStorage());
      return;
    }
    let cancelled = false;
    const localCart = loadCartFromStorage();
    (async () => {
      try {
        if (localCart.length > 0) {
          await api('/cart/merge', {
            method: 'POST',
            body: {
              items: localCart.map(item => ({ product: item.id, quantity: item.quantity }))
            }
          });
          localStorage.removeItem(STORAGE_KEY);
        }
        if (cancelled) {
          return;
        }
        const data = await api('/cart');
        if (!cancelled) {
          setCartItems(toLocalItems(data.items));
        }
      } catch {
        if (!cancelled) {
          setCartItems(localCart);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [signedIn, userId]);

  useEffect(() => {
    if (!signedIn) {
      saveCartToStorage(cartItems);
    }
  }, [cartItems, signedIn]);

  const applyServerCart = useCallback((data) => {
    setCartItems(toLocalItems(data.items));
  }, []);

  const addToCart = useCallback(async (product, quantity = 1) => {
    const available = Number(product?.stock);
    const existing = cartItems.find(item => item.id === product.id);
    if (Number.isFinite(available) && existing && existing.quantity + quantity > available) {
      return false;
    }
    if (signedIn) {
      try {
        const data = await api('/cart/items', {
          method: 'POST',
          body: { product: product.id, quantity }
        });
        applyServerCart(data);
        return true;
      } catch {
        return false;
      }
    }
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    return true;
  }, [signedIn, applyServerCart, cartItems]);

  const removeFromCart = useCallback((productId) => {
    if (signedIn) {
      api(`/cart/items/${productId}`, { method: 'DELETE' })
        .then(applyServerCart)
        .catch(() => {});
      return;
    }
    setCartItems(prev => prev.filter(item => item.id !== productId));
  }, [signedIn, applyServerCart]);

  const updateQuantity = useCallback((productId, quantity) => {
    if (signedIn) {
      api(`/cart/items/${productId}`, {
        method: 'PATCH',
        body: { quantity }
      })
        .then(applyServerCart)
        .catch(() => {});
      return;
    }
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item => {
        if (item.id !== productId) return item;
        const available = Number(item.stock);
        if (Number.isFinite(available)) {
          return { ...item, quantity: Math.min(quantity, available) };
        }
        return { ...item, quantity };
      })
    );
  }, [signedIn, applyServerCart, removeFromCart]);

  const clearCart = useCallback(() => {
    if (signedIn) {
      api('/cart', { method: 'DELETE' })
        .then(() => setCartItems([]))
        .catch(() => {});
      return;
    }
    setCartItems([]);
  }, [signedIn]);

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const cartCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AdminContext = createContext();

/** Generate a unique alphanumeric order code, e.g. "suf204" */
const generateOrderId = (existingOrders = []) => {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const digits  = '0123456789';
  const rand = (src, n) => Array.from({ length: n }, () => src[Math.floor(Math.random() * src.length)]).join('');
  let code;
  do {
    code = rand(letters, 3) + rand(digits, 3); // e.g. "suf204"
  } while (existingOrders.some(o => o.id === code));
  return code;
};

const MOCK_ORDERS = [

];

export function AdminProvider({ children }) {
  const readFromStorage = () => {
    try {
      const saved = localStorage.getItem('admin_orders');
      return saved ? JSON.parse(saved) : MOCK_ORDERS;
    } catch { return MOCK_ORDERS; }
  };

  const [orders, setOrders] = useState(readFromStorage);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('admin_auth') === 'true';
  });

  // Persist orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('admin_orders', JSON.stringify(orders));
  }, [orders]);

  // Auto-reload: cross-tab sync via storage event + 5s polling fallback
  useEffect(() => {
    const sync = () => {
      setOrders(readFromStorage());
      setLastRefreshed(new Date());
    };

    // Fires when ANOTHER tab writes to localStorage
    window.addEventListener('storage', sync);

    // Fallback polling every 5 seconds (catches same-tab edge cases)
    const timer = setInterval(sync, 5000);

    return () => {
      window.removeEventListener('storage', sync);
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('admin_auth', isAuthenticated);
  }, [isAuthenticated]);

  const login = (password) => {
    if (password === 'admin123') { // Mock password
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const addOrder = (orderData) => {
    const id = generateOrderId(orders);
    const newOrder = {
      ...orderData,
      id,
      status: 'pending',
      date: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
    return id;
  };

  const deleteOrder = (orderId) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
  };

  return (
    <AdminContext.Provider value={{ 
      orders, 
      isAuthenticated, 
      login, 
      logout, 
      updateOrderStatus,
      addOrder,
      deleteOrder 
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);

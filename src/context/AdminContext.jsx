import { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [adminToken, setAdminToken] = useState(() => {
    return localStorage.getItem('admin_token') || null;
  });

  const isAuthenticated = !!adminToken;
  
  // Helper to generate a random alphanumeric order ID locally
  const generateLocalOrderId = (length = 6) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Base API URLs - Uses deployed backend URL if online, or localhost locally
  const BACKEND_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const API_URL = `${BACKEND_BASE_URL}/api/orders`;
  const AUTH_URL = `${BACKEND_BASE_URL}/api/auth`;

  // Helper to get authorization headers
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    ...(adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {})
  });

  // Sync token to localStorage and verify on mount
  useEffect(() => {
    if (adminToken) {
      localStorage.setItem('admin_token', adminToken);
      // Optional: Verify on mount
      const verifyToken = async () => {
        try {
          const response = await fetch(`${AUTH_URL}/verify`, {
            headers: getAuthHeaders()
          });
          if (!response.ok) logout();
        } catch (err) {
          console.error("Token verification failed:", err);
        }
      };
      verifyToken();
    } else {
      localStorage.removeItem('admin_token');
    }
  }, [adminToken]);

  // Fetch orders from the backend (Protected route)
  const fetchOrders = async () => {
    // Only attempt to fetch if we have a token (since it's a protected route)
    if (!adminToken) return;

    try {
      const response = await fetch(API_URL, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          logout();
        }
        throw new Error(`Failed to fetch orders: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Ensure we have an array
      if (!Array.isArray(data)) {
        console.warn("Backend didn't return an array of orders:", data);
        setOrders([]);
        return;
      }
      
      // Map database fields to what the frontend expects
      const formattedOrders = data.map(order => {
        let normalizedStatus = (order.status || 'pending').toLowerCase();
        if (normalizedStatus === 'preparing' || normalizedStatus === 'ready') normalizedStatus = 'processing';
        
        return {
          ...order,
          id: order.orderId,
          date: order.createdAt || new Date().toISOString(), // Fallback date
          status: normalizedStatus
        };
      });
      setOrders(formattedOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  // Initial fetch and polling every 5 seconds for new orders
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      const timer = setInterval(fetchOrders, 5000);
      return () => clearInterval(timer);
    }
  }, [isAuthenticated, adminToken]);

  // Authenticate against backend
  const login = async (password) => {
    try {
      const response = await fetch(`${AUTH_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();
      
      if (response.ok) {
        setAdminToken(data.token);
        return { success: true };
      }
      return { success: false, error: data.error || 'Invalid Credentials' };
    } catch (err) {
      console.error("Login failed:", err);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    setAdminToken(null);
    setOrders([]);
  };

  // Update order status on the backend (Protected route)
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/${orderId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
      } else if (response.status === 401) {
        logout();
      }
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  // Add a new order to the backend (Public Route - No Auth Required)
  const addOrder = async (orderData) => {
    // 1. Generate a local orderId on the frontend first
    const generatedId = generateLocalOrderId();
    const finalOrderData = { ...orderData, orderId: generatedId };

    const verifyFinalStatus = async () => {
      // 2. Wait 1.5 seconds for the server to finish its background work
      await new Promise(r => setTimeout(r, 1500));
      try {
        const checkRes = await fetch(`${API_URL}/check/${generatedId}`);
        if (checkRes.ok) {
          const checkData = await checkRes.json();
          return checkData.found; // If found, show success!
        }
        return false;
      } catch (err) {
        return false;
      }
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalOrderData)
      });

      // CASE: Server Timeout or Network Error (5xx)
      if (response.status >= 500) {
        // Did it actually work? Let's double check!
        const trulySucceeded = await verifyFinalStatus();
        if (trulySucceeded) return { success: true, orderId: generatedId };
        return { success: false, error: 'Server error. Please try again later.' };
      }

      // Defensive checking for blank/non-JSON responses
      let data = {};
      try {
        data = await response.json();
      } catch (err) {
        // If status was OK, it's definitely a success
        if (response.ok) return { success: true, orderId: generatedId };
        
        // Double check on parse error!
        const trulySucceeded = await verifyFinalStatus();
        if (trulySucceeded) return { success: true, orderId: generatedId };
        return { success: false, error: 'System busy. We will update you shortly.' };
      }

      if (!response.ok) {
        // If the backend sent a 4xx custom error, don't lie to the user
        return { success: false, error: data.error || data.message || 'Server error' };
      }

      return { success: true, orderId: generatedId }; 
    } catch (err) {
      console.error("Error adding order:", err);
      
      // LAST CHANCE: On a network failure, let's verify if the order was saved
      const trulySucceeded = await verifyFinalStatus();
      if (trulySucceeded) return { success: true, orderId: generatedId };
      
      return { success: false, error: 'The kitchen is unreachable. Please check your connection.' };
    }
  };

  // Delete an order from the backend (Protected route)
  const deleteOrder = async (orderId) => {
    try {
      const response = await fetch(`${API_URL}/${orderId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        setOrders(prev => prev.filter(order => order.id !== orderId));
      } else if (response.status === 401) {
        logout();
      }
    } catch (err) {
      console.error("Error deleting order:", err);
    }
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
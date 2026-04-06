import { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [adminToken, setAdminToken] = useState(() => {
    return localStorage.getItem('admin_token') || null;
  });

  const isAuthenticated = !!adminToken;

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
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      // Defensive checking for blank/non-JSON responses
      let data = {};
      try {
        data = await response.json();
      } catch (err) {
        console.error("Critical: Backend sent non-JSON response:", err);
        // If it was OK but failed parsing, it's still technically a success if we trust the status
        if (response.ok) return { success: true, orderId: 'GEN-SUCCESS' };
        return { success: false, error: 'Server sent an invalid response format.' };
      }

      console.log("Backend response received:", data);

      if (!response.ok) {
        return { success: false, error: data.error || data.message || 'Server error' };
      }

      // Check for success flag explicitly if present
      if (data.success === false) {
        return { success: false, error: data.error || 'Server rejected order.' };
      }

      const orderResult   = data.order ? data.order : data;
      const finalOrderId  = data.orderId ? data.orderId : (data.order ? data.order.orderId : null);

      if (!finalOrderId) {
        console.warn("Backend responded without an orderId, but response was OK.", data);
        // Fallback to a success state if the server actually said 201
        if (response.status === 201) return { success: true, orderId: 'NEW' };
        return { success: false, error: 'Unexpected server response format' };
      }
      
      const formattedOrder = {
        ...orderResult,
        id: finalOrderId,
        date: orderResult.createdAt || new Date().toISOString()
      };
      
      if (adminToken) {
        setOrders(prev => [formattedOrder, ...prev]);
      }
      
      return { success: true, orderId: finalOrderId }; 
    } catch (err) {
      console.error("Error adding order:", err);
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
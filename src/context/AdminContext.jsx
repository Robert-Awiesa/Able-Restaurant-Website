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

  // Sync token to localStorage
  useEffect(() => {
    if (adminToken) {
      localStorage.setItem('admin_token', adminToken);
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
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      
      // Map database fields to what the frontend expects
      const formattedOrders = data.map(order => {
        let normalizedStatus = (order.status || 'pending').toLowerCase();
        if (normalizedStatus === 'preparing' || normalizedStatus === 'ready') normalizedStatus = 'processing';
        
        return {
          ...order,
          id: order.orderId,
          date: order.createdAt,
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

      if (response.ok) {
        const data = await response.json();
        setAdminToken(data.token);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
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

      if (!response.ok) {
        console.error("Order creation failed HTTP status:", response.status);
        return null;
      }

      const data = await response.json();

      // NEW: Check if the backend confirms success with my new explicit flag
      if (!data.success || !data.orderId) {
        console.error("Backend didn't confirm order success:", data);
        return null;
      }
      
      const newOrder = data.order;
      const formattedOrder = {
        ...newOrder,
        id: data.orderId,
        date: newOrder.createdAt
      };
      
      // Update local state if admin is currently viewing
      if (adminToken) {
        setOrders(prev => [formattedOrder, ...prev]);
      }
      
      return data.orderId; // Return true success!
    } catch (err) {
      console.error("Error adding order:", err);
      return null;
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
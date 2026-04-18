import { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [checkingAuth, setCheckingAuth] = useState(true);
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
  const MESSAGES_URL = `${BACKEND_BASE_URL}/api/messages`;

  // Helper to get authorization headers
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    ...(adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {})
  });

  // Verify token on initial mount
  useEffect(() => {
    const verifyInitialAuth = async () => {
      if (!adminToken) {
        setCheckingAuth(false);
        return;
      }

      try {
        const response = await fetch(`${AUTH_URL}/verify`, {
          headers: getAuthHeaders()
        });
        if (!response.ok) {
          logout();
        }
      } catch (err) {
        console.error("Auth verification failed:", err);
      } finally {
        setCheckingAuth(false);
      }
    };

    verifyInitialAuth();
  }, []);

  // Sync token changes to localStorage
  useEffect(() => {
    if (adminToken) {
      localStorage.setItem('admin_token', adminToken);
    } else {
      localStorage.removeItem('admin_token');
    }
  }, [adminToken]);

  // Fetch orders from the backend (Protected route)
  const fetchOrders = async () => {
    if (!adminToken) return;
    try {
      const response = await fetch(API_URL, {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        if (response.status === 401) logout();
        throw new Error(`Failed to fetch orders: ${response.statusText}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        setOrders([]);
        return;
      }
      const formattedOrders = data.map(order => {
        let normalizedStatus = (order.status || 'pending').toLowerCase();
        if (normalizedStatus === 'preparing' || normalizedStatus === 'ready') normalizedStatus = 'processing';
        return {
          ...order,
          id: order.orderId,
          date: order.createdAt || new Date().toISOString(),
          status: normalizedStatus
        };
      });
      setOrders(formattedOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  // Fetch messages from the backend (Protected route)
  const fetchMessages = async () => {
    if (!adminToken) return;
    try {
      const response = await fetch(MESSAGES_URL, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else if (response.status === 401) {
        logout();
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // Initial fetch and polling every 5 seconds for new orders and messages
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      fetchMessages();
      const timer = setInterval(() => {
        fetchOrders();
        fetchMessages();
      }, 5000);
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
    setMessages([]);
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

  // Update message status
  const updateMessageStatus = async (messageId, newStatus) => {
    try {
      const response = await fetch(`${MESSAGES_URL}/${messageId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        const updated = await response.json();
        setMessages(prev => prev.map(msg => msg._id === messageId ? updated : msg));
      }
    } catch (err) {
      console.error("Error updating message status:", err);
    }
  };

  // Delete message
  const deleteMessage = async (messageId) => {
    try {
      const response = await fetch(`${MESSAGES_URL}/${messageId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        setMessages(prev => prev.filter(msg => msg._id !== messageId));
      }
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  // Add a new order to the backend (Public Route - No Auth Required)
  const addOrder = async (orderData) => {
    const generatedId = generateLocalOrderId();
    const finalOrderData = { ...orderData, orderId: generatedId };
    const verifyFinalStatus = async () => {
      await new Promise(r => setTimeout(r, 1500));
      try {
        const checkRes = await fetch(`${API_URL}/check/${generatedId}`);
        if (checkRes.ok) {
          const checkData = await checkRes.json();
          return checkData.found;
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
      if (response.status >= 500) {
        const trulySucceeded = await verifyFinalStatus();
        if (trulySucceeded) return { success: true, orderId: generatedId };
        return { success: false, error: 'Server error. Please try again later.' };
      }
      let data = {};
      try {
        data = await response.json();
      } catch (err) {
        if (response.ok) return { success: true, orderId: generatedId };
        const trulySucceeded = await verifyFinalStatus();
        if (trulySucceeded) return { success: true, orderId: generatedId };
        return { success: false, error: 'System busy. We will update you shortly.' };
      }
      if (!response.ok) {
        return { success: false, error: data.error || data.message || 'Server error' };
      }
      return { success: true, orderId: generatedId }; 
    } catch (err) {
      console.error("Error adding order:", err);
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
      messages,
      isAuthenticated, 
      checkingAuth,
      login, 
      logout, 
      updateOrderStatus,
      updateMessageStatus,
      deleteMessage,
      addOrder,
      deleteOrder 
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
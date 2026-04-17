import { StrictMode } from 'react';
import { createRoot }  from 'react-dom/client';
import App             from './App';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AdminProvider>
  </StrictMode>
);

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const CURRENCY = 'GH₵';

const parsePrice = (priceStr) => {
  if (typeof priceStr === 'number') return priceStr;
  const cleaned = String(priceStr).replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id && i.selectedSize === item.selectedSize
      );
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.selectedSize === item.selectedSize
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id, selectedSize) => {
    setCartItems((prev) =>
      prev.filter((i) => !(i.id === id && i.selectedSize === selectedSize))
    );
  };

  const updateQuantity = (id, selectedSize, delta) => {
    setCartItems((prev) =>
      prev.map((i) => {
        if (i.id === id && i.selectedSize === selectedSize) {
          const newQty = Math.max(1, i.quantity + delta);
          return { ...i, quantity: newQty };
        }
        return i;
      })
    );
  };


  const clearCart = () => setCartItems([]);

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
    if (!isCartOpen) setIsFavoritesOpen(false);
  };

  const addToFavorites = (item) => {
    setFavorites((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeFromFavorites = (id) => {
    setFavorites((prev) => prev.filter((i) => i.id !== id));
  };

  const isFavorite = (id) => favorites.some((i) => i.id === id);

  const clearFavorites = () => setFavorites([]);

  const toggleFavorites = () => {
    setIsFavoritesOpen((prev) => !prev);
    if (!isFavoritesOpen) setIsCartOpen(false);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const favoritesCount = favorites.length;
  
  const subtotal = cartItems.reduce((acc, item) => {
    return acc + parsePrice(item.price) * item.quantity;
  }, 0);

  const cartTax = subtotal * 0.10;
  const cartTotal = subtotal + cartTax;

  const [customerOrders, setCustomerOrders] = useState(() => {
    const saved = localStorage.getItem('customer_orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('customer_orders', JSON.stringify(customerOrders));
  }, [customerOrders]);

  const addCustomerOrder = (order) => {
    setCustomerOrders((prev) => [
      { ...order, viewed: false, createdAt: new Date().toISOString() },
      ...prev,
    ]);
  };

  const markOrdersAsViewed = () => {
    setCustomerOrders((prev) => prev.map((o) => ({ ...o, viewed: true })));
  };

  const unreadOrdersCount = customerOrders.filter((o) => !o.viewed).length;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCart,
        cartCount,
        subtotal,
        cartTax,
        cartTotal,
        favorites,
        favoritesCount,
        isFavoritesOpen,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        clearFavorites,
        toggleFavorites,
        customerOrders,
        addCustomerOrder,
        markOrdersAsViewed,
        unreadOrdersCount,
        CURRENCY,
        parsePrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );

}

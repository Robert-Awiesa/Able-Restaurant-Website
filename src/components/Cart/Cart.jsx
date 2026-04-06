import { useState }   from 'react';
import { useCart }    from '../../context/CartContext';
import { useAdmin }   from '../../context/AdminContext';
import styles         from './Cart.module.css';

/**
 * Cart
 * Overlay cart component that displays added items.
 */
export default function Cart() {
  const { 
    cartItems, 
    isCartOpen, 
    toggleCart, 
    removeFromCart, 
    updateQuantity, 
    subtotal,
    cartTax,
    cartTotal,
    CURRENCY,
    parsePrice,
    clearCart
  } = useCart();

  const { addOrder } = useAdmin();
  const [orderType, setOrderType] = useState('delivery');
  const [location, setLocation]   = useState('');
  const [customerName, setCustomerName] = useState('');
  const [contact, setContact]     = useState('');
  const [orderTimeType, setOrderTimeType] = useState('asap');
  const [scheduledTime, setScheduledTime] = useState('');
  const [modal, setModal] = useState(null); // { type: 'success'|'error', message, orderId? }

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    if (!customerName.trim()) {
      setModal({ type: 'error', message: 'Please enter your name.' });
      return;
    }
    if (!contact.trim()) {
      setModal({ type: 'error', message: 'Please enter your contact number.' });
      return;
    }
    if (orderType === 'delivery' && !location.trim()) {
      setModal({ type: 'error', message: 'Please provide a delivery location.' });
      return;
    }

    const newOrder = {
      name: customerName.trim(),
      phone: contact.trim(),
      items: cartItems.map(item => ({ name: item.name, qty: item.quantity })),
      total: cartTotal,
      orderType,
      location: orderType === 'delivery' ? location : (orderType === 'dine-in' ? 'Table Order' : 'Store Pickup'),
      requestedTime: orderTimeType === 'asap' ? 'ASAP' : formatTime(scheduledTime)
    };

    const result = await addOrder(newOrder);
    
    if (result.success) {
      setModal({ type: 'success', orderId: result.orderId });
      clearCart();
      setLocation('');
      setCustomerName('');
      setContact('');
      setOrderTimeType('asap');
      setScheduledTime('');
    } else {
      setModal({ type: 'error', message: result.error });
    }
  };

  const handleModalOk = () => {
    setModal(null);
    if (modal?.type === 'success') toggleCart();
  };

  const formatTime = (time) => {
    if (!time) return 'Pending';
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  if (!isCartOpen) return null;

  return (
    <section 
      className={`${styles.cartContainer} ${isCartOpen ? styles.active : ''}`}
      aria-label="Shopping Cart Overlay"
    >
      <div className={styles.overlay} onClick={toggleCart} />
      
      <div className={styles.cartBox}>
        <div className={styles.header}>
          <h3>Your Shopping Cart</h3>
          <button 
            className={styles.closeBtn} 
            onClick={toggleCart}
            aria-label="Close cart"
          >
            <i className="fa-solid fa-times" aria-hidden="true" />
          </button>
        </div>

        <div className={styles.scrollBody}>
          {cartItems.length === 0 ? (
            <div className={styles.emptyMsg}>
              <i className="fa-solid fa-shopping-basket" aria-hidden="true" />
              <p>Your cart is empty.</p>
            </div>
          ) : (
            <>
              <div className={styles.itemsList}>
                {cartItems.map((item) => {
                  const unitPrice = parsePrice(item.price);
                  const itemTotal = unitPrice * item.quantity;

                  return (
                    <div key={item.id} className={styles.cartItem}>
                      <img src={item.image} alt={item.name} className={styles.itemImg} />
                      <div className={styles.itemContent}>
                        <h4>{item.name}</h4>
                        <div className={styles.priceContainer}>
                          <span className={styles.unitPrice}>Unit: {item.price}</span>
                          {item.quantity > 1 && (
                            <span className={styles.itemTotal}>Total: {CURRENCY}{itemTotal.toFixed(2)}</span>
                          )}
                        </div>
                        <div className={styles.qtyControls}>
                          <button onClick={() => updateQuantity(item.id, -1)} aria-label="Decrease quantity">
                            <i className="fa-solid fa-minus" />
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} aria-label="Increase quantity">
                            <i className="fa-solid fa-plus" />
                          </button>
                        </div>
                      </div>
                      <button 
                        className={styles.deleteBtn} 
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <i className="fa-solid fa-trash" aria-hidden="true" />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className={styles.footer}>
                {/* Order Type Selection */}
                <div className={styles.orderTypeSelector}>
                  <p>How would you like your order?</p>
                  <div className={styles.typeButtons}>
                    {['delivery', 'pickup', 'dine-in'].map(type => (
                      <button 
                        key={type}
                        className={orderType === type ? styles.typeActive : ''}
                        onClick={() => setOrderType(type)}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                  {/* Name & Contact — shown for all order types */}
                  <input
                    type="text"
                    placeholder="Your name"
                    className={styles.locationInput}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                  <input
                    type="tel"
                    placeholder="Contact number"
                    className={styles.locationInput}
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                  />

                  {/* Delivery address — shown only for delivery */}
                  {orderType === 'delivery' && (
                    <input 
                      type="text" 
                      placeholder="Delivery location / address" 
                      className={styles.locationInput}
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  )}

                  {/* Time Selector */}
                  {(orderType === 'delivery' || orderType === 'pickup') && (
                    <div className={styles.timeSelector}>
                      <div className={styles.timeOptions}>
                        <button 
                          className={orderTimeType === 'asap' ? styles.timeActive : ''}
                          onClick={() => setOrderTimeType('asap')}
                        >
                          ASAP
                        </button>
                        <button 
                          className={orderTimeType === 'scheduled' ? styles.timeActive : ''}
                          onClick={() => setOrderTimeType('scheduled')}
                        >
                          Schedule
                        </button>
                      </div>
                      {orderTimeType === 'scheduled' && (
                        <input 
                          type="time" 
                          className={styles.timeInput}
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          required
                        />
                      )}
                    </div>
                  )}
                </div>

                <div className={styles.totalRow}>
                  <span>Subtotal:</span>
                  <span className={styles.amount}>{CURRENCY}{subtotal.toFixed(2)}</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Tax (10%):</span>
                  <span className={styles.amount}>{CURRENCY}{cartTax.toFixed(2)}</span>
                </div>
                <div className={`${styles.totalRow} ${styles.finalTotal}`}>
                  <span>Total Cost:</span>
                  <span className={styles.totalAmount}>{CURRENCY}{cartTotal.toFixed(2)}</span>
                </div>
                <button className={styles.checkoutBtn} onClick={handleCheckout}>
                  Checkout Now & Order
                </button>
              </div>
            </>
          )}
        </div>

        {/* ── Custom Modal ── */}
        {modal && (
          <div className={styles.modalBackdrop}>
            <div className={`${styles.modalCard} ${modal.type === 'success' ? styles.modalSuccess : styles.modalError}`}>
              <div className={styles.modalIcon}>
                {modal.type === 'success'
                  ? <i className="fa-solid fa-circle-check" />
                  : <i className="fa-solid fa-circle-exclamation" />
                }
              </div>
              {modal.type === 'success' ? (
                <>
                  <h4>Order Placed!</h4>
                  <p>Your order <strong>#{modal.orderId}</strong> has been received by our kitchen.</p>
                  <p className={styles.modalSub}>You'll be served shortly. Thank you! 🍽️</p>
                </>
              ) : (
                <>
                  <h4>Oops!</h4>
                  <p>{modal.message}</p>
                </>
              )}
              <button className={styles.modalOkBtn} onClick={handleModalOk}>
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

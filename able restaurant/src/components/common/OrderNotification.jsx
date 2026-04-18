import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import styles from './OrderNotification.module.css';

/**
 * OrderNotification
 * Floating notification bar that allows customers to track their order history.
 */
export default function OrderNotification() {
  const { customerOrders, unreadOrdersCount, markOrdersAsViewed, CURRENCY } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    if (!isOpen) {
      markOrdersAsViewed();
    }
    setIsOpen(!isOpen);
  };

  // if (customerOrders.length === 0 && unreadOrdersCount === 0) return null;


  return (
    <div className={styles.notificationWrapper}>
      {/* Floating Button */}
      <button 
        className={styles.floatingBtn} 
        onClick={toggleOpen}
        aria-label="View your order history"
      >
        <i className="fa-solid fa-receipt" />
        {unreadOrdersCount > 0 && <span className={styles.badge}>{unreadOrdersCount}</span>}
      </button>

      {/* History Panel */}
      <div className={`${styles.historyPanel} ${isOpen ? styles.active : ''}`}>
        <div className={styles.header}>
          <h3>Your Order History</h3>
          <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
            <i className="fa-solid fa-times" />
          </button>
        </div>

        <div className={styles.scrollArea}>
          {customerOrders.length === 0 ? (
            <p className={styles.emptyMsg}>No orders made yet.</p>
          ) : (
            customerOrders.map((order, idx) => (
              <div key={order.orderId + idx} className={styles.orderCard}>
                <div className={styles.orderHead}>
                  <span className={styles.orderId}>#{order.orderId}</span>
                  <span className={styles.orderDate}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles.orderItems}>
                  {order.items.map((item, i) => (
                    <div key={i} className={styles.itemRow}>
                      {item.qty}x {item.name}
                    </div>
                  ))}
                </div>
                <div className={styles.orderFooter}>
                  <span className={styles.typeTag}>{order.orderType}</span>
                  <span className={styles.total}>{CURRENCY}{order.total.toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import LoginForm    from './LoginForm';
import styles       from './AdminDashboard.module.css';

/**
 * AdminDashboard
 * High-level layout for the administrative interface.
 */
/**
 * AdminDashboard
 * High-level layout for the administrative interface.
 */
export default function AdminDashboard() {
  const { 
    isAuthenticated, 
    checkingAuth, 
    logout, 
    orders, 
    messages, 
    updateOrderStatus, 
    updateMessageStatus,
    deleteMessage,
    deleteOrder 
  } = useAdmin();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'history' | 'messages'
  const [confirmDelete, setConfirmDelete] = useState(null); // { id: string, type: 'order' | 'message' } | null

  // Show a simple loading screen while verifying the token
  if (checkingAuth) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
        Verifying Session...
      </div>
    );
  }

  if (!isAuthenticated) return <LoginForm />;

  const handleDeleteClick = (id, type = 'order') => {
    setConfirmDelete({ id, type });
  };

  const handleConfirmDelete = async () => {
    if (confirmDelete) {
      if (confirmDelete.type === 'order') {
        await deleteOrder(confirmDelete.id);
      } else {
        await deleteMessage(confirmDelete.id);
      }
      setConfirmDelete(null);
    }
  };

  const pendingCount    = orders.filter(o => o.status === 'pending').length;
  const processingCount = orders.filter(o => o.status === 'processing').length;
  const completedCount  = orders.filter(o => o.status === 'completed').length;
  const totalRevenue    = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total, 0);
  const unreadMessages  = messages.filter(m => m.status === 'unread').length;

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTitle}>
          <i className="fa-solid fa-gauge-high" />
          <span>Able Admin</span>
        </div>

        <nav className={styles.nav}>
          <div 
            className={`${styles.navItem} ${activeTab === 'orders' ? styles.navItemActive : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <i className="fa-solid fa-list-check" />
            <span className={styles.navText}>Live Orders</span>
          </div>
          <div 
            className={`${styles.navItem} ${activeTab === 'history' ? styles.navItemActive : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <i className="fa-solid fa-clock-rotate-left" />
            <span className={styles.navText}>History</span>
          </div>
          <div 
            className={`${styles.navItem} ${activeTab === 'messages' ? styles.navItemActive : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            <i className="fa-solid fa-envelope" />
            <span className={styles.navText}>Messages</span>
            {unreadMessages > 0 && <span className={styles.badge}>{unreadMessages}</span>}
          </div>
        </nav>

        <div className={styles.logoutBtn} onClick={logout}>
          <i className="fa-solid fa-sign-out-alt" />
          <span>Logout</span>
        </div>
      </aside>

      <main className={styles.content}>
        <div className={styles.header}>
          <h2>
            {activeTab === 'orders' && 'Live Order Tracking'}
            {activeTab === 'history' && 'Order History'}
            {activeTab === 'messages' && 'Customer Messages'}
          </h2>
          <div className={styles.adminInfo}>
            <span>Welcome, Manager</span>
          </div>
        </div>

        {activeTab === 'orders' && (
          <div className={styles.stats}>
            <StatCard title="Pending" value={pendingCount} icon="fa-hourglass-start" color="#f1c40f" />
            <StatCard title="Processing" value={processingCount} icon="fa-spinner fa-spin" color="#3498db" />
            <StatCard title="Completed" value={completedCount} icon="fa-check-circle" color="#2ecc71" />
            <StatCard title="Total Revenue" value={`GH₵ ${totalRevenue.toFixed(2)}`} icon="fa-money-bill-trend-up" color="#27ae60" />
          </div>
        )}

        <div className={styles.orderGrid}>
          {activeTab === 'messages' ? (
            <MessageCards 
              messages={messages} 
              onUpdate={updateMessageStatus} 
              onDelete={(id) => handleDeleteClick(id, 'message')} 
            />
          ) : (
            <OrderCards 
              orders={orders} 
              tab={activeTab} 
              onUpdate={updateOrderStatus} 
              onDelete={(id) => handleDeleteClick(id, 'order')} 
            />
          )}
        </div>
      </main>

      {/* ── Confirmation Modal ── */}
      {confirmDelete && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmCard}>
            <div className={styles.confirmIcon}>
              <i className="fa-solid fa-triangle-exclamation" />
            </div>
            <h4>Wait a moment!</h4>
            <p>Are you sure you want to permanently delete this {confirmDelete.type}? This action cannot be undone.</p>
            <div className={styles.confirmActions}>
              <button className={styles.cancelBtn} onClick={() => setConfirmDelete(null)}>No, Keep it</button>
              <button className={styles.confirmBtn} onClick={handleConfirmDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon} style={{ background: `${color}15`, color: color }}>
        <i className={`fa-solid ${icon}`} />
      </div>
      <div className={styles.statInfo}>
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
    </div>
  );
}

function OrderCards({ orders, tab, onUpdate, onDelete }) {
  const filtered = orders
    .filter(o => tab === 'history' ? o.status === 'completed' : o.status !== 'completed')
    .sort((a,b) => new Date(b.date) - new Date(a.date));

  if (filtered.length === 0) {
    return <p style={{ padding: '3rem', fontSize: '1.6rem', textAlign: 'center' }}>No orders found.</p>;
  }

  return (
    <div className={styles.cardsScroll}>
      {filtered.map(order => (
        <div key={order.id} className={`${styles.orderCard} ${order.orderType === 'delivery' ? styles.deliveryCard : ''}`}>
          <div className={styles.cardHeader}>
            <span className={styles.orderId}>#{order.id}</span>
            <span className={`${styles.status} ${styles[order.status]}`}>{order.status}</span>
          </div>

          <div className={styles.cardBody}>
            <div className={styles.customerInfo}>
              <strong>{order.name}</strong>
              <p><i className="fa-solid fa-phone" /> {order.phone}</p>
            </div>

            <div className={styles.typeInfo}>
              <div className={styles.typeLabel}>
                {order.orderType === 'delivery' && <i className="fa-solid fa-person-biking" style={{ color: '#e67e22' }} />}
                {order.orderType === 'pickup' && <i className="fa-solid fa-store" style={{ color: '#3498db' }} />}
                {order.orderType === 'dine-in' && <i className="fa-solid fa-utensils" style={{ color: '#9b59b6' }} />}
                <span className={styles.typeName}>{order.orderType}</span>
              </div>
              <div className={styles.requestedTime}>
                <i className="fa-solid fa-clock" /> {order.requestedTime || 'ASAP'}
              </div>
              {order.orderType === 'delivery' && (
                <div className={styles.locationDetail}>
                  <i className="fa-solid fa-location-dot" /> {order.location}
                </div>
              )}
            </div>

            <div className={styles.itemsList}>
              {order.items.map((item, i) => (
                <div key={i} className={styles.itemRow}>
                  <div className={styles.itemMain}>
                    <span className={styles.itemQty}>{item.qty}x</span>
                    <span className={styles.itemName}>{item.name}</span>
                    {item.size && <span className={styles.itemSize}>({item.size})</span>}
                  </div>
                  <span className={styles.itemRowPrice}>{item.price}</span>
                </div>
              ))}
            </div>

            <div className={styles.totalRow}>
              <span>Total:</span>
              <span className={styles.price}>GH₵ {order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className={styles.cardFooter}>
            <span className={styles.timeTag}>
              {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <div className={styles.actions}>
              {order.status === 'pending' && (
                <button className={styles.actionBtn} onClick={() => onUpdate(order.id, 'processing')}>Process</button>
              )}
              {order.status === 'processing' && (
                <button className={`${styles.actionBtn} ${styles.completeBtn}`} onClick={() => onUpdate(order.id, 'completed')}>Complete</button>
              )}
              <button className={styles.deleteBtn} onClick={() => onDelete(order.id)} title="Delete Order">
                <i className="fa-solid fa-trash" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MessageCards({ messages, onUpdate, onDelete }) {
  if (messages.length === 0) {
    return <p style={{ padding: '3rem', fontSize: '1.6rem', textAlign: 'center' }}>No messages received yet.</p>;
  }

  return (
    <div className={styles.cardsScroll}>
      {messages.map((msg) => (
        <div key={msg._id} className={`${styles.orderCard} ${msg.status === 'read' ? styles.readCard : ''}`}>
          <div className={styles.cardHeader}>
            <span className={styles.orderId}>
              <i className="fa-solid fa-hashtag" style={{ fontSize: '1.2rem', marginRight: '0.5rem', opacity: 0.5 }} />
              {msg.subject}
            </span>
            <span className={`${styles.status} ${styles[msg.status]}`}>{msg.status}</span>
          </div>

          <div className={styles.cardBody}>
            <div className={styles.customerInfo}>
              <strong>{msg.name}</strong>
              <p><i className="fa-solid fa-envelope" /> {msg.email}</p>
              <p><i className="fa-solid fa-phone" /> {msg.phone}</p>
            </div>

            <div className={styles.messageContent}>
              {msg.message}
            </div>

            <div className={styles.timeRow}>
               <i className="fa-solid fa-calendar-day" />
               <span>Received: {new Date(msg.createdAt).toLocaleDateString()} at {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          <div className={styles.cardFooter}>
            <div className={styles.actions}>
              {msg.status === 'unread' && (
                <button className={styles.actionBtn} onClick={() => onUpdate(msg._id, 'read')}>
                  <i className="fa-solid fa-check-double" style={{ marginRight: '0.5rem' }} />
                  Mark Read
                </button>
              )}
              <button className={styles.deleteBtn} onClick={() => onDelete(msg._id)} title="Delete Message">
                <i className="fa-solid fa-trash-can" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


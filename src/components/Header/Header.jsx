import { useNavbar }     from '../../hooks/useNavbar';
import { useScrollSpy }  from '../../hooks/useScrollSpy';
import { useCart }       from '../../context/CartContext';
import styles            from './Header.module.css';

const NAV_LINKS = [
  { label: 'Home',   href: '#home' },
  { label: 'Dishes', href: '#dishes' },
  { label: 'About',  href: '#about' },
  { label: 'Menu',   href: '#menu' },
  { label: 'Review', href: '#review' },
  { label: 'Contact', href: '#contact' },
];

const SECTION_IDS = NAV_LINKS.map((l) => l.href.slice(1));

/**
 * Header
 * Fixed top navigation bar.
 *
 * @param {function} onSearchOpen - opens the search overlay
 */
export default function Header({ onSearchOpen }) {
  const { isOpen, toggle, close }           = useNavbar();
  const activeId                            = useScrollSpy(SECTION_IDS);
  const { toggleCart, cartCount, toggleFavorites, favoritesCount } = useCart();

  return (
    <header className={styles.header}>
      {/* Logo */}
      <a href="#home" className={styles.logo} aria-label="Able-restro home">
        <i className="fa-solid fa-utensils" aria-hidden="true" />
        Able restaurant
      </a>

      {/* Navigation */}
      <nav
        className={`${styles.navbar} ${isOpen ? styles.navbarOpen : ''}`}
        aria-label="Primary navigation"
      >
        {NAV_LINKS.map(({ label, href }) => {
          const id       = href.slice(1);
          const isActive = activeId === id;
          return (
            <a
              key={id}
              href={href}
              className={isActive ? styles.navLinkActive : styles.navLink}
              aria-current={isActive ? 'page' : undefined}
              onClick={close}
            >
              {label}
            </a>
          );
        })}
      </nav>

      {/* Icon bar */}
      <div className={styles.icons}>
        {/* Mobile hamburger */}
        <button
          className={`${styles.iconBtn} ${styles.menuBtn}`}
          onClick={toggle}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          id="menu-bars"
        >
          <i className={isOpen ? 'fa-solid fa-times' : 'fa-solid fa-bars'} aria-hidden="true" />
        </button>

        {/* Search */}
        <button
          className={styles.iconBtn}
          onClick={onSearchOpen}
          aria-label="Open search"
        >
          <i className="fa-solid fa-search" aria-hidden="true" />
        </button>

        {/* Favorites (Wishlist) */}
        <button 
          className={styles.iconBtn} 
          onClick={toggleFavorites} 
          aria-label="Favorites"
        >
          <i className="fa-solid fa-heart" aria-hidden="true" />
          {favoritesCount > 0 && <span className={styles.badge}>{favoritesCount}</span>}
        </button>

        {/* Cart */}
        <button 
          className={styles.iconBtn} 
          onClick={toggleCart} 
          aria-label="Shopping cart"
        >
          <i className="fa-solid fa-shopping-cart" aria-hidden="true" />
          {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
        </button>
      </div>
    </header>
  );
}

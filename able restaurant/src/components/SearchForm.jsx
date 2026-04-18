import { useRef, useEffect, useState } from 'react';
import { dishes }    from './data/dishes';
import { menuItems } from './data/menuItems';
import { useCart }   from '../context/CartContext';
import styles        from './SearchForm.module.css';

/**
 * SearchForm
 * Full-screen search overlay with live results.
 */
export default function SearchForm({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const { addToCart, CURRENCY } = useCart();
  const inputRef = useRef(null);

  // Combine all searchable items
  const allItems = [...dishes, ...menuItems];

  /* Auto-focus the input when the overlay opens */
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  /* Prevent background scroll while open */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  function handleSearch(e) {
    const val = e.target.value;
    setQuery(val);

    if (val.trim().length > 1) {
      const filtered = allItems.filter((item) =>
        item.name.toLowerCase().includes(val.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    onClose();
  }

  return (
    <div
      className={`${styles.overlay} ${isOpen ? styles.overlayActive : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <label htmlFor="search-box" className={styles.visuallyHidden}>
          Search
        </label>
        <input
          ref={inputRef}
          type="search"
          id="search-box"
          name="search"
          placeholder="search here..."
          className={styles.input}
          autoComplete="off"
          value={query}
          onChange={handleSearch}
        />
        <button type="submit" className={styles.searchBtn} aria-label="Submit search">
          <i className="fa-solid fa-search" aria-hidden="true" />
        </button>
      </form>

      {query.length > 1 && (
        <div className={styles.resultsContainer}>
          {results.length > 0 ? (
            <div className={styles.resultsList}>
              {results.map((item) => (
                <div key={`${item.id}-${item.name}`} className={styles.resultItem}>
                  <img src={item.image} alt={item.name} className={styles.resultImg} />
                  <div className={styles.resultInfo}>
                    <h4>{item.name}</h4>
                    <span>{item.price}</span>
                  </div>
                  <button 
                    className={styles.addBtn}
                    onClick={() => {
                      addToCart(item);
                      onClose();
                    }}
                  >
                    <i className="fa-solid fa-cart-plus" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.noResults}>No items found for &quot;{query}&quot;</p>
          )}
        </div>
      )}

      <button
        className={styles.closeBtn}
        onClick={onClose}
        aria-label="Close search"
      >
        <i className="fa-solid fa-times" aria-hidden="true" />
      </button>
    </div>
  );
}

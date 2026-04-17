import { useCart } from '../../context/CartContext';
import styles  from './Favorites.module.css';

/**
 * Favorites
 * Overlay component that displays saved favorite items.
 */
export default function Favorites() {
  const { 
    favorites, 
    isFavoritesOpen, 
    toggleFavorites, 
    removeFromFavorites, 
    addToCart,
    clearFavorites,
    CURRENCY
  } = useCart();

  if (!isFavoritesOpen) return null;

  return (
    <section 
      className={`${styles.favContainer} ${isFavoritesOpen ? styles.active : ''}`}
      aria-label="Favorites Overlay"
    >
      <div className={styles.overlay} onClick={toggleFavorites} />
      
      <div className={styles.favBox}>
        <div className={styles.header}>
          <h3>Your Favorites</h3>
          <button 
            className={styles.closeBtn} 
            onClick={toggleFavorites}
            aria-label="Close favorites"
          >
            <i className="fa-solid fa-times" aria-hidden="true" />
          </button>
        </div>

        {favorites.length === 0 ? (
          <div className={styles.emptyMsg}>
            <i className="fa-solid fa-heart-crack" aria-hidden="true" />
            <p>No favorites yet. Add some!</p>
          </div>
        ) : (
          <>
            <div className={styles.itemsList}>
              {favorites.map((item) => (
                <div key={item.id} className={styles.favItem}>
                  <img src={item.image} alt={item.name} className={styles.itemImg} />
                  <div className={styles.itemContent}>
                    <h4>{item.name}</h4>
                    <span className={styles.itemPrice}>{item.price}</span>
                    <button 
                      className={styles.addCartBtn}
                      onClick={() => addToCart(item)}
                    >
                      <i className="fa-solid fa-cart-plus" /> Add to Cart
                    </button>
                  </div>
                  <button 
                    className={styles.deleteBtn} 
                    onClick={() => removeFromFavorites(item.id)}
                    aria-label={`Remove ${item.name} from favorites`}
                  >
                    <i className="fa-solid fa-trash" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              <button className={styles.clearBtn} onClick={clearFavorites}>
                Clear All Favorites
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

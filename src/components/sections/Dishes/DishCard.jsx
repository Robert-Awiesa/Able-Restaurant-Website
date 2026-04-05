import StarRating from '../../common/StarRating';
import Button     from '../../common/Button';
import { useCart }  from '../../../context/CartContext';
import styles     from './DishesSection.module.css';

/**
 * DishCard
 * Individual dish card with slide-in heart / eye icons on hover.
 *
 * @param {object} dish - { id, name, price, rating, image, imageAlt }
 */
export default function DishCard({ dish }) {
  const { name, price, rating, image, imageAlt } = dish;
  const { addToCart, isFavorite, addToFavorites, removeFromFavorites } = useCart();

  const favorite = isFavorite(dish.id);

  const handleFavoriteClick = () => {
    if (favorite) {
      removeFromFavorites(dish.id);
    } else {
      addToFavorites(dish);
    }
  };

  return (
    <article className={styles.box}>
      {/* Wishlist toggle — slide in from right on hover (or stay if active) */}
      <button 
        className={`${styles.iconHover} ${styles.heart} ${favorite ? styles.activeHeart : ''}`} 
        aria-label={favorite ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
        onClick={handleFavoriteClick}
      >
        <i className="fa-solid fa-heart" aria-hidden="true" />
      </button>

      {/* Quick-view — slide in from left on hover */}
      <button className={`${styles.iconHover} ${styles.eye}`} aria-label={`Quick view ${name}`}>
        <i className="fa-solid fa-eye" aria-hidden="true" />
      </button>

      <img src={image} alt={imageAlt} className={styles.img} />
      <h3 className={styles.name}>{name}</h3>
      {/* <StarRating rating={rating} /> */}
      <span className={styles.price}>{price}</span>
      <Button onClick={() => addToCart(dish)}>add to cart</Button>
    </article>
  );
}

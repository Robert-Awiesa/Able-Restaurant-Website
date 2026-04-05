import StarRating from '../../common/StarRating';
import Button     from '../../common/Button';
import { useCart }  from '../../../context/CartContext';
import styles     from './MenuSection.module.css';

/**
 * MenuCard
 * Individual card in the today's speciality menu grid.
 *
 * @param {object} item - { id, name, price, rating, image, imageAlt, description }
 */
export default function MenuCard({ item }) {
  const { name, price, rating, image, imageAlt, description } = item;
  const { addToCart, isFavorite, addToFavorites, removeFromFavorites } = useCart();

  const favorite = isFavorite(item.id);

  const handleFavoriteClick = () => {
    if (favorite) {
      removeFromFavorites(item.id);
    } else {
      addToFavorites(item);
    }
  };

  return (
    <article className={styles.box}>
      <div className={styles.imageWrapper}>
        <img src={image} alt={imageAlt} className={styles.img} />
        <button 
          className={`${styles.heartBtn} ${favorite ? styles.activeHeart : ''}`} 
          aria-label={favorite ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
          onClick={handleFavoriteClick}
        >
          <i className="fa-solid fa-heart" aria-hidden="true" />
        </button>
      </div>

      <div className={styles.content}>
        {/* <StarRating rating={rating} /> */}
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.description}>{description}</p>
        <div className={styles.footer}>
          <span className={styles.price}>{price}</span>
          <Button onClick={() => addToCart(item)}>add to cart</Button>
        </div>
      </div>
    </article>
  );
}

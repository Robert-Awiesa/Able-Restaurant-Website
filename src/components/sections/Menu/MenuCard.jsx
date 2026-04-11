import { useState } from 'react';
import StarRating from '../../common/StarRating';
import Button     from '../../common/Button';
import { useCart }  from '../../../context/CartContext';
import styles     from './MenuSection.module.css';

/**
 * MenuCard
 * Individual card in the today's speciality menu grid.
 *
 * @param {object} item - { id, name, price, rating, image, imageAlt, description, sizes }
 */
export default function MenuCard({ item }) {
  const { name, price, sizes, rating, image, imageAlt, description } = item;
  const { addToCart, isFavorite, addToFavorites, removeFromFavorites } = useCart();

  const [selectedSize, setSelectedSize] = useState(sizes ? sizes[0] : null);
  const activePrice = selectedSize ? selectedSize.price : price;

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

        {sizes && (
          <div className={styles.sizeSection}>
            <p className={styles.sizeLabel}>Choose size</p>
            <div className={styles.sizeBtns}>
              {sizes.map((s) => (
                <button
                  key={s.label}
                  className={`${styles.sizeBtn} ${selectedSize?.label === s.label ? styles.sizeBtnActive : ''}`}
                  onClick={() => setSelectedSize(s)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={styles.footer}>
          <span className={styles.price}>{activePrice}</span>
          <Button onClick={() => addToCart({ ...item, selectedSize: selectedSize?.label, price: activePrice })}>
            add to cart
          </Button>
        </div>
      </div>
    </article>
  );
}


import StarRating from '../../common/StarRating';
import styles     from './ReviewSection.module.css';

/**
 * ReviewCard
 * A single customer review rendered inside the Swiper slider.
 *
 * @param {object} review - { id, name, rating, image, imageAlt, text }
 */
export default function ReviewCard({ review }) {
  const { name, rating, image, imageAlt, text } = review;

  return (
    <figure className={styles.slide}>
      <i className={`fa-solid fa-quote-right ${styles.quoteIcon}`} aria-hidden="true" />

      <div className={styles.user}>
        <img src={image} alt={imageAlt} className={styles.avatar} />
        <figcaption className={styles.userInfo}>
          <strong className={styles.userName}>{name}</strong>
          <StarRating rating={rating} />
        </figcaption>
      </div>

      <blockquote className={styles.text}>{text}</blockquote>
    </figure>
  );
}

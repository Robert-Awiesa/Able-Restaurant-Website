import styles from './StarRating.module.css';

/**
 * StarRating
 * Renders a row of stars for a given numeric rating (0–5, supports halves).
 *
 * @param {number} rating   - e.g. 4.5
 * @param {number} maxStars - total stars to render (default 5)
 */
export default function StarRating({ rating, maxStars = 5 }) {
  const stars = Array.from({ length: maxStars }, (_, i) => {
    const full  = i + 1 <= Math.floor(rating);
    const half  = !full && i < rating && rating - i >= 0.5;
    const icon  = full ? 'fa-solid fa-star' : half ? 'fa-solid fa-star-half-alt' : 'fa-regular fa-star';
    const label = full ? 'full star' : half ? 'half star' : 'empty star';
    return (
      <i
        key={i}
        className={`${icon} ${styles.star}`}
        aria-label={label}
        role="img"
      />
    );
  });

  return (
    <div
      className={styles.container}
      aria-label={`Rating: ${rating} out of ${maxStars}`}
      role="group"
    >
      {stars}
    </div>
  );
}

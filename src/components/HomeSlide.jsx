import Button  from './common/Button';
import styles from './sections/Home/HomeSection.module.css';

/**
 * HomeSlide
 * A single slide inside the hero Swiper.
 *
 * @param {object} slide - { label, title, description, image, imageAlt }
 */
export default function HomeSlide({ slide }) {
  const { label, title, description, image, imageAlt } = slide;

  return (
    <div className={styles.slide}>
      <div className={styles.slideContent}>
        <span className={styles.slideLabel}>{label}</span>
        <h2 className={styles.slideTitle}>{title}</h2>
        <p className={styles.slideDesc}>{description}</p>
        <Button href="#menu">order now</Button>
      </div>
      <div className={styles.slideImage}>
        <img src={image} alt={imageAlt} />
      </div>
    </div>
  );
}

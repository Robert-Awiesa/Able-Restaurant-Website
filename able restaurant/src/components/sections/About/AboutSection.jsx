import SectionHeader from '../../common/SectionHeader';
import Button        from '../../common/Button';
import {socialLinks} from '../../data/footerData'
import styles        from './AboutSection.module.css';

const FEATURES = [
  { icon: 'fa-solid fa-shipping-fast', label: 'delivery' },
  { icon: 'fa-solid fa-dollar-sign',   label: 'easy payments' },
  { icon: 'fa-solid fa-headset',       label: '24/7 service'  },
];

/**
 * AboutSection
 * Two-column layout: image on the left, copy + feature icons on the right.
 */
export default function AboutSection() {
  return (
    <section className={styles.about} id="about" aria-label="About us">
      <SectionHeader subHeading="about us" heading="why choose us?" />

      <div className={styles.row}>
        <div className={styles.imageWrapper}>
          <img src="/menu/Special Pizza Combo.jpeg" alt="Able Combo Special Pizza" />
        </div>

        <div className={styles.content}>
          <h3 className={styles.title}>Passion in Every Plate, Excellence in Every Bite</h3>
          <p className={styles.paragraph}>
            At Able Restro, we believe food is more than just a meal—its a journey of flavors 
            crafted with passion and soul. From our stone-baked, hand-tossed pizzas to our 
            tradition-infused rice dishes, every ingredient is selected for its peak freshness 
            and every dish is prepared to culinary perfection.
          </p>
          <p className={styles.paragraph}>
            We are committed to bringing the heart of our finest culinary traditions right to 
            your doorstep, ensuring every bite is a celebration of quality, taste, and reliability. 
            Whether youre sharing a family feast or enjoying a quiet dinner, we make every 
            moment memorable through the art of great food.
          </p>


          <div className={styles.iconsContainer} role="list">
            {FEATURES.map(({ icon, label }) => (
              <div key={label} className={styles.featureItem} role="listitem">
                <i className={icon} aria-hidden="true" />
                <span>{label}</span>
              </div>
            ))}
          </div>

          <Button href="#contact">learn more</Button>
        </div>
      </div>
    </section>
  );
}

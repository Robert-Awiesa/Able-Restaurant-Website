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
          <img src="/images/about-img.png" alt="Able-restro restaurant interior" />
        </div>

        <div className={styles.content}>
          <h3 className={styles.title}>best food in the country</h3>
          <p className={styles.paragraph}>
            Food &amp; Alcohol Delivery in Bolgatanga &amp; its surroundings — Discover Local
            Restaurants That Deliver To Your Door Step!
          </p>
          <p className={styles.paragraph}>
            For a variety of delicious food, order online and Dia-Da&apos;a guarantees Quick and
            Reliable Delivery. You can pay Cash on Delivery. Top Restaurants in Bolgatanga online
            include KFC, Papa&apos;s Pizza &amp; Burger &amp; Relish. Order from various online
            restaurants in Ghana &amp; Tema from the comfort of your home or office, whether you
            are having a party or a candle-lit dinner.
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

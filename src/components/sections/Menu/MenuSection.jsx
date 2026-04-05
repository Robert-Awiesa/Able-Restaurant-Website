import { menuItems }  from '../../data/menuItems';
import SectionHeader  from '../../common/SectionHeader';
import MenuCard       from './MenuCard';
import styles         from './MenuSection.module.css';

/**
 * MenuSection
 * Responsive grid showcasing today's menu specialities.
 */
export default function MenuSection() {
  return (
    <section className={styles.menu} id="menu" aria-label="Today's menu">
      <SectionHeader subHeading="our menu" heading="today's speciality" />
      <div className={styles.boxContainer}>
        {menuItems.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

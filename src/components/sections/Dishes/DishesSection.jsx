import { dishes }      from '../../data/dishes';
import SectionHeader   from '../../common/SectionHeader';
import DishCard        from './DishCard';
import styles          from './DishesSection.module.css';

/**
 * DishesSection
 * Responsive grid of popular dish cards.
 */
export default function DishesSection() {
  return (
    <section className={styles.dishes} id="dishes" aria-label="Popular dishes">
      <SectionHeader subHeading="our dishes" heading="popular dishes" />
      <div className={styles.boxContainer}>
        {dishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </div>
    </section>
  );
}

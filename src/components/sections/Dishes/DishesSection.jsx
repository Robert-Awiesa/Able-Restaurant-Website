import { useState, useEffect } from 'react';
import { menuItems }    from '../../data/menuItems';
import SectionHeader      from '../../common/SectionHeader';
import DishCard           from './DishCard';
import styles             from './DishesSection.module.css';

/**
 * DishesSection
 * Shows 6 random dishes from the main menu as "Popular Dishes".
 */
export default function DishesSection() {
  const [popularDishes, setPopularDishes] = useState([]);

  useEffect(() => {
    // 1. Shuffle and pick 6
    const shuffled = [...menuItems].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 6);

    // 2. Normalize: If a dish has sizes, pick the first price as the default price string
    const normalized = selected.map(item => {
      if (!item.price && item.sizes && item.sizes.length > 0) {
        return {
          ...item,
          price: item.sizes[0].price,
          selectedSize: item.sizes[0].label
        };
      }
      return item;
    });

    setPopularDishes(normalized);
  }, []);

  return (
    <section className={styles.dishes} id="dishes" aria-label="Popular dishes">
      <SectionHeader subHeading="our dishes" heading="popular dishes" />
      <div className={styles.boxContainer}>
        {popularDishes.map((dish, idx) => (
          <DishCard key={`${dish.id}-${idx}`} dish={dish} />
        ))}
      </div>
    </section>
  );
}


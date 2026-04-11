import { useState } from 'react';
import { menuItems }  from '../../data/menuItems';
import SectionHeader  from '../../common/SectionHeader';
import MenuCard       from './MenuCard';
import styles         from './MenuSection.module.css';

/**
 * MenuSection
 * Responsive grid showcasing today's menu specialities with category filtering.
 */
export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'pizza', label: 'Pizzas' },
    { id: 'rice', label: 'Rice & Mains' },
    { id: 'burgers', label: 'Burgers & Shawarma' },
    { id: 'salads', label: 'Salads' },
    { id: 'drinks', label: 'Drinks & Smoothies' },
  ];

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <section className={styles.menu} id="menu" aria-label="Today's menu">
      <SectionHeader subHeading="our menu" heading="today's speciality" />
      
      <div className={styles.categoryFilter}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.filterBtn} ${activeCategory === cat.id ? styles.activeFilter : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className={styles.boxContainer}>
        {filteredItems.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}


import { useState, useEffect }      from 'react';
import { Swiper, SwiperSlide }      from 'swiper/react';
import { Autoplay, Pagination }     from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import { menuItems }  from '../../data/menuItems';
import HomeSlide      from '../../HomeSlide';
import styles         from './HomeSection.module.css';

/**
 * HomeSection
 * Full-width hero slider built with Swiper React bindings.
 * Displays 3 random specialities from the menu.
 */
export default function HomeSection() {
  const [randomSlides, setRandomSlides] = useState([]);

  useEffect(() => {
    // Pick 3 random items
    const shuffled = [...menuItems].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    // Map to slide structure
    const mapped = selected.map(item => ({
      id: item.id,
      label: item.category ? `Our Special ${item.category}` : 'Today\'s Special',
      title: item.name,
      description: item.description,
      image: item.image,
      imageAlt: item.imageAlt
    }));

    setRandomSlides(mapped);
  }, []);

  return (
    <section className={styles.home} id="home" aria-label="Hero">
      <Swiper
        className={styles.homeSlider}
        modules={[Autoplay, Pagination]}
        spaceBetween={30}
        centeredSlides
        loop={randomSlides.length > 1}
        autoplay={{ delay: 7500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
      >
        {randomSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <HomeSlide slide={slide} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}


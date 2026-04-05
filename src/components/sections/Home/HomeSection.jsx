import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import { slides }  from '../../data/slides';
import HomeSlide   from '../../HomeSlide';
import styles      from './HomeSection.module.css';

/**
 * HomeSection
 * Full-width hero slider built with Swiper React bindings.
 */
export default function HomeSection() {
  return (
    <section className={styles.home} id="home" aria-label="Hero">
      <Swiper
        className={styles.homeSlider}
        modules={[Autoplay, Pagination]}
        spaceBetween={30}
        centeredSlides
        loop
        autoplay={{ delay: 7500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <HomeSlide slide={slide} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

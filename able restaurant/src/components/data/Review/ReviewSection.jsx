import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import { reviews }   from '../../data/reviews';
import SectionHeader from '../../common/SectionHeader';
import ReviewCard    from './ReviewCard';
import styles        from './ReviewSection.module.css';

/**
 * ReviewSection
 * Auto-playing Swiper carousel of customer reviews.
 */
export default function ReviewSection() {
  return (
    <section className={styles.review} id="review" aria-label="Customer reviews">
      <SectionHeader subHeading="customer's review" heading="what they say" />

      <div className={styles.sliderContainer}>
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          loop={true}
          grabCursor={true}
          centeredSlides={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true, dynamicBullets: true }}
          breakpoints={{
            0:    { slidesPerView: 1 },
            768:  { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className={styles.mySwiper}
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id} className={styles.swiperSlide}>
              <ReviewCard review={review} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

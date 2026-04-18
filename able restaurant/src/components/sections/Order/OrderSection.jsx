import SectionHeader from '../../common/SectionHeader';
import OrderForm     from './OrderForm';
import styles        from './OrderSection.module.css';

/**
 * OrderSection
 * Wraps the order form with the standard section heading.
 */
export default function OrderSection() {
  return (
    <section className={styles.order} id="order" aria-label="Place an order">
      <SectionHeader subHeading="order now" heading="free and fast" />
      <OrderForm />
    </section>
  );
}

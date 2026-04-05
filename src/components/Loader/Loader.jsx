import styles from './Loader.module.css';

/**
 * Loader
 * Full-screen loading overlay rendered until the page content is ready.
 *
 * @param {boolean} visible - when false the overlay fades out and is removed
 */
export default function Loader({ visible }) {
  if (!visible) return null;

  return (
    <div
      className={styles.container}
      role="status"
      aria-label="Loading, please wait"
      aria-live="polite"
    >
      <img src="/images/loader.gif" alt="Loading…" className={styles.gif} />
    </div>
  );
}

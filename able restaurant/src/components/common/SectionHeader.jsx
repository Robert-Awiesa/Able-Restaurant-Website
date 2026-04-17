import styles from './SectionHeader.module.css';

/**
 * SectionHeader
 * Renders the consistent sub-heading + heading pair used in every section.
 *
 * @param {string} subHeading - smaller green label above the main heading
 * @param {string} heading    - main bold heading
 */
export default function SectionHeader({ subHeading, heading }) {
  return (
    <>
      <p className={styles.subHeading}>{subHeading}</p>
      <h2 className={styles.heading}>{heading}</h2>
    </>
  );
}

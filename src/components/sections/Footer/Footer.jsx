import {
  locations,
  quickLinks,
  contactInfo,
  socialLinks,
} from "../../data/footerData";
import {Link} from 'react'
import styles from "./Footer.module.css";

/**
 * Footer
 * Four-column layout: Locations | Quick Links | Contact | Social.
 * Social icons show a tooltip on hover (pure CSS).
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.boxContainer}>
        {/* Locations */}
        <div className={styles.box}>
          <h3 className={styles.boxHeading}>Locations</h3>
          <nav aria-label="Delivery locations">
            {locations.map((loc) => (
              <a key={loc} href="#" className={styles.link}>
                {loc}
              </a>
            ))}
          </nav>
        </div>

        {/* Quick Links */}
        <div className={styles.box}>
          <h3 className={styles.boxHeading}>Quick Links</h3>
          <nav aria-label="Quick navigation links">
            {quickLinks.map(({ label, href }) => (
              <a key={label} href={href} className={styles.link}>
                {label}
              </a>
            ))}
          </nav>
        </div>

        {/* Contact Info */}
        <div className={styles.box}>
          <h3 className={styles.boxHeading}>Contact Info</h3>
          <address className={styles.address}>
            {contactInfo.map(({ label, href }) => (
              <a key={label} href={href} className={styles.link}>
                {label}
              </a>
            ))}
          </address>
        </div>

        {/* Social Media */}
        <div className={styles.socialWrapper}>
          <h3 className={styles.boxHeading}>Follow Us</h3>
          {/* Re-added the container div for your social links */}
          <div className={styles.socialIcons} role="list">
            {socialLinks.map(({ platform, icon, href, colorClass }, index) => (
              <a
                key={platform || index}
                href={href}
                className={`${styles.socialIcon} ${styles[colorClass]}`}
                aria-label={`Follow us on ${platform}`}
                rel="noopener noreferrer"
                target="_blank"
                role="listitem"
              >
                <span className={styles.tooltip} aria-hidden="true">
                  {platform}
                </span>
                <span>
                  <i className={icon} aria-hidden="true" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Moved outside boxContainer so it can span the full width if needed */}
      <p className={styles.credit} >
        copyright &copy; {year} by{" "}
        <span className={styles.creditName}>Able Restaurant</span>
      </p>
      <p className={styles.dev} >
        Developed by
        <a href="www.resolvex.com">ResolveX</a>
      </p>
    </footer>
  );
}

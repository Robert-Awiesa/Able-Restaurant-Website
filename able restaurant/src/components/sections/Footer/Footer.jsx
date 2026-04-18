import {
  locations,
  quickLinks,
  contactInfo,
  socialLinks,
} from "../../data/footerData";
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
        {/* Newsletter Section */}
        <div className={styles.box}>
          <h3 className={styles.boxHeading}>Newsletter</h3>
          <p className={styles.boxText}>Subscribe to get the latest updates and special offers.</p>
          <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" className={styles.newsletterInput} aria-label="Newsletter email" />
            <button type="submit" className={styles.newsletterBtn}>Subscribe</button>
          </form>
        </div>

        {/* Quick Links */}
        <div className={styles.box}>
          <h3 className={styles.boxHeading}>Quick Links</h3>
          <nav aria-label="Quick navigation links">
            {quickLinks.map(({ label, href }) => (
              <a key={label} href={href} className={styles.link}>
                <i className="fa-solid fa-arrow-right" />
                {label}
              </a>
            ))}
          </nav>
        </div>

        {/* Contact Info */}
        <div className={styles.box}>
          <h3 className={styles.boxHeading}>Contact Info</h3>
          <address className={styles.address}>
            {contactInfo.map(({ label, href }, index) => {
               let icon = "fa-solid fa-phone";
               if (href.startsWith("mailto:")) icon = "fa-solid fa-envelope";
               if (index === 4) icon = "fa-solid fa-map-marker-alt";

               const isExternal = !href.startsWith("tel:") && !href.startsWith("mailto:") && href !== "#";

               return (
                <a 
                  key={label} 
                  href={href} 
                  className={styles.link}
                  {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <i className={icon} />
                  {label}
                </a>
               );
            })}
          </address>
        </div>

        {/* Social Media */}
        <div className={styles.socialWrapper}>
          <h3 className={styles.boxHeading}>Follow Us</h3>
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

      <div className={styles.creditRow}>
        <p className={styles.credit}>
          &copy; {year} <span className={styles.creditName}>Able Restaurant</span>. All Rights Reserved.
        </p>
        <div className={styles.dev}>
          Developed by <a href="https://www.resolvex.com" target="_blank" rel="noopener noreferrer">ResolveX</a>
        </div>
      </div>
    </footer>
  );
}



import SectionHeader from '../../common/SectionHeader';
import ContactForm   from './ContactForm';
import styles        from './ContactSection.module.css';

/**
 * ContactSection
 * Contact Us page featuring a form, direct info, and embedded map.
 */
export default function ContactSection() {
  return (
    <section className={styles.contact} id="contact" aria-label="Contact us">
      <SectionHeader subHeading="contact us" heading="get in touch" />

      <div className={styles.contactBox}>
        {/* Embedded Google Map */}
        <iframe 
          className={styles.map}
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1985.1315346061974!2d-0.1441571412780926!3d5.675058100000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf8328d86d0343%3A0xafba5631ae7a358d!2sSt.%20Peter's%20Mission%20Schools!5e0!3m2!1sen!2sgh!4v1775273977118!5m2!1sen!2sgh"
          title="St. Peter's Mission School Location"
          loading="lazy"
          allowFullScreen
        />

        {/* Message Form */}
        <ContactForm />
      </div>

      {/* Additional Features: Direct Contact Details */}
      <div className={styles.detailsGrid}>
        <div className={styles.detailCard}>
          <i className="fa-solid fa-phone" aria-hidden="true" />
          <h4>Call Us</h4>
          <p>+233 24 123 4567</p>
          <p>+233 50 987 6543</p>
        </div>

        <div className={styles.detailCard}>
          <i className="fa-solid fa-envelope" aria-hidden="true" />
          <h4>Email Us</h4>
          <p>info@ablerestro.com</p>
          <p>orders@ablerestro.com</p>
        </div>

        <div className={styles.detailCard}>
          <i className="fa-solid fa-location-dot" aria-hidden="true" />
          <h4>Visit Us</h4>
          <p>St. Peter's Mission School</p>
          <p>East Legon, Accra - Ghana</p>
        </div>

        <div className={styles.detailCard}>
          <i className="fa-solid fa-clock" aria-hidden="true" />
          <h4>Opening Hours</h4>
          <p>Mon - Fri: 08am - 10pm</p>
          <p>Sat - Sun: 10am - 11pm</p>
        </div>
      </div>
    </section>
  );
}

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
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.5283456384!2d-0.1383198!3d5.6814706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf832cf4d7c107%3A0x25b27b8b9888a4ee!2sAble%20Restaurant!5e0!3m2!1sen!2sgh!4v1713267425118"
          title="Able Restaurant Location"
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
          <p>+233 53 177 6179</p>
          <p>+233 24 631 0570</p>
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
          <p>Ashalley Botwe</p>
          <p> Agorwu Junction Down, Edward Salia Lane</p>
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

import { useContactForm } from '../../../hooks/useContactForm';
import Button          from '../../common/Button';
import styles          from './ContactSection.module.css';

/**
 * ContactForm
 * Feedback and message form for customers.
 */
export default function ContactForm() {
  const { fields, errors, submitted, handleChange, handleSubmit, reset } = useContactForm();

  if (submitted) {
    return (
      <div className={styles.successBox} role="alert" aria-live="polite">
        <i className="fa-solid fa-check-circle" aria-hidden="true" />
        <h3>Message Sent!</h3>
        <p>Thank you, {fields.name || 'valued customer'}. We&apos;ll get back to you shortly.</p>
        <Button onClick={reset}>Send another message</Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.form}
      noValidate
      aria-label="Contact us form"
    >
      <div className={styles.inputBox}>
        <Field
          label="Full Name"
          name="name"
          placeholder="e.g. John Doe"
          value={fields.name}
          error={errors.name}
          onChange={handleChange}
          required
        />
        <EmailField
          label="Email Address"
          name="email"
          placeholder="e.g. john@example.com"
          value={fields.email}
          error={errors.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.inputBox}>
        <Field
          label="Phone Number"
          name="phone"
          type="tel"
          placeholder="e.g. +233 123 4567"
          value={fields.phone}
          error={errors.phone}
          onChange={handleChange}
          required
        />
        <Field
          label="Subject"
          name="subject"
          placeholder="How can we help?"
          value={fields.subject}
          error={errors.subject}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.inputFull}>
        <Field
          label="Your Message"
          name="message"
          textarea
          placeholder="Write your message here..."
          value={fields.message}
          error={errors.message}
          onChange={handleChange}
          required
        />
      </div>

      <Button type="submit">send message</Button>
    </form>
  );
}

/* ── Internal Field helper ──────────────────────────────────── */
function Field({
  label, name, type = 'text', placeholder, value,
  error, onChange, textarea, required
}) {
  const id = `contact-${name}`;

  return (
    <div className={textarea ? styles.inputFull : styles.input}>
      <label htmlFor={id} className={styles.inputLabel}>
        {label}
        {required && <span className={styles.required} aria-hidden="true"> *</span>}
      </label>

      {textarea ? (
        <textarea
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`${styles.control} ${error ? styles.controlError : ''}`}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-required={required}
          rows={6}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`${styles.control} ${error ? styles.controlError : ''}`}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-required={required}
        />
      )}

      {error && (
        <p id={`${id}-error`} className={styles.errorMsg} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function EmailField(props) {
  return <Field {...props} type="email" />;
}

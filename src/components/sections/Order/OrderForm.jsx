import { useOrderForm } from '../../../hooks/useOrderForm';
import Button           from '../../common/Button';
import styles           from './OrderSection.module.css';

/**
 * OrderForm
 * Fully validated, accessible order form.
 * All state and validation logic lives in useOrderForm.
 */
export default function OrderForm() {
  const { fields, errors, submitted, handleChange, handleSubmit, reset } = useOrderForm();

  if (submitted) {
    return (
      <div className={styles.successBox} role="alert" aria-live="polite">
        <i className="fas fa-check-circle" aria-hidden="true" />
        <h3>Order Placed!</h3>
        <p>Thank you, {fields.name || 'valued customer'}. We&apos;ll be in touch shortly.</p>
        <Button onClick={reset}>Place another order</Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.form}
      noValidate
      aria-label="Food order form"
    >
      {/* Row 1 */}
      <div className={styles.inputBox}>
        <Field
          label="Your name"
          name="name"
          type="text"
          placeholder="Enter your name"
          value={fields.name}
          error={errors.name}
          onChange={handleChange}
          required
        />
        <Field
          label="Your number"
          name="phone"
          type="tel"
          placeholder="Enter your phone number"
          value={fields.phone}
          error={errors.phone}
          onChange={handleChange}
          required
        />
      </div>

      {/* Row 2 */}
      <div className={styles.inputBox}>
        <Field
          label="Your order"
          name="foodName"
          type="text"
          placeholder="Enter food name"
          value={fields.foodName}
          error={errors.foodName}
          onChange={handleChange}
          required
        />
        <Field
          label="Additional food"
          name="extras"
          type="text"
          placeholder="Extra items with food"
          value={fields.extras}
          error={errors.extras}
          onChange={handleChange}
        />
      </div>

      {/* Row 3 */}
      <div className={styles.inputBox}>
        <Field
          label="How many?"
          name="quantity"
          type="number"
          placeholder="Number of orders"
          value={fields.quantity}
          error={errors.quantity}
          onChange={handleChange}
          min={1}
          required
        />
        <Field
          label="Date and time"
          name="dateTime"
          type="datetime-local"
          value={fields.dateTime}
          error={errors.dateTime}
          onChange={handleChange}
          required
        />
      </div>

      {/* Row 4 – textareas */}
      <div className={styles.inputBox}>
        <Field
          label="Your address"
          name="address"
          textarea
          placeholder="Enter your delivery address"
          value={fields.address}
          error={errors.address}
          onChange={handleChange}
          required
        />
        <Field
          label="Your message"
          name="message"
          textarea
          placeholder="Any special instructions?"
          value={fields.message}
          error={errors.message}
          onChange={handleChange}
        />
      </div>

      <Button type="submit">order now</Button>
    </form>
  );
}

/* ── Internal Field helper ──────────────────────────────────── */
function Field({
  label, name, type = 'text', placeholder, value,
  error, onChange, textarea, required, min,
}) {
  const id = `order-${name}`;

  return (
    <div className={styles.input}>
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
          min={min}
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

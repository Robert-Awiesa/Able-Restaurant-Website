import styles from './Button.module.css';

/**
 * Button
 * Reusable CTA element. Renders as an <a> when `href` is given, otherwise a <button>.
 *
 * @param {string}    href      - if provided, renders an anchor tag
 * @param {string}    children  - button label
 * @param {function}  onClick   - click handler (only used when not an anchor)
 * @param {string}    type      - button type (default 'button')
 * @param {string}    className - additional class names
 */
export default function Button({ href, children, onClick, type = 'button', className = '' }) {
  const cls = `${styles.btn} ${className}`.trim();

  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={cls} onClick={onClick}>
      {children}
    </button>
  );
}

import { useState } from 'react';
import styles from './WhatsAppButton.module.css';

const WHATSAPP_NUMBER = '233598665007'; // International format, no +
const GREETING = "Hello! I'd like to place an order at Able Restaurant 🍽️";

/**
 * WhatsAppButton
 * Fixed floating button that opens a WhatsApp chat with a pre-filled greeting.
 */
export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(GREETING)}`;

  return (
    <a
      id="whatsapp-float-btn"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.floatBtn}
      aria-label="Chat with us on WhatsApp"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Pulse ring */}
      <span className={styles.pulse} />

      {/* WhatsApp SVG icon */}
      <svg className={styles.icon} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.469 2.027 7.774L0 32l8.489-2.001A15.938 15.938 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.29 13.29 0 01-6.791-1.859l-.487-.289-5.038 1.187 1.224-4.905-.317-.503A13.29 13.29 0 012.667 16C2.667 8.637 8.637 2.667 16 2.667S29.333 8.637 29.333 16 23.363 29.333 16 29.333zm7.293-9.88c-.4-.2-2.368-1.168-2.735-1.301-.367-.133-.634-.2-.9.2s-1.034 1.301-1.267 1.568c-.233.267-.467.3-.867.1-.4-.2-1.688-.623-3.214-1.984-1.188-1.06-1.99-2.37-2.223-2.77-.233-.4-.025-.617.175-.816.18-.179.4-.467.6-.7.2-.233.267-.4.4-.667.133-.267.067-.5-.033-.7-.1-.2-.9-2.168-1.234-2.968-.325-.78-.655-.674-.9-.686l-.767-.013c-.267 0-.7.1-1.067.5s-1.4 1.368-1.4 3.335 1.434 3.869 1.634 4.135c.2.267 2.822 4.307 6.835 6.038.955.412 1.7.658 2.282.842.959.305 1.832.262 2.52.159.768-.114 2.368-.968 2.702-1.902.333-.935.333-1.735.233-1.902-.1-.167-.367-.267-.767-.467z"/>
      </svg>

      {/* Tooltip label */}
      <span className={`${styles.tooltip} ${hovered ? styles.tooltipVisible : ''}`}>
        Chat with us!
      </span>
    </a>
  );
}

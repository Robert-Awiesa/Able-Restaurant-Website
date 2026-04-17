import { useState, useEffect } from 'react';

/**
 * useLoader
 * Returns `visible` = true until `delay` ms has elapsed after mount,
 * then fades the loader out.
 * @param {number} delay - ms to display the loader (default 3 000)
 */
export function useLoader(delay = 3000) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return { visible };
}

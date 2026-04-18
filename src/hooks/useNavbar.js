import { useState, useEffect, useCallback } from 'react';

/**
 * useNavbar
 * Manages the mobile nav open/close state.
 * Auto-closes the nav when the user scrolls.
 */
export function useNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close  = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    window.addEventListener('scroll', close, { passive: true });
    return () => window.removeEventListener('scroll', close);
  }, [close]);

  return { isOpen, toggle, close };
}

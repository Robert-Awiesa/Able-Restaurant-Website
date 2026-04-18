import { useState, useCallback, useEffect } from 'react';

/**
 * useSearchForm
 * Manages the search overlay open/close state.
 * Pressing Escape closes the overlay.
 */
export function useSearchForm() {
  const [isOpen, setIsOpen] = useState(false);

  const open   = useCallback(() => setIsOpen(true),  []);
  const close  = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') close();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [close]);

  return { isOpen, open, close, toggle };
}

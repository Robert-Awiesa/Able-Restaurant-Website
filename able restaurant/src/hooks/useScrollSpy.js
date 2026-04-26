import { useEffect, useState, useCallback } from 'react';

/**
 * useScrollSpy
 * Returns the id of the section currently visible in the viewport.
 * @param {string[]} sectionIds - ordered list of section ids to watch
 * @param {number}   offset     - px subtracted from scrollY before comparing (accounts for sticky header)
 */
export function useScrollSpy(sectionIds, offset = 150) {
  // 1. Initialize from hash if present, else fallback to first section
  const [activeId, setActiveId] = useState(() => {
    if (typeof window === 'undefined') return sectionIds[0] || '';
    const hash = window.location.hash.slice(1);
    return sectionIds.includes(hash) ? hash : (sectionIds[0] || '');
  });

  const onScroll = useCallback(() => {
    const scrollY = window.scrollY;

    // Special case: if at the very top, always highlight the first section
    if (scrollY <= 50) {
      setActiveId(sectionIds[0] || '');
      return;
    }

    let foundId = '';
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (!el) continue;

      const top    = el.offsetTop - offset;
      const bottom = top + el.offsetHeight;

      if (scrollY >= top && scrollY < bottom) {
        foundId = id;
        break;
      }
    }

    if (foundId) {
      setActiveId(foundId);
    }
  }, [sectionIds, offset]);

  useEffect(() => {
    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    // Listen for hash changes (e.g. when user clicks a link)
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (sectionIds.includes(hash)) {
        setActiveId(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [onScroll, sectionIds]);

  return activeId || sectionIds[0] || '';
}

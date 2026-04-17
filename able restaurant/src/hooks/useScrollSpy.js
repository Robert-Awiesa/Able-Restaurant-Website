import { useEffect, useState } from 'react';

/**
 * useScrollSpy
 * Returns the id of the section currently visible in the viewport.
 * @param {string[]} sectionIds - ordered list of section ids to watch
 * @param {number}   offset     - px subtracted from scrollY before comparing (accounts for sticky header)
 */
export function useScrollSpy(sectionIds, offset = 150) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? '');

  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;

        const top    = el.offsetTop - offset;
        const bottom = top + el.offsetHeight;

        if (scrollY >= top && scrollY < bottom) {
          setActiveId(id);
          break;
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on mount

    return () => window.removeEventListener('scroll', onScroll);
  }, [sectionIds, offset]);

  return activeId;
}

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToSection() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        el.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start'
        });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

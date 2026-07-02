import { useEffect } from 'react';

// This hook uses an Intersection Observer and a slight mouse tracking logic 
// to predictively trigger chunk pre-fetching for linked routes before the user clicks.
export function usePredictivePrefetch() {
  useEffect(() => {
    // Only run in modern browsers and when connection is good
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection && (connection.saveData || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
      return; // Do not prefetch if user is on data saver or very slow connection
    }

    const prefetchLink = (href) => {
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      
      // Check if already prefetched
      if (document.querySelector(`link[rel="prefetch"][href="${href}"]`)) return;

      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      document.head.appendChild(link);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const href = entry.target.getAttribute('href');
          if (href && href.startsWith('/')) {
             // Delay slightly to prevent spiking network on fast scrolls
             setTimeout(() => prefetchLink(href), 100);
          }
          // We can optionally unobserve after prefetching
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '50px' });

    const links = document.querySelectorAll('a[href]');
    links.forEach(link => observer.observe(link));

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, []);
}

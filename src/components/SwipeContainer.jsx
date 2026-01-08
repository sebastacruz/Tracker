/**
 * SwipeContainer - Horizontal swipe navigation with CSS scroll-snap
 * Provides iOS-like page swiping between main app views
 */
import { useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const PAGES = ['entry', 'dashboard', 'history', 'substances', 'settings'];

export default function SwipeContainer({ currentView, onViewChange, children }) {
  const containerRef = useRef(null);
  const isScrollingRef = useRef(false);

  // Get the index of a page
  const getPageIndex = useCallback((page) => {
    return PAGES.indexOf(page);
  }, []);

  // Scroll to page when currentView changes externally
  useEffect(() => {
    if (!containerRef.current || isScrollingRef.current) return;

    const index = getPageIndex(currentView);
    if (index === -1) return;

    const container = containerRef.current;
    const targetScroll = index * container.clientWidth;

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  }, [currentView, getPageIndex]);

  // Handle scroll end to update currentView
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollLeft = container.scrollLeft;
    const pageWidth = container.clientWidth;
    const currentIndex = Math.round(scrollLeft / pageWidth);

    if (currentIndex >= 0 && currentIndex < PAGES.length) {
      const newPage = PAGES[currentIndex];
      if (newPage !== currentView) {
        onViewChange(newPage);
      }
    }
  }, [currentView, onViewChange]);

  // Debounced scroll handler
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimeout;
    const onScroll = () => {
      isScrollingRef.current = true;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrollingRef.current = false;
        handleScroll();
      }, 100);
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', onScroll);
      clearTimeout(scrollTimeout);
    };
  }, [handleScroll]);

  return (
    <div
      ref={containerRef}
      className="swipe-container flex overflow-x-auto snap-x snap-mandatory
                 scrollbar-hide overscroll-x-contain"
      style={{
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {children}
    </div>
  );
}

SwipeContainer.propTypes = {
  currentView: PropTypes.string.isRequired,
  onViewChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

// Export pages for external use
export { PAGES };

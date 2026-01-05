/**
 * Custom hook for pull-to-refresh functionality
 * Detects pull-down gesture and triggers refresh callback
 */
import { useEffect, useRef, useState } from 'react';

export function usePullToRefresh(onRefresh, options = {}) {
  const {
    threshold = 80, // Pull distance to trigger refresh
    resistance = 2.5, // How much to slow down the pull
    enabled = true,
  } = options;

  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const touchStartY = useRef(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    if (!container) return;

    let startY = 0;
    let currentY = 0;

    const handleTouchStart = (e) => {
      // Only trigger if scrolled to top
      if (container.scrollTop === 0) {
        startY = e.touches[0].clientY;
        touchStartY.current = startY;
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e) => {
      if (!isPulling) return;

      currentY = e.touches[0].clientY;
      const distance = currentY - startY;

      // Only allow pulling down
      if (distance > 0 && container.scrollTop === 0) {
        // Prevent default scrolling
        e.preventDefault();

        // Apply resistance to make it feel natural
        const pulledDistance = distance / resistance;
        setPullDistance(pulledDistance);
      } else {
        setIsPulling(false);
        setPullDistance(0);
      }
    };

    const handleTouchEnd = () => {
      if (pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true);

        // Call refresh callback
        Promise.resolve(onRefresh()).finally(() => {
          setTimeout(() => {
            setIsRefreshing(false);
            setPullDistance(0);
            setIsPulling(false);
          }, 500); // Smooth animation
        });
      } else {
        setPullDistance(0);
        setIsPulling(false);
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, pullDistance, threshold, resistance, enabled, onRefresh, isRefreshing]);

  return {
    containerRef,
    isPulling: isPulling || isRefreshing,
    pullDistance,
    isRefreshing,
  };
}

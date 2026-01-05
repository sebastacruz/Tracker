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
  const touchStartX = useRef(0);
  const gestureDetected = useRef(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    if (!container) return;

    let startY = 0;
    let startX = 0;
    let currentY = 0;
    let currentX = 0;

    const handleTouchStart = (e) => {
      // Only track touches when scrolled to top
      if (container.scrollTop === 0) {
        startY = e.touches[0].clientY;
        startX = e.touches[0].clientX;
        touchStartY.current = startY;
        touchStartX.current = startX;
        gestureDetected.current = false;
        // Don't set isPulling yet - wait to detect direction
      }
    };

    const handleTouchMove = (e) => {
      if (container.scrollTop !== 0) return;

      currentY = e.touches[0].clientY;
      currentX = e.touches[0].clientX;
      const deltaY = currentY - startY;
      const deltaX = currentX - startX;

      // Detect gesture direction only once
      if (!gestureDetected.current) {
        const absY = Math.abs(deltaY);
        const absX = Math.abs(deltaX);

        // Require minimum movement to detect gesture
        if (absY > 15 || absX > 15) {
          gestureDetected.current = true;

          // Only activate pull-to-refresh if gesture is predominantly vertical
          // Require 2:1 vertical:horizontal ratio and downward movement
          if (absY > absX * 2 && deltaY > 15) {
            setIsPulling(true);
          }
          // Otherwise, it's a horizontal swipe or ambiguous - let it through
        }
      }

      // Only intercept touch events if we've confirmed this is a pull gesture
      if (isPulling && deltaY > 0 && container.scrollTop === 0) {
        // Prevent default scrolling
        e.preventDefault();

        // Apply resistance to make it feel natural
        const pulledDistance = deltaY / resistance;
        setPullDistance(pulledDistance);
      }
    };

    const handleTouchEnd = () => {
      // Reset gesture detection
      gestureDetected.current = false;

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

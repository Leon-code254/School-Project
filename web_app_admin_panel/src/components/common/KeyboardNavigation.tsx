import React, { useEffect, useRef } from 'react';

interface KeyboardNavigationProps {
  children: React.ReactNode;
  focusableSelector?: string;
  onEscape?: () => void;
  cyclic?: boolean;
}

export default function KeyboardNavigation({
  children,
  focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  onEscape,
  cyclic = true,
}: KeyboardNavigationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const focusableElements = Array.from(
        container.querySelectorAll<HTMLElement>(focusableSelector)
      ).filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);

      const currentFocusIndex = focusableElements.findIndex(
        (el) => el === document.activeElement
      );

      switch (e.key) {
        case 'Tab':
          if (cyclic && focusableElements.length > 0) {
            if (e.shiftKey && currentFocusIndex <= 0) {
              e.preventDefault();
              focusableElements[focusableElements.length - 1].focus();
            } else if (!e.shiftKey && currentFocusIndex === focusableElements.length - 1) {
              e.preventDefault();
              focusableElements[0].focus();
            }
          }
          break;

        case 'ArrowDown':
          e.preventDefault();
          if (focusableElements.length > 0) {
            const nextIndex = cyclic
              ? (currentFocusIndex + 1) % focusableElements.length
              : Math.min(currentFocusIndex + 1, focusableElements.length - 1);
            focusableElements[nextIndex].focus();
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (focusableElements.length > 0) {
            const prevIndex = cyclic
              ? (currentFocusIndex - 1 + focusableElements.length) % focusableElements.length
              : Math.max(currentFocusIndex - 1, 0);
            focusableElements[prevIndex].focus();
          }
          break;

        case 'Escape':
          if (onEscape) {
            e.preventDefault();
            onEscape();
          }
          break;
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [focusableSelector, onEscape, cyclic]);

  return (
    <div ref={containerRef} role="presentation">
      {children}
    </div>
  );
}
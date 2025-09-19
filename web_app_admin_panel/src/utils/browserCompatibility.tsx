import React from 'react';
import { useMediaQuery, useTheme } from '@mui/material';

export function useResponsive() {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeScreen,
    // Commonly used breakpoint helpers
    downSm: useMediaQuery(theme.breakpoints.down('sm')),
    downMd: useMediaQuery(theme.breakpoints.down('md')),
    downLg: useMediaQuery(theme.breakpoints.down('lg')),
    upSm: useMediaQuery(theme.breakpoints.up('sm')),
    upMd: useMediaQuery(theme.breakpoints.up('md')),
    upLg: useMediaQuery(theme.breakpoints.up('lg')),
  };
}

interface ResponsiveConfig<T> {
  mobile?: T;
  tablet?: T;
  desktop?: T;
  default?: T;
}

interface ResponsiveValueProps<T> {
  children: T | ResponsiveConfig<T>;
}

export function useResponsiveValue<T>({ children }: ResponsiveValueProps<T>): T {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  
  if (children === null || typeof children !== 'object' || !('mobile' in children)) {
    return children as T;
  }

  const config = children as ResponsiveConfig<T>;

  if (isMobile && config.mobile !== undefined) {
    return config.mobile;
  }

  if (isTablet && config.tablet !== undefined) {
    return config.tablet;
  }

  if (isDesktop && config.desktop !== undefined) {
    return config.desktop;
  }

  return config.default || config.desktop || config.tablet || config.mobile as T;
}

// Example usage:
// const fontSize = useResponsiveValue({
//   children: {
//     mobile: '14px',
//     tablet: '16px',
//     desktop: '18px',
//     default: '16px'
//   }
// });

export function getBrowserInfo() {
  const userAgent = window.navigator.userAgent;
  const browsers = {
    chrome: /chrome/i,
    safari: /safari/i,
    firefox: /firefox/i,
    edge: /edge/i,
    opera: /opera/i,
    ie: /msie|trident/i,
  };

  for (const [browser, regex] of Object.entries(browsers)) {
    if (regex.test(userAgent)) {
      return browser;
    }
  }

  return 'unknown';
}

export function isBrowserSupported() {
  const browser = getBrowserInfo();
  const version = parseInt(
    (navigator.userAgent.match(/(?:chrome|firefox|safari|edge|opr)\/(\d+)/i) || [])[1] || '0',
    10
  );

  // Define minimum supported versions
  const minVersions = {
    chrome: 80,
    firefox: 75,
    safari: 13,
    edge: 80,
    opera: 67,
  };

  return version >= (minVersions[browser as keyof typeof minVersions] || 0);
}

export function isFeatureSupported(feature: string): boolean {
  switch (feature) {
    case 'css-grid':
      return window.CSS && CSS.supports('display: grid');
    case 'flexbox':
      return window.CSS && CSS.supports('display: flex');
    case 'css-variables':
      return window.CSS && CSS.supports('--test: 0');
    case 'intersection-observer':
      return 'IntersectionObserver' in window;
    case 'resize-observer':
      return 'ResizeObserver' in window;
    case 'webp':
      const canvas = document.createElement('canvas');
      if (canvas.getContext && canvas.getContext('2d')) {
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      }
      return false;
    default:
      return false;
  }
}

interface BrowserCompatibilityWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredFeatures?: string[];
}

export function BrowserCompatibilityWrapper({
  children,
  fallback,
  requiredFeatures = [],
}: BrowserCompatibilityWrapperProps) {
  const isSupported = isBrowserSupported();
  const hasRequiredFeatures = requiredFeatures.every(isFeatureSupported);

  if (!isSupported || !hasRequiredFeatures) {
    return (
      <div role="alert">
        {fallback || (
          <div>
            <h2>Browser Compatibility Issue</h2>
            <p>
              Your browser version is not supported. Please upgrade to a modern browser
              or enable the required features to access this content.
            </p>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock IntersectionObserver
const IntersectionObserverMock = function () {
  return {
    observe: () => {},
    unobserve: () => {},
    disconnect: () => {},
  };
};
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
});

// Mock ResizeObserver
const ResizeObserverMock = function () {
  return {
    observe: () => {},
    unobserve: () => {},
    disconnect: () => {},
  };
};
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserverMock,
});

// jsdom may not implement CSS.supports; some components use it for feature detection
if (!('CSS' in window)) {
  // @ts-expect-error - define CSS for test environment
  window.CSS = { supports: () => false };
} else if (typeof window.CSS.supports !== 'function') {
  Object.defineProperty(window.CSS, 'supports', {
    writable: true,
    configurable: true,
    value: () => false,
  });
}

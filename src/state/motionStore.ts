import { useEffect } from 'react';
import { create } from 'zustand';
import { readJsonFromStorage, removeFromStorage, writeJsonToStorage } from '@utils/storage';

const STORAGE_KEY = 'anveshana.motion';

type MotionStorageV1 = {
  version: 1;
  userOverride: boolean;
  reduceMotion: boolean;
};

function isMotionStorageV1(value: unknown): value is MotionStorageV1 {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    v.version === 1 &&
    typeof v.userOverride === 'boolean' &&
    typeof v.reduceMotion === 'boolean'
  );
}

export interface MotionState {
  systemPrefersReducedMotion: boolean;
  userOverride: boolean;
  reduceMotion: boolean;
  effectiveReduceMotion: boolean;

  setUserReduceMotion: (enabled: boolean) => void;
  clearUserOverride: () => void;
  setSystemPrefersReducedMotion: (enabled: boolean) => void;
  hydrateFromStorage: () => void;
}

function computeEffective(systemPrefersReducedMotion: boolean, userOverride: boolean, reduceMotion: boolean): boolean {
  return userOverride ? reduceMotion : systemPrefersReducedMotion;
}

export const useMotionStore = create<MotionState>((set, get) => ({
  systemPrefersReducedMotion: false,
  userOverride: false,
  reduceMotion: false,
  effectiveReduceMotion: false,

  setUserReduceMotion: (enabled) => {
    set((prev) => {
      const next = {
        ...prev,
        userOverride: true,
        reduceMotion: enabled,
      };

      const effective = computeEffective(next.systemPrefersReducedMotion, next.userOverride, next.reduceMotion);
      const storage: MotionStorageV1 = { version: 1, userOverride: next.userOverride, reduceMotion: next.reduceMotion };
      writeJsonToStorage(STORAGE_KEY, storage);

      return { ...next, effectiveReduceMotion: effective };
    });
  },

  clearUserOverride: () => {
    set((prev) => {
      const next = {
        ...prev,
        userOverride: false,
      };
      removeFromStorage(STORAGE_KEY);
      const effective = computeEffective(next.systemPrefersReducedMotion, next.userOverride, next.reduceMotion);
      return { ...next, effectiveReduceMotion: effective };
    });
  },

  setSystemPrefersReducedMotion: (enabled) => {
    const current = get();
    const effective = computeEffective(enabled, current.userOverride, current.reduceMotion);
    set({ systemPrefersReducedMotion: enabled, effectiveReduceMotion: effective });
  },

  hydrateFromStorage: () => {
    const stored = readJsonFromStorage(STORAGE_KEY, isMotionStorageV1);
    if (!stored) return;

    const current = get();
    const effective = computeEffective(current.systemPrefersReducedMotion, stored.userOverride, stored.reduceMotion);

    set({
      userOverride: stored.userOverride,
      reduceMotion: stored.reduceMotion,
      effectiveReduceMotion: effective,
    });
  },
}));

let didInit = false;

export function useMotionInit(): void {
  const hydrateFromStorage = useMotionStore((s) => s.hydrateFromStorage);
  const setSystemPrefersReducedMotion = useMotionStore((s) => s.setSystemPrefersReducedMotion);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (didInit) return;
    didInit = true;

    hydrateFromStorage();

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setSystemPrefersReducedMotion(mq.matches);

    const onChange = (event: MediaQueryListEvent) => {
      setSystemPrefersReducedMotion(event.matches);
    };

    // Support both modern and legacy listeners
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }

    const legacyListener: (this: MediaQueryList, ev: MediaQueryListEvent) => void = function (ev) {
      onChange(ev);
    };

    mq.addListener(legacyListener);
    return () => mq.removeListener(legacyListener);
  }, [hydrateFromStorage, setSystemPrefersReducedMotion]);
}

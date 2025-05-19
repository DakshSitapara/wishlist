// 'use client';

// import { useEffect, useState } from 'react';

// export function useLocalStorageState<T>(
//   key: string,
//   defaultValue: T
// ): readonly [T, React.Dispatch<React.SetStateAction<T>>] {
//   const [state, setState] = useState<T>(() => {
//     if (typeof window === 'undefined') {
//       console.debug(`[useLocalStorageState] Server-side render, using defaultValue for key "${key}"`);
//       return defaultValue;
//     }
//     try {
//       const stored = localStorage.getItem(key);
//       if (stored) {
//         console.debug(`[useLocalStorageState] Loaded from localStorage for key "${key}":`, stored);
//         return JSON.parse(stored);
//       }
//       console.debug(`[useLocalStorageState] No data in localStorage for key "${key}", using defaultValue`);
//       return defaultValue;
//     } catch (error) {
//       console.error(`[useLocalStorageState] Error reading localStorage key "${key}":`, error);
//       return defaultValue;
//     }
//   });

//   useEffect(() => {
//     if (typeof window === 'undefined') return;
//     try {
//       console.debug(`[useLocalStorageState] Saving to localStorage for key "${key}":`, state);
//       localStorage.setItem(key, JSON.stringify(state));
//     } catch (error) {
//       console.error(`[useLocalStorageState] Error writing to localStorage key "${key}":`, error);
//     }
//   }, [key, state]);

//   useEffect(() => {
//     if (typeof window === 'undefined') return;
//     const handleStorageChange = (e: StorageEvent) => {
//       if (e.key !== key) return;
//       try {
//         const newValue = e.newValue ? JSON.parse(e.newValue) : defaultValue;
//         console.debug(`[useLocalStorageState] Storage event for key "${key}", new value:`, newValue);
//         setState(newValue);
//       } catch (error) {
//         console.error(`[useLocalStorageState] Error parsing storage event for key "${key}":`, error);
//       }
//     };
//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, [key, defaultValue]);

//   return [state, setState] as const;
// }


// 
 'use client';
import { useState, useEffect } from 'react';

export function useLocalStorageState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return defaultValue; // Return default value during SSR
    }
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error writing localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState] as const;
}
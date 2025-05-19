// localStorage.ts
export function getWishlistForUser<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

  
export function setLocalStorage<T>(key: string, value: T) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

  export const removeLocalStorage = (key: string): void => {
    
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item '${key}' from localStorage`, error);
    }
  };
  
  export const clearLocalStorage = (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  };
  
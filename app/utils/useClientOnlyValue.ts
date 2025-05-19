// app/utils/useClientOnlyValue.ts
import { useEffect, useState } from 'react';

export function useClientOnlyValue<T>(getValue: () => T, fallback: T): T {
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    setValue(getValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return value;
}

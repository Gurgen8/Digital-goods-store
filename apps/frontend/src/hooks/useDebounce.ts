import { useState, useEffect } from 'react';

/**
 * Хук для откладывания изменения значения на заданный интервал времени.
 * Отлично подходит для оптимизации поиска, чтобы не делать запросы на каждый введенный символ.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Устанавливаем таймер, который обновит debouncedValue через delay миллисекунд
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Если value или delay изменились до истечения таймера, очищаем предыдущий таймер.
    // Это и есть суть debouncing — таймер сбрасывается при каждом новом вводе.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

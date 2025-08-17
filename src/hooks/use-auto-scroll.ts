import { useEffect } from 'react';

interface UseAutoScrollOptions {
  /**
   * ID элемента для скролла
   */
  targetId: string;
  /**
   * Включен ли автоскролл
   */
  enabled?: boolean;
  /**
   * Задержка перед скроллом в миллисекундах
   */
  delay?: number;
  /**
   * Отступ от верха при скролле
   */
  offset?: number;
  /**
   * Поведение скролла
   */
  behavior?: ScrollBehavior;
}

/**
 * Hook для автоматического скролла к определенному элементу при загрузке страницы
 */
export function useAutoScroll({
  targetId,
  enabled = true,
  delay = 1000,
  offset = 80,
  behavior = 'smooth'
}: UseAutoScrollOptions) {
  useEffect(() => {
    if (!enabled) return;

    const timer = setTimeout(() => {
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const scrollToPosition = elementPosition - offset;

        window.scrollTo({
          top: scrollToPosition,
          behavior
        });
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [targetId, enabled, delay, offset, behavior]);
}

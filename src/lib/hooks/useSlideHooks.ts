import { useEffect, useState } from 'react';

export interface UseSlideOptions {
  total: number;
  autoPlay?: boolean;
  interval?: number;
}

export function useSlideHooks({ total, autoPlay = true, interval = 5000 }: UseSlideOptions) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || total <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % total);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, total]);

  const goToPrevious = () => {
    // Debugging logs retained as in component
    // eslint-disable-next-line no-console
    console.log('Previous button clicked, current index:', currentIndex);
    setCurrentIndex(prevIndex => {
      const newIndex = (prevIndex - 1 + total) % total;
      // eslint-disable-next-line no-console
      console.log('New index:', newIndex);
      return newIndex;
    });
  };

  const goToNext = () => {
    // eslint-disable-next-line no-console
    console.log('Next button clicked, current index:', currentIndex);
    setCurrentIndex(prevIndex => {
      const newIndex = (prevIndex + 1) % total;
      // eslint-disable-next-line no-console
      console.log('New index:', newIndex);
      return newIndex;
    });
  };

  const goToSlide = (index: number) => {
    // eslint-disable-next-line no-console
    console.log('Dot clicked, going to index:', index);
    setCurrentIndex(index);
  };

  return { currentIndex, goToPrevious, goToNext, goToSlide };
}

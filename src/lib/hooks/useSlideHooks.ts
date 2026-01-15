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
     
    console.log('Previous button clicked, current index:', currentIndex);
    setCurrentIndex(prevIndex => {
      const newIndex = (prevIndex - 1 + total) % total;
      return newIndex;
    });
  };

  const goToNext = () => {
    setCurrentIndex(prevIndex => {
      const newIndex = (prevIndex + 1) % total;
      return newIndex;
    });
  };

  const goToSlide = (index: number) => {
     
    setCurrentIndex(index);
  };

  return { currentIndex, goToPrevious, goToNext, goToSlide };
}

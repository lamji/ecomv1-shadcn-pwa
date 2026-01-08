import { useEffect, useRef, useState } from 'react';

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type CarouselState = {
  itemsPerView: number;
  startIndex: number;
  canPrev: boolean;
  canNext: boolean;
  handlePrev: () => void;
  handleNext: () => void;
};

export function useFlashSalesHooks(totalItems: number = 0): TimeLeft & CarouselState {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const endTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Carousel state
  const [itemsPerView, setItemsPerView] = useState<number>(4);
  const [startIndex, setStartIndex] = useState<number>(0);

  useEffect(() => {
    const now = new Date();
    const threeDaysFromNow = new Date(now);
    threeDaysFromNow.setDate(now.getDate() + 3);
    threeDaysFromNow.setHours(23, 59, 59, 999);
    endTimeRef.current = threeDaysFromNow.getTime();

    const tick = () => {
      const nowMs = Date.now();
      const difference = endTimeRef.current - nowMs;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });

      const delay = Math.max(0, 1000 - (nowMs % 1000));
      timerRef.current = setTimeout(tick, delay);
    };

    tick();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Responsive itemsPerView (md breakpoint at 768px)
  useEffect(() => {
    const onResize = () => {
      const isMdUp =
        typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches;
      setItemsPerView(isMdUp ? 4 : 2);
    };
    onResize();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }
  }, []);

  // Clamp start index when deps change
  const maxStart = Math.max(0, totalItems - itemsPerView);
  useEffect(() => {
    setStartIndex(prev => Math.min(Math.max(0, prev), maxStart));
  }, [itemsPerView, totalItems, maxStart]);

  const canPrev = startIndex > 0;
  const canNext = startIndex < maxStart;

  const handlePrev = () => {
    if (!canPrev) return;
    setStartIndex(prev => Math.max(0, prev - 1));
  };
  const handleNext = () => {
    if (!canNext) return;
    setStartIndex(prev => Math.min(maxStart, prev + 1));
  };

  return {
    ...timeLeft,
    itemsPerView,
    startIndex,
    canPrev,
    canNext,
    handlePrev,
    handleNext,
  };
}

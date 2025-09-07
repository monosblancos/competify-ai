import { useState, useEffect } from 'react';

export const useExitIntent = (delay: number = 2000) => {
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    
    // Track time spent on page
    const timeInterval = setInterval(() => {
      setTimeSpent(Date.now() - startTime);
    }, 1000);

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if user has spent enough time and mouse leaves from top
      if (
        !hasTriggered &&
        timeSpent > delay &&
        e.clientY <= 0 &&
        e.relatedTarget === null
      ) {
        setShowExitIntent(true);
        setHasTriggered(true);
      }
    };

    const handleBeforeUnload = () => {
      if (!hasTriggered && timeSpent > delay) {
        setShowExitIntent(true);
        setHasTriggered(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(timeInterval);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [delay, hasTriggered, timeSpent]);

  const dismissExitIntent = () => {
    setShowExitIntent(false);
  };

  return {
    showExitIntent,
    dismissExitIntent,
    timeSpent,
    hasTriggered
  };
};
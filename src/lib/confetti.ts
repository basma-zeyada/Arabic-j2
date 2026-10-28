import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

export function fireConfetti(burst = 'normal') {
  const count = burst === 'big' ? 160 : burst === 'small' ? 40 : 80;
  const colors = ['#ff6fa5', '#48b6ff', '#ffd84d', '#5ce6a8', '#c084fc', '#ff8a6e'];
  confetti({
    particleCount: count,
    spread: 70,
    origin: { y: 0.6 },
    colors,
    scalar: 1.1,
  });
  if (burst === 'big') {
    setTimeout(() => {
      confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1 }, colors });
    }, 200);
  }
}

// Trigger confetti when `trigger` becomes true.
export function useConfetti(trigger: boolean, burst: 'small' | 'normal' | 'big' = 'normal') {
  const [fired, setFired] = useState(false);
  useEffect(() => {
    if (trigger && !fired) {
      fireConfetti(burst);
      setFired(true);
    }
    if (!trigger) setFired(false);
  }, [trigger, fired, burst]);
}

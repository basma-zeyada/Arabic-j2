import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type Mood = 'happy' | 'cheer' | 'think' | 'sad' | 'idle';

const speechByMood: Record<Mood, string> = {
  happy: 'أحسنت! أنت بطل!',
  cheer: 'رائع جدًا! 🎉',
  think: 'فكّر جيدًا...',
  sad: 'لا بأس، حاول مرة أخرى!',
  idle: 'أنا سعيد! هل أنت مستعد؟',
};

export function Mascot({
  mood = 'idle',
  message,
  size = 120,
  speaking = false,
}: {
  mood?: Mood;
  message?: string;
  size?: number;
  speaking?: boolean;
}) {
  const text = message ?? speechByMood[mood];
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 140);
    }, 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex items-end gap-3" dir="rtl">
      <motion.div
        animate={
          speaking
            ? { y: [0, -6, 0], rotate: [0, -2, 2, 0] }
            : { y: [0, -8, 0] }
        }
        transition={{ duration: speaking ? 0.4 : 2.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width: size, height: size }}
        className="relative shrink-0"
      >
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg">
          {/* ears */}
          <path d="M28 40 L22 12 L42 28 Z" fill="#ff8a3d" />
          <path d="M92 40 L98 12 L78 28 Z" fill="#ff8a3d" />
          <path d="M30 36 L26 18 L38 30 Z" fill="#ffd6c2" />
          <path d="M90 36 L94 18 L82 30 Z" fill="#ffd6c2" />
          {/* head */}
          <ellipse cx="60" cy="62" rx="38" ry="34" fill="#ff9d4d" />
          <ellipse cx="60" cy="70" rx="26" ry="20" fill="#fff3e6" />
          {/* cheeks */}
          <circle cx="36" cy="72" r="6" fill="#ff6fa5" opacity="0.55" />
          <circle cx="84" cy="72" r="6" fill="#ff6fa5" opacity="0.55" />
          {/* eyes */}
          {blink ? (
            <>
              <rect x="42" y="56" width="12" height="2.5" rx="1.25" fill="#3b2a1a" />
              <rect x="66" y="56" width="12" height="2.5" rx="1.25" fill="#3b2a1a" />
            </>
          ) : (
            <>
              <circle cx="48" cy="57" r="6.5" fill="#fff" />
              <circle cx="72" cy="57" r="6.5" fill="#fff" />
              <circle cx="49" cy="58" r="3.5" fill="#2a1a0a" />
              <circle cx="73" cy="58" r="3.5" fill="#2a1a0a" />
              <circle cx="50.5" cy="56.5" r="1.2" fill="#fff" />
              <circle cx="74.5" cy="56.5" r="1.2" fill="#fff" />
            </>
          )}
          {/* nose */}
          <ellipse cx="60" cy="68" rx="3.5" ry="2.5" fill="#3b2a1a" />
          {/* mouth by mood */}
          {mood === 'happy' && (
            <path d="M50 76 Q60 84 70 76" stroke="#3b2a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          )}
          {mood === 'cheer' && (
            <path d="M48 75 Q60 90 72 75 Z" fill="#7c2d12" stroke="#3b2a1a" strokeWidth="2" />
          )}
          {(mood === 'idle' || mood === 'think') && (
            <path d="M52 78 Q60 82 68 78" stroke="#3b2a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          )}
          {mood === 'sad' && (
            <path d="M52 80 Q60 74 68 80" stroke="#3b2a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          )}
        </svg>
      </motion.div>

      <motion.div
        key={text}
        initial={{ opacity: 0, y: 8, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        className="relative bg-white rounded-3xl px-4 py-3 shadow-candy-sm max-w-[220px] text-sm font-bold text-slate-700 border-2 border-candy-sky"
      >
        <span className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-b-2 border-r-2 border-candy-sky rotate-45" />
        {text}
      </motion.div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export function Stars({ count, size = 18 }: { count: number; size?: number }) {
  return (
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          initial={i < count ? { scale: 0, rotate: -90 } : false}
          animate={i < count ? { scale: 1, rotate: 0 } : { scale: 1 }}
          transition={{ delay: i * 0.12, type: 'spring', stiffness: 300, damping: 12 }}
        >
          <Star
            size={size}
            className={i < count ? 'fill-candy-yellow text-candy-yellow' : 'text-slate-300'}
            strokeWidth={2}
          />
        </motion.div>
      ))}
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  className = '',
  disabled,
  icon,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.94, y: 2 }}
      whileHover={{ scale: disabled ? 1 : 1.04 }}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-candy-pink to-candy-coral px-6 py-3 font-display text-lg font-bold text-white shadow-candy transition disabled:opacity-50 disabled:shadow-none ${className}`}
    >
      {icon}
      {children}
    </motion.button>
  );
}

export function Card({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-candy bg-white p-5 shadow-candy border-2 border-white ${className}`}>
      {children}
    </div>
  );
}

export function ProgressBar({ value, max, color = 'from-candy-mint to-candy-blue' }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="h-4 w-full rounded-full bg-slate-200 overflow-hidden">
      <motion.div
        className={`h-full bg-gradient-to-r ${color} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      />
    </div>
  );
}

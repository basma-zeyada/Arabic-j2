import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Heart } from 'lucide-react';
import { Mascot } from './Mascot';
import { PrimaryButton } from './ui';

export function NameCharacterScreen({ onDone }: { onDone: (name: string) => void }) {
  const [name, setName] = useState('');
  const [shake, setShake] = useState(false);

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    onDone(trimmed);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-candy-sky via-candy-rose to-candy-sun flex flex-col items-center justify-center px-4" dir="rtl">
      {/* Floating decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['⭐', '🌈', '☁️', '🎈', '🌟'].map((e, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl opacity-40"
            style={{ left: `${12 + i * 18}%`, top: `${8 + (i % 3) * 28}%` }}
            animate={{ y: [0, -14, 0], rotate: [0, 12, 0] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.3 }}
          >
            {e}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        className="relative flex flex-col items-center gap-5 max-w-md w-full"
      >
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2.4, repeat: Infinity }}>
          <Mascot mood="idle" message="مرحبًا! أنا صديقك الجديد. ما اسمي؟" size={150} />
        </motion.div>

        <div className="text-center">
          <h1 className="font-display text-3xl font-extrabold text-candy-pink">اختر اسمًا لصديقك!</h1>
          <p className="font-bold text-slate-500 mt-1">اكتب اسم الشخصية الذي تحبه</p>
        </div>

        <motion.div
          animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          <div className="relative w-full">
            <Pencil className="absolute right-4 top-1/2 -translate-y-1/2 text-candy-pink" size={22} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              maxLength={20}
              placeholder="اكتب الاسم هنا..."
              autoFocus
              className="w-full rounded-candy bg-white px-12 py-4 text-center font-display text-2xl font-bold text-slate-700 shadow-candy border-4 border-candy-rose outline-none focus:border-candy-pink transition"
            />
          </div>
        </motion.div>

        <PrimaryButton onClick={submit} icon={<Heart size={20} />} className="text-xl">
          هيا نبدأ!
        </PrimaryButton>

        {name.trim() && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-bold text-candy-blue text-center"
          >
            أهلًا {name.trim()}! سعيد بلقائك
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

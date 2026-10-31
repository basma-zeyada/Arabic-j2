import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListOrdered, Sparkles } from 'lucide-react';
import type { PictureGameActivity } from '@/data/curriculum';
import { Card } from '@/components/ui';
import { playCelebrate, playCorrect, playTap, playWrong } from '@/lib/sounds';

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function PictureGame({
  activity,
  onComplete,
}: {
  activity: PictureGameActivity;
  onComplete: (correct: number, total: number) => void;
}) {
  const [round, setRound] = useState<'order' | 'match'>('order');
  const [orderMistakes, setOrderMistakes] = useState(0);
  const total = activity.sequence.length + activity.memoryPairs.length;

  return (
    <div className="flex flex-col items-center gap-5" dir="rtl">
      <div className="flex items-center gap-2">
        {(['order', 'match'] as const).map((r, i) => (
          <div
            key={r}
            className={`flex h-9 w-9 items-center justify-center rounded-full font-extrabold shadow-candy-sm ${
              round === r ? 'bg-candy-pink text-white' : 'bg-white text-slate-400'
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {round === 'order' ? (
          <motion.div key="order" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="w-full">
            <OrderRound
              frames={activity.sequence}
              onDone={(mistakes) => {
                setOrderMistakes(mistakes);
                setRound('match');
              }}
            />
          </motion.div>
        ) : (
          <motion.div key="match" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="w-full">
            <MatchRound
              symbols={activity.memoryPairs}
              onDone={(mistakes) => onComplete(Math.max(0, total - orderMistakes - mistakes), total)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OrderRound({ frames, onDone }: { frames: string[]; onDone: (mistakes: number) => void }) {
  const [pool] = useState(() => shuffle(frames.map((emoji, index) => ({ emoji, index }))));
  const [placed, setPlaced] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [wrongIndex, setWrongIndex] = useState<number | null>(null);

  const finished = placed.length === frames.length;

  useEffect(() => {
    if (!finished) return;
    playCelebrate();
    const t = setTimeout(() => onDone(mistakes), 900);
    return () => clearTimeout(t);
  }, [finished, mistakes, onDone]);

  const tap = (index: number) => {
    if (index === placed.length) {
      playCorrect();
      setPlaced((p) => [...p, index]);
      return;
    }
    playWrong();
    setMistakes((m) => m + 1);
    setWrongIndex(index);
    setTimeout(() => setWrongIndex(null), 500);
  };

  return (
    <Card className="w-full bg-candy-sun/40">
      <div className="flex items-center justify-center gap-2 text-amber-700">
        <ListOrdered size={22} />
        <Sparkles size={18} />
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2" aria-label="ترتيب القصة">
        {frames.map((_, i) => {
          const frameIndex = placed[i];
          return (
            <div
              key={i}
              className={`flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-dashed text-3xl ${
                frameIndex === undefined ? 'border-amber-300 bg-white/60' : 'border-solid border-white bg-white shadow-candy-sm'
              }`}
            >
              {frameIndex !== undefined ? frames[frameIndex] : ''}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {pool.map((item) =>
          placed.includes(item.index) ? (
            <div key={item.index} className="h-16 w-16" />
          ) : (
            <motion.button
              key={item.index}
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              animate={wrongIndex === item.index ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => tap(item.index)}
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-candy-sm border-2 border-candy-rose"
            >
              {item.emoji}
            </motion.button>
          ),
        )}
      </div>
    </Card>
  );
}

function MatchRound({ symbols, onDone }: { symbols: string[]; onDone: (mistakes: number) => void }) {
  const [deck] = useState(() => shuffle([...symbols, ...symbols]).map((emoji, id) => ({ id, emoji })));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [busy, setBusy] = useState(false);

  const finished = matched.length === symbols.length;

  useEffect(() => {
    if (!finished) return;
    playCelebrate();
    const t = setTimeout(() => onDone(mistakes), 900);
    return () => clearTimeout(t);
  }, [finished, mistakes, onDone]);

  const flip = (id: number) => {
    if (busy || flipped.includes(id) || matched.includes(deck[id].emoji)) return;
    const next = [...flipped, id];
    playTap();
    setFlipped(next);
    if (next.length < 2) return;

    setBusy(true);
    const [a, b] = next.map((i) => deck[i]);
    if (a.emoji === b.emoji) {
      playCorrect();
      setMatched((m) => [...m, a.emoji]);
      setFlipped([]);
      setBusy(false);
    } else {
      playWrong();
      setMistakes((m) => m + 1);
      setTimeout(() => {
        setFlipped([]);
        setBusy(false);
      }, 800);
    }
  };

  return (
    <Card className="w-full bg-candy-mint/40">
      <div className="flex items-center justify-center gap-2 text-emerald-700">
        <Sparkles size={22} />
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {deck.map((card) => {
          const isUp = flipped.includes(card.id) || matched.includes(card.emoji);
          return (
            <motion.button
              key={card.id}
              type="button"
              whileTap={{ scale: 0.92 }}
              animate={{ rotateY: isUp ? 180 : 0 }}
              transition={{ duration: 0.35 }}
              onClick={() => flip(card.id)}
              style={{ transformStyle: 'preserve-3d' }}
              className="relative aspect-square w-full"
            >
              <span
                className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gradient-to-b from-candy-pink to-candy-coral shadow-candy-sm border-2 border-white text-2xl"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <Sparkles size={22} className="text-white" />
              </span>
              <span
                className={`absolute inset-0 flex items-center justify-center rounded-2xl border-2 bg-white text-3xl shadow-candy-sm ${
                  matched.includes(card.emoji) ? 'border-emerald-300' : 'border-candy-rose'
                }`}
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                {card.emoji}
              </span>
            </motion.button>
          );
        })}
      </div>
    </Card>
  );
}

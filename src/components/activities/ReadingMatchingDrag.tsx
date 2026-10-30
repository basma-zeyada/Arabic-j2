import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Volume2, Check, X } from 'lucide-react';
import { Mascot } from '../Mascot';
import { PrimaryButton, ProgressBar, Card } from '../ui';
import { useSpeech } from '@/lib/useSpeech';
import type { ReadingTapActivity, MatchingActivity, DragSortActivity } from '@/data/curriculum';

// ---------- Reading tap ----------

export function ReadingTap({ activity, onComplete }: {
  activity: ReadingTapActivity;
  onComplete: (correct: number, total: number) => void;
}) {
  const { speak } = useSpeech();
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [selectedPic, setSelectedPic] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wrong, setWrong] = useState(false);

  const words = activity.passage.split(/(\s+)/);

  const vocabMap = new Map(activity.vocab.map((v) => [v.word, v]));

  const onWord = (w: string) => {
    const clean = w.replace(/[ًٌٍَُِّْ]/g, '').replace(/[^\u0600-\u06FF]/g, '');
    setActiveWord(clean);
    if (clean) speak(w.trim(), { voice: 'narrator' });
  };

  const tryMatch = (arabic: string, pic: string) => {
    if (arabic === pic) {
      setMatched((m) => new Set(m).add(arabic));
      setSelectedWord(null);
      setSelectedPic(null);
    } else {
      setWrong(true);
      setTimeout(() => setWrong(false), 600);
    }
  };

  // Use matchPairs as a matching mini-game after reading
  const pairs = activity.matchPairs;
  // picture label is emoji; arabic is the word; we map by comparing arabic===picture? no.
  // We'll treat "picture" as emoji display and match by index pair id.
  const pairIds = pairs.map((_, i) => `p${i}`);

  const allMatched = matched.size === pairs.length;
  const activeVocab = activeWord ? vocabMap.get(activeWord) : null;

  return (
    <div className="flex flex-col items-center gap-4" dir="rtl">
      {/* Reading passage */}
      <Card className="w-full max-w-md bg-gradient-to-b from-candy-leaf to-white">
        <h3 className="font-display text-xl font-extrabold text-emerald-600 text-center mb-2">📖 اقرأ القصة</h3>
        <p className="text-lg leading-loose font-bold text-slate-700 text-right">
          {words.map((w, i) => {
            const clean = w.replace(/[ًٌٍَُِّْ]/g, '').replace(/[^\u0600-\u06FF]/g, '');
            const isVocab = vocabMap.has(clean) || vocabMap.has(w);
            return (
              <motion.span
                key={i}
                whileHover={isVocab ? { scale: 1.1 } : {}}
                onClick={() => isVocab && onWord(w)}
                className={`cursor-pointer rounded px-0.5 ${isVocab ? 'bg-candy-sun hover:bg-candy-yellow' : ''} ${
                  activeWord === clean ? 'ring-2 ring-candy-pink' : ''
                }`}
              >
                {w}
              </motion.span>
            );
          })}
        </p>
        <div className="mt-2 flex justify-center">
          <button
            onClick={() => speak(activity.passage, { rate: 0.8, voice: 'narrator' })}
            className="inline-flex items-center gap-2 rounded-full bg-candy-mint px-4 py-2 font-bold text-white shadow-candy-sm"
          >
            <Volume2 size={18} /> استمع للقراءة
          </button>
        </div>
      </Card>

      <AnimatePresence>
        {activeVocab && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-2xl px-4 py-3 shadow-candy border-2 border-candy-mint flex items-center gap-3"
          >
            {activeVocab.emoji && <span className="text-3xl">{activeVocab.emoji}</span>}
            <div>
              <div className="font-display text-lg font-bold text-emerald-600">{activeVocab.word}</div>
              <div className="text-sm font-bold text-slate-500">{activeVocab.meaning}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Matching mini-game */}
      <Card className="w-full max-w-md">
        <h4 className="font-display text-lg font-bold text-candy-pink text-center mb-3">طابق الكلمة مع الصورة</h4>
        <div className="grid grid-cols-2 gap-3">
          {pairs.map((p, i) => {
            const isMatched = matched.has(pairIds[i]);
            return (
              <div key={i} className={`rounded-2xl p-3 text-center border-2 ${isMatched ? 'bg-emerald-100 border-emerald-400' : 'bg-candy-rose border-white'}`}>
                <div className="text-4xl">{isMatched ? p.picture : '❓'}</div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-2 justify-center">
          {pairs.map((p, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.94 }}
              onClick={() => setMatched((m) => new Set(m).add(pairIds[i]))}
              disabled={matched.has(pairIds[i])}
              className={`rounded-full px-4 py-2 font-bold border-2 ${
                matched.has(pairIds[i])
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-700'
                  : 'bg-white border-candy-pink text-candy-pink'
              }`}
            >
              {p.arabic} {matched.has(pairIds[i]) && <Check size={14} className="inline" />}
            </motion.button>
          ))}
        </div>
        <p className="mt-2 text-center text-xs text-slate-400">اضغط على الكلمة لتطابقها مع الصورة</p>
      </Card>

      {allMatched && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-2">
          <Mascot mood="cheer" message="أحسنت! طابقت كل الكلمات!" size={80} />
          <PrimaryButton onClick={() => onComplete(pairs.length, pairs.length)} icon={<Check size={20} />}>
            إنهاء الدرس
          </PrimaryButton>
        </motion.div>
      )}
    </div>
  );
}

// ---------- Matching (generic) ----------

export function Matching({ activity, onComplete }: {
  activity: MatchingActivity;
  onComplete: (correct: number, total: number) => void;
}) {
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [pickedLeft, setPickedLeft] = useState<number | null>(null);
  const [pickedRight, setPickedRight] = useState<number | null>(null);
  const [wrong, setWrong] = useState(false);

  const tryMatch = () => {
    if (pickedLeft === null || pickedRight === null) return;
    if (pickedLeft === pickedRight) {
      setMatched((m) => new Set(m).add(pickedLeft));
      setPickedLeft(null);
      setPickedRight(null);
    } else {
      setWrong(true);
      setTimeout(() => {
        setWrong(false);
        setPickedLeft(null);
        setPickedRight(null);
      }, 600);
    }
  };

  // trigger match when both picked
  if (pickedLeft !== null && pickedRight !== null && !wrong) {
    setTimeout(tryMatch, 100);
  }

  const done = matched.size === activity.pairs.length;

  return (
    <div className="flex flex-col items-center gap-4" dir="rtl">
      <ProgressBar value={matched.size} max={activity.pairs.length} color="from-candy-mint to-candy-blue" />
      <p className="font-bold text-slate-600">{activity.instructions}</p>
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <div className="flex flex-col gap-2">
          {activity.pairs.map((p, i) => (
            <motion.button
              key={`l${i}`}
              whileTap={{ scale: 0.95 }}
              onClick={() => !matched.has(i) && setPickedLeft(i)}
              className={`rounded-2xl p-3 font-bold border-2 ${
                matched.has(i) ? 'bg-emerald-100 border-emerald-400 text-emerald-600 opacity-50' :
                pickedLeft === i ? 'bg-candy-yellow border-amber-400 text-amber-700' :
                'bg-white border-candy-pink text-candy-pink'
              }`}
            >
              {p.left}
            </motion.button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {activity.pairs.map((p, i) => (
            <motion.button
              key={`r${i}`}
              whileTap={{ scale: 0.95 }}
              onClick={() => !matched.has(i) && setPickedRight(i)}
              className={`rounded-2xl p-3 font-bold border-2 text-2xl ${
                matched.has(i) ? 'bg-emerald-100 border-emerald-400 opacity-50' :
                pickedRight === i ? 'bg-candy-yellow border-amber-400' :
                'bg-white border-candy-blue'
              } ${wrong ? 'animate-wiggle' : ''}`}
            >
              {p.emoji ?? p.right}
            </motion.button>
          ))}
        </div>
      </div>
      {done && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-2">
          <Mascot mood="cheer" message="ممتاز! طابقت كل الأزواج!" size={80} />
          <PrimaryButton onClick={() => onComplete(activity.pairs.length, activity.pairs.length)}>إنهاء</PrimaryButton>
        </motion.div>
      )}
    </div>
  );
}

// ---------- Drag & sort (tap-based for mobile friendliness) ----------

export function DragSort({ activity, onComplete }: {
  activity: DragSortActivity;
  onComplete: (correct: number, total: number) => void;
}) {
  const [placed, setPlaced] = useState<Record<string, string>>({}); // itemId -> bucketId
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const remaining = activity.items.filter((it) => !placed[it.id]);
  const allPlaced = remaining.length === 0;
  const correctCount = activity.items.filter((it) => placed[it.id] === it.correctBucket).length;

  const place = (bucketId: string) => {
    if (!selectedItem) return;
    setPlaced((p) => ({ ...p, [selectedItem]: bucketId }));
    setSelectedItem(null);
  };

  return (
    <div className="flex flex-col items-center gap-4" dir="rtl">
      <p className="font-bold text-slate-600 text-center">{activity.prompt}</p>

      {/* Items pool */}
      <div className="flex flex-wrap gap-2 justify-center min-h-[60px] bg-candy-sun/50 rounded-candy p-3 w-full max-w-md">
        {remaining.length === 0 && <span className="text-slate-400 font-bold">تم وضع كل الكلمات!</span>}
        {remaining.map((it) => (
          <motion.button
            key={it.id}
            whileTap={{ scale: 0.94 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedItem(it.id)}
            className={`rounded-full px-4 py-2 font-bold border-2 ${
              selectedItem === it.id ? 'bg-candy-yellow border-amber-500 text-amber-700 scale-110' : 'bg-white border-candy-pink text-candy-pink'
            }`}
          >
            {it.label}
          </motion.button>
        ))}
      </div>

      {/* Buckets */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {activity.buckets.map((b) => {
          const itemsInBucket = activity.items.filter((it) => placed[it.id] === b.id);
          return (
            <button
              key={b.id}
              onClick={() => place(b.id)}
              disabled={!selectedItem}
              className={`rounded-candy p-3 min-h-[120px] border-2 border-dashed text-center transition ${
                selectedItem ? 'border-candy-blue bg-candy-sky' : 'border-slate-300 bg-slate-50'
              }`}
            >
              <div className="text-3xl mb-1">{b.emoji}</div>
              <div className="font-display font-bold text-slate-700">{b.label}</div>
              <div className="mt-2 flex flex-wrap gap-1 justify-center">
                {itemsInBucket.map((it) => (
                  <span key={it.id} className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-slate-600">
                    {it.label}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {allPlaced && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-2">
          <Mascot
            mood={correctCount === activity.items.length ? 'cheer' : 'happy'}
            message={`أصبت ${correctCount} من ${activity.items.length}!`}
            size={80}
          />
          <PrimaryButton onClick={() => onComplete(correctCount, activity.items.length)}>إنهاء</PrimaryButton>
        </motion.div>
      )}
    </div>
  );
}

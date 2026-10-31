import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Volume2, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { Mascot } from '../Mascot';
import { PrimaryButton, ProgressBar } from '../ui';
import { useSpeech } from '@/lib/useSpeech';
import { playCelebrate, playCorrect, playTap, playWrong } from '@/lib/sounds';
import type { FlashcardsActivity } from '@/data/curriculum';

export function Flashcards({ activity }: { activity: FlashcardsActivity }) {
  const { speak, speaking } = useSpeech();
  const [idx, setIdx] = useState(0);
  const [seen, setSeen] = useState<Set<number>>(new Set([0]));
  const card = activity.cards[idx];
  const total = activity.cards.length;

  const go = (d: number) => {
    playTap();
    const n = (idx + d + total) % total;
    setIdx(n);
    setSeen((s) => new Set(s).add(n));
  };

  const done = seen.size >= total;

  return (
    <div className="flex flex-col items-center gap-4" dir="rtl">
      <ProgressBar value={seen.size} max={total} color="from-candy-pink to-candy-coral" />
      <p className="text-sm font-bold text-slate-500">
        البطاقة {idx + 1} من {total}
      </p>

      <motion.div
        key={idx}
        initial={{ rotateY: 90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative w-full max-w-sm"
      >
        <div className={`rounded-candy bg-gradient-to-b ${'from-candy-rose to-candy-sky'} p-8 shadow-candy border-4 border-white text-center`}>
          <div className="text-7xl mb-2 animate-float">{card.emoji}</div>
          <div className="font-display text-7xl font-extrabold text-candy-pink drop-shadow">{card.letter}</div>
          <div className="mt-2 text-2xl font-bold text-slate-700">{card.word}</div>
          <div className="mt-1 text-sm font-bold text-slate-500">{card.soundLabel}</div>
          <button
            onClick={() => speak(`${card.letter}. ${card.word}`, { voice: 'narrator' })}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-bold text-candy-blue shadow-candy-sm"
          >
            <Volume2 size={18} className={speaking ? 'animate-pulse' : ''} /> استمع
          </button>
        </div>
      </motion.div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => go(-1)}
          className="rounded-full bg-white p-3 shadow-candy-sm text-candy-pink"
        >
          <ChevronRight size={24} />
        </button>
        <div className="flex gap-1">
          {activity.cards.map((_, i) => (
            <div key={i} className={`h-2 w-2 rounded-full ${i === idx ? 'bg-candy-pink' : seen.has(i) ? 'bg-candy-mint' : 'bg-slate-200'}`} />
          ))}
        </div>
        <button
          onClick={() => go(1)}
          className="rounded-full bg-white p-3 shadow-candy-sm text-candy-pink"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      <AnimatePresence>
        {done && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-2">
            <Mascot mood="cheer" message="رائع! شاهدت كل البطاقات!" size={80} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------- MCQ ----------

export function MCQ({ questions, onComplete }: {
  questions: { id: string; prompt: string; options: string[]; answerIndex: number; emoji?: string }[];
  onComplete: (correct: number, total: number) => void;
}) {
  const [i, setI] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [answered, setAnswered] = useState(false);
  const q = questions[i];

  const choose = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.answerIndex) {
      setCorrectCount((c) => c + 1);
      playCorrect();
    } else {
      playWrong();
    }
  };

  const next = () => {
    playTap();
    if (i + 1 >= questions.length) {
      playCelebrate();
      onComplete(correctCount, questions.length);
      return;
    }
    setI(i + 1);
    setSelected(null);
    setAnswered(false);
  };

  return (
    <div className="flex flex-col items-center gap-4" dir="rtl">
      <ProgressBar value={i} max={questions.length} color="from-candy-blue to-candy-mint" />
      <motion.div key={q.id} initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-full max-w-md">
        <div className="rounded-candy bg-white p-6 shadow-candy border-2 border-candy-sky text-center">
          {q.emoji && <div className="text-5xl mb-2 animate-float">{q.emoji}</div>}
          <p className="font-display text-xl font-bold text-slate-700">{q.prompt}</p>
        </div>
        <div className="mt-4 grid gap-3">
          {q.options.map((opt, idx) => {
            const isCorrect = idx === q.answerIndex;
            const isPicked = idx === selected;
            let style = 'bg-white border-candy-rose text-slate-700';
            if (answered && isCorrect) style = 'bg-emerald-100 border-emerald-400 text-emerald-700';
            else if (answered && isPicked && !isCorrect) style = 'bg-rose-100 border-rose-400 text-rose-700';
            else if (answered) style = 'bg-slate-100 border-slate-200 text-slate-400';
            return (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.96 }}
                whileHover={!answered ? { scale: 1.03 } : {}}
                onClick={() => choose(idx)}
                className={`rounded-2xl border-2 px-4 py-3 text-lg font-bold shadow-candy-sm flex items-center justify-between ${style}`}
              >
                <span>{opt}</span>
                {answered && isCorrect && <Check className="text-emerald-500" />}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {answered && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-2">
          <Mascot
            mood={selected === q.answerIndex ? 'cheer' : 'sad'}
            message={selected === q.answerIndex ? 'إجابة صحيحة! أحسنت!' : 'الإجابة الصحيحة ملوّنة بالأخضر'}
            size={80}
          />
          <PrimaryButton onClick={next} icon={<ChevronLeft size={20} />}>
            {i + 1 >= questions.length ? 'إنهاء' : 'السؤال التالي'}
          </PrimaryButton>
        </motion.div>
      )}
    </div>
  );
}

// ---------- Listening quiz ----------

export function ListeningQuiz({ activity, onComplete }: {
  activity: import('@/data/curriculum').ListeningQuizActivity;
  onComplete: (correct: number, total: number) => void;
}) {
  const { speak, speakSegments, speaking, stop } = useSpeech();
  const [phase, setPhase] = useState<'story' | 'quiz'>('story');

  const playStory = () => {
    if (speaking) {
      stop();
      return;
    }
    if (activity.storySegments && activity.storySegments.length) {
      speakSegments(activity.storySegments);
    } else {
      speak(activity.storyText, { rate: 0.8, voice: 'narrator' });
    }
  };

  return (
    <div className="flex flex-col items-center gap-4" dir="rtl">
      {phase === 'story' ? (
        <>
          <div className="w-full max-w-md rounded-candy bg-gradient-to-b from-candy-sky to-white p-6 shadow-candy border-2 border-candy-blue">
            <h3 className="font-display text-2xl font-extrabold text-candy-blue text-center mb-3">
              📖 {activity.storyTitle}
            </h3>
            <p className="text-lg leading-loose font-bold text-slate-700 text-center">{activity.storyText}</p>
            <div className="mt-4 flex justify-center">
              <button
                onClick={playStory}
                className="inline-flex items-center gap-2 rounded-full bg-candy-blue px-5 py-3 font-bold text-white shadow-candy"
              >
                <Volume2 size={20} className={speaking ? 'animate-pulse' : ''} />
                {speaking ? 'إيقاف' : 'استمع للقصة'}
              </button>
            </div>
          </div>
          <Mascot mood="think" message="استمع جيدًا، ثم أجب عن الأسئلة!" size={80} />
          <PrimaryButton onClick={() => setPhase('quiz')} icon={<ChevronLeft size={20} />}>
            ابدأ الأسئلة
          </PrimaryButton>
        </>
      ) : (
        <MCQ questions={activity.questions} onComplete={onComplete} />
      )}
    </div>
  );
}

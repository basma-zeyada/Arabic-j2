import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Home, RotateCcw } from 'lucide-react';
import { units, SECTION_META, type Section } from '@/data/curriculum';
import { Mascot } from './Mascot';
import { Stars, PrimaryButton, Card, ProgressBar } from './ui';
import { Flashcards, MCQ, ListeningQuiz } from './activities/FlashcardsMCQ';
import { ReadingTap, Matching, DragSort } from './activities/ReadingMatchingDrag';
import { Writing, Nasheed, ChallengeMix } from './activities/WritingNasheedChallenge';
import { starsFromScore, type ProgressState } from '@/lib/progress';
import { useConfetti } from '@/lib/confetti';

type Phase = 'intro' | 'play' | 'result';

export function LessonScreen({
  unitId,
  sectionIndex,
  progress,
  onFinish,
  onExit,
}: {
  unitId: string;
  sectionIndex: number;
  progress: ProgressState;
  onFinish: (stars: number, score: number) => void;
  onExit: () => void;
}) {
  const unit = units.find((u) => u.id === unitId)!;
  const section: Section = unit.sections[sectionIndex];
  const [phase, setPhase] = useState<Phase>('intro');
  const [result, setResult] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });

  const maxScore = getMaxScore(section);
  const stars = starsFromScore(result.correct, result.total || 1);
  useConfetti(phase === 'result' && stars >= 2, stars === 3 ? 'big' : 'normal');

  const handleComplete = (correct: number, total: number) => {
    setResult({ correct, total });
    setPhase('result');
  };

  const renderActivity = () => {
    const a = section.activity;
    switch (a.type) {
      case 'flashcards':
        return <Flashcards activity={a} />;
      case 'listening-quiz':
        return <ListeningQuiz activity={a} onComplete={handleComplete} />;
      case 'reading-tap':
        return <ReadingTap activity={a} onComplete={handleComplete} />;
      case 'matching':
        return <Matching activity={a} onComplete={handleComplete} />;
      case 'drag-sort':
        return <DragSort activity={a} onComplete={handleComplete} />;
      case 'mcq':
        return <MCQ questions={a.questions} onComplete={handleComplete} />;
      case 'writing':
        return <Writing activity={a} onComplete={handleComplete} />;
      case 'nasheed':
        return <Nasheed activity={a} onComplete={handleComplete} />;
      case 'challenge-mix':
        return <ChallengeMix activity={a} onComplete={handleComplete} />;
      default:
        return null;
    }
  };

  // For flashcards/nasheed with no scoring, allow a "finish" trigger
  const isNonScored = section.activity.type === 'flashcards';

  return (
    <div className="min-h-screen bg-gradient-to-b from-candy-sky via-white to-candy-rose" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center justify-between gap-2 px-4 py-3 bg-white/80 backdrop-blur border-b-2 border-candy-rose">
        <button onClick={onExit} className="rounded-full bg-candy-rose px-3 py-1.5 text-sm font-bold text-candy-pink shadow-candy-sm flex items-center gap-1">
          <Home size={16} /> خروج
        </button>
        <div className="text-center">
          <div className="font-display font-bold text-slate-700 text-sm">{section.title}</div>
          <div className="text-xs text-slate-400">{unit.title}</div>
        </div>
        <div className="w-16" />
      </div>

      <div className="px-4 py-6 mx-auto max-w-lg">
        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-5 pt-6"
            >
              <motion.div
                animate={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-28 h-28 rounded-full bg-gradient-to-b ${section.color} flex items-center justify-center text-6xl shadow-candy border-4 border-white`}
              >
                {section.emoji}
              </motion.div>
              <h2 className="font-display text-2xl font-extrabold text-slate-700 text-center">{section.title}</h2>
              <p className="text-center font-bold text-slate-500">{section.subtitle}</p>
              <Card className="max-w-sm bg-candy-sun">
                <p className="text-center font-bold text-amber-800">{section.activity.instructions}</p>
              </Card>
              <Mascot mood="happy" message="هل أنت مستعد؟ هيا نبدأ!" size={100} />
              <PrimaryButton onClick={() => setPhase('play')} className="text-xl">
                هيا نلعب!
              </PrimaryButton>
            </motion.div>
          )}

          {phase === 'play' && (
            <motion.div
              key="play"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              {renderActivity()}
              {isNonScored && (
                <div className="mt-6 flex justify-center">
                  <PrimaryButton onClick={() => handleComplete(3, 3)} icon={<ArrowRight size={20} />}>
                    أنهيت الدرس
                  </PrimaryButton>
                </div>
              )}
            </motion.div>
          )}

          {phase === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-5 pt-8"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                className={`w-32 h-32 rounded-full bg-gradient-to-b ${section.color} flex items-center justify-center text-7xl shadow-candy border-4 border-white`}
              >
                {section.emoji}
              </motion.div>

              <Stars count={stars} size={40} />

              <Card className="max-w-sm text-center">
                <div className="font-display text-3xl font-extrabold text-candy-pink">
                  {result.correct} / {result.total}
                </div>
                <div className="text-sm font-bold text-slate-500 mt-1">نقاطك في هذا الدرس</div>
              </Card>

              <Mascot
                mood={stars === 3 ? 'cheer' : stars >= 1 ? 'happy' : 'sad'}
                message={
                  stars === 3 ? 'ثلاث نجوم! أنت بطل خارق!'
                  : stars === 2 ? 'عمل رائع! نجمتان!'
                  : stars === 1 ? 'جيد! حاول مرة أخرى للحصول على 3 نجوم'
                  : 'لا بأس! حاول مرة أخرى'
                }
                size={100}
              />

              <div className="flex gap-3">
                <PrimaryButton
                  onClick={() => { setPhase('intro'); setResult({ correct: 0, total: 0 }); }}
                  icon={<RotateCcw size={18} />}
                  className="bg-gradient-to-b from-candy-blue to-candy-sky"
                >
                  أعد المحاولة
                </PrimaryButton>
                <PrimaryButton onClick={() => onFinish(stars, maxScore)}>
                  التالي
                </PrimaryButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function getMaxScore(section: Section): number {
  const a = section.activity;
  switch (a.type) {
    case 'flashcards': return a.cards.length;
    case 'listening-quiz': return a.questions.length;
    case 'reading-tap': return a.matchPairs.length || 5;
    case 'matching': return a.pairs.length;
    case 'drag-sort': return a.items.length;
    case 'mcq': return a.questions.length;
    case 'writing': return a.rubric.length;
    case 'nasheed': return 1;
    case 'challenge-mix': return a.questions.length + (a.matchPairs?.length ?? 0);
    default: return 5;
  }
}

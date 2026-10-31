import { motion } from 'framer-motion';
import { Star, Trophy, BookOpen, Play, BarChart3, Award } from 'lucide-react';
import { Mascot } from './Mascot';
import { PrimaryButton } from './ui';
import { totalScore, totalStars, BADGES, type ProgressState } from '@/lib/progress';
import { units } from '@/data/curriculum';

export function HomeScreen({
  progress,
  mascotName,
  onPlay,
  onDashboard,
}: {
  progress: ProgressState;
  mascotName: string;
  onPlay: () => void;
  onDashboard: () => void;
}) {
  const score = totalScore(progress);
  const stars = totalStars(progress);
  const earnedBadges = BADGES.filter((b) => progress.badges.includes(b.id));
  const allSections = units.flatMap((u) => u.sections);
  const completedCount = allSections.filter((s) => progress.results[s.id]).length;
  const progressPct = Math.round((completedCount / allSections.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-candy-sky via-candy-rose to-candy-sun" dir="rtl">
      {/* Floating decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['⭐', '🌈', '☁️', '🎈', '🌟', '🦊'].map((e, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl opacity-40"
            style={{ left: `${10 + i * 15}%`, top: `${5 + (i % 3) * 25}%` }}
            animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.3 }}
          >
            {e}
          </motion.div>
        ))}
      </div>

      <div className="relative flex flex-col items-center px-4 py-8 min-h-screen justify-center max-w-lg mx-auto">
        {/* Title */}
        <motion.h1
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          className="font-display text-4xl font-extrabold text-candy-pink text-center drop-shadow-lg"
        >
          {mascotName} يتعلم العربية
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-bold text-slate-600 text-center mt-1"
        >
          لعبة تعليمية ممتعة للأطفال
        </motion.p>

        {/* Mascot */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="my-6"
        >
          <Mascot mood="idle" message={`مرحبًا يا صديقي! أنا ${mascotName}. هل أنت مستعد للعب والتعلّم؟`} size={140} />
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-3 w-full mb-6"
        >
          <div className="rounded-candy bg-white p-3 text-center shadow-candy-sm border-2 border-candy-sun">
            <Star className="mx-auto fill-candy-yellow text-candy-yellow" size={24} />
            <div className="font-display text-2xl font-extrabold text-amber-600">{stars}</div>
            <div className="text-xs font-bold text-slate-500">نجوم</div>
          </div>
          <div className="rounded-candy bg-white p-3 text-center shadow-candy-sm border-2 border-candy-leaf">
            <Trophy className="mx-auto text-candy-mint" size={24} />
            <div className="font-display text-2xl font-extrabold text-emerald-600">{score}</div>
            <div className="text-xs font-bold text-slate-500">نقاط</div>
          </div>
          <div className="rounded-candy bg-white p-3 text-center shadow-candy-sm border-2 border-candy-rose">
            <Award className="mx-auto text-candy-pink" size={24} />
            <div className="font-display text-2xl font-extrabold text-candy-pink">{earnedBadges.length}</div>
            <div className="text-xs font-bold text-slate-500">أوسمة</div>
          </div>
        </motion.div>

        {/* Progress bar */}
        <div className="w-full mb-6">
          <div className="flex justify-between text-sm font-bold text-slate-600 mb-1">
            <span>تقدّمك في المغامرة</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-5 w-full rounded-full bg-white/70 overflow-hidden shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-candy-mint to-candy-blue rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            />
          </div>
        </div>

        {/* Badges row */}
        {earnedBadges.length > 0 && (
          <div className="flex gap-2 mb-6 flex-wrap justify-center">
            {earnedBadges.map((b) => (
              <motion.div
                key={b.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 rounded-full bg-white px-3 py-1 shadow-candy-sm"
              >
                <span className="text-xl">{b.emoji}</span>
                <span className="text-xs font-bold text-slate-600">{b.label}</span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-3 w-full"
        >
          <PrimaryButton onClick={onPlay} icon={<Play size={22} fill="currentColor" />} className="text-2xl py-4">
            {completedCount > 0 ? 'واصل اللعب' : 'ابدأ المغامرة'}
          </PrimaryButton>
          <button
            onClick={onDashboard}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-display text-lg font-bold text-candy-blue shadow-candy-sm border-2 border-candy-sky"
          >
            <BarChart3 size={20} /> لوحة الوالدين
          </button>
        </motion.div>

        <div className="mt-6 flex items-center gap-1 text-xs font-bold text-slate-400">
          <BookOpen size={14} /> الوحدات الثلاث جاهزة للعب الآن
        </div>
      </div>
    </div>
  );
}

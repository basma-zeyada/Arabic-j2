import { motion } from 'framer-motion';
import { ArrowRight, Star, Trophy, Award, RotateCcw, BookOpen } from 'lucide-react';
import { units, SECTION_META } from '@/data/curriculum';
import { totalScore, totalStars, BADGES, type ProgressState, starsFromScore } from '@/lib/progress';
import { Card } from './ui';

export function ParentDashboard({
  progress,
  onBack,
  onReset,
}: {
  progress: ProgressState;
  onBack: () => void;
  onReset: () => void;
}) {
  const score = totalScore(progress);
  const stars = totalStars(progress);
  const allSections = units.flatMap((u) => u.sections);

  const sectionResults = allSections.map((s) => {
    const r = progress.results[s.id];
    const maxScore = getMaxScore(s);
    return {
      section: s,
      stars: r?.stars ?? 0,
      score: r?.score ?? 0,
      maxScore,
      done: !!r,
    };
  });

  const completedCount = sectionResults.filter((r) => r.done).length;
  const accuracy = sectionResults.filter((r) => r.done).reduce((sum, r) => sum + (r.maxScore > 0 ? r.score / r.maxScore : 0), 0);
  const avgAccuracy = completedCount > 0 ? Math.round((accuracy / completedCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-candy-leaf via-white to-candy-sky" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur border-b-2 border-candy-leaf">
        <button onClick={onBack} className="rounded-full bg-candy-leaf px-3 py-1.5 text-sm font-bold text-emerald-600 shadow-candy-sm flex items-center gap-1">
          <ArrowRight size={16} /> رجوع
        </button>
        <h2 className="font-display text-xl font-extrabold text-slate-700">لوحة الوالدين</h2>
        <button
          onClick={onReset}
          className="rounded-full bg-rose-100 px-3 py-1.5 text-sm font-bold text-rose-600 shadow-candy-sm flex items-center gap-1"
        >
          <RotateCcw size={14} /> تصفير
        </button>
      </div>

      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="text-center border-candy-sun">
            <Star className="mx-auto fill-candy-yellow text-candy-yellow" size={28} />
            <div className="font-display text-3xl font-extrabold text-amber-600">{stars}</div>
            <div className="text-xs font-bold text-slate-500">إجمالي النجوم</div>
          </Card>
          <Card className="text-center border-candy-leaf">
            <Trophy className="mx-auto text-candy-mint" size={28} />
            <div className="font-display text-3xl font-extrabold text-emerald-600">{score}</div>
            <div className="text-xs font-bold text-slate-500">إجمالي النقاط</div>
          </Card>
          <Card className="text-center border-candy-rose">
            <Award className="mx-auto text-candy-pink" size={28} />
            <div className="font-display text-3xl font-extrabold text-candy-pink">{progress.badges.length}</div>
            <div className="text-xs font-bold text-slate-500">أوسمة</div>
          </Card>
        </div>

        {/* Accuracy */}
        <Card className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-slate-700">نسبة الدقة</span>
            <span className="font-display text-2xl font-extrabold text-candy-blue">{avgAccuracy}%</span>
          </div>
          <div className="h-4 rounded-full bg-slate-100 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-candy-mint to-candy-blue rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${avgAccuracy}%` }}
            />
          </div>
          <div className="mt-2 text-sm font-bold text-slate-500">
            أكمل {completedCount} من {allSections.length} دروس
          </div>
        </Card>

        {/* Per-lesson breakdown */}
        <h3 className="font-display text-lg font-extrabold text-slate-700 mb-3 flex items-center gap-2">
          <BookOpen size={20} className="text-candy-pink" /> تفصيل الدروس
        </h3>
        <div className="space-y-2 mb-6">
          {sectionResults.map(({ section, stars: s, score: sc, maxScore, done }, i) => {
            const meta = SECTION_META[section.type];
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-3 rounded-2xl p-3 border-2 ${done ? 'bg-white border-candy-leaf' : 'bg-slate-50 border-slate-200'}`}
              >
                <div className={`w-10 h-10 rounded-full bg-gradient-to-b ${section.color} flex items-center justify-center text-xl shrink-0`}>
                  {meta.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-700 truncate">{section.title}</div>
                  <div className="text-xs text-slate-400">{done ? `${sc} / ${maxScore} نقطة` : 'لم يبدأ'}</div>
                </div>
                <div className="flex gap-0.5">
                  {[0, 1, 2].map((j) => (
                    <Star key={j} size={16} className={j < s ? 'fill-candy-yellow text-candy-yellow' : 'text-slate-200'} />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Badges */}
        <h3 className="font-display text-lg font-extrabold text-slate-700 mb-3 flex items-center gap-2">
          <Award size={20} className="text-candy-pink" /> الأوسمة
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {BADGES.map((b) => {
            const earned = progress.badges.includes(b.id);
            return (
              <div key={b.id} className={`rounded-2xl p-3 border-2 text-center ${earned ? 'bg-candy-sun border-amber-300' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
                <div className="text-3xl mb-1">{earned ? b.emoji : '🔒'}</div>
                <div className="font-bold text-slate-700 text-sm">{b.label}</div>
                <div className="text-xs text-slate-400">{b.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getMaxScore(section: { activity: any }): number {
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
    case 'picture-game': return a.sequence.length + a.memoryPairs.length;
    default: return 5;
  }
}

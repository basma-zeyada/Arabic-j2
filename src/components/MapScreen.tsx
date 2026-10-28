import { motion } from 'framer-motion';
import { Lock, Check, Play, Trophy, Star as StarIcon, Crown, Home } from 'lucide-react';
import { useMemo } from 'react';
import { SECTION_META, units, type Section } from '@/data/curriculum';
import { Mascot } from './Mascot';
import { totalScore, totalStars, type ProgressState } from '@/lib/progress';

// Precomputed winding positions for section nodes on a vertical map.
// Each entry is { xPercent, rotate } to create a candy-crush style curve.
const NODE_POSITIONS = [
  { x: 50, r: 0 },
  { x: 72, r: 6 },
  { x: 30, r: -6 },
  { x: 68, r: 8 },
  { x: 26, r: -8 },
  { x: 64, r: 6 },
  { x: 32, r: -6 },
  { x: 50, r: 0 },
];

function NodeStatus({
  index,
  section,
  progress,
  prevDone,
}: {
  index: number;
  section: Section;
  progress: ProgressState;
  prevDone: boolean;
}) {
  const isChallenge = section.type === 'challenge';
  const key = `${section.id}`;
  const result = progress.results[key];
  const done = !!result;
  const unlocked = index === 0 || prevDone;
  const locked = !unlocked && !done;

  return { isChallenge, done, unlocked, locked, stars: result?.stars ?? 0 };
}

function MapNode({
  section,
  index,
  status,
  onOpen,
  unitColor,
}: {
  section: Section;
  index: number;
  status: ReturnType<typeof NodeStatus>;
  onOpen: () => void;
  unitColor: string;
}) {
  const pos = NODE_POSITIONS[index % NODE_POSITIONS.length];
  const meta = SECTION_META[section.type];

  if (status.isChallenge) {
    return (
      <div className="relative flex flex-col items-center" style={{ marginLeft: `${pos.x}%`, transform: `translateX(-50%)` }}>
        <motion.button
          whileHover={status.unlocked ? { scale: 1.08, rotate: 0 } : {}}
          whileTap={status.unlocked ? { scale: 0.92 } : {}}
          onClick={status.unlocked ? onOpen : undefined}
          className={`relative w-28 h-28 rounded-full flex items-center justify-center text-4xl shadow-candy border-4 ${
            status.done
              ? 'bg-gradient-to-b from-amber-300 to-amber-500 border-white'
              : status.unlocked
              ? 'bg-gradient-to-b from-amber-400 to-candy-coral border-white animate-bob'
              : 'bg-slate-300 border-slate-200'
          }`}
          style={{ transform: `rotate(${pos.r}deg)` }}
        >
          {status.locked ? (
            <Lock className="text-slate-500" size={32} />
          ) : (
            <Trophy className={status.done ? 'text-white' : 'text-white'} size={40} />
          )}
          {status.done && (
            <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow">
              <Check className="text-emerald-500" size={16} />
            </div>
          )}
        </motion.button>
        <div className="mt-2 bg-white/90 rounded-full px-3 py-1 text-xs font-bold text-amber-700 shadow-candy-sm">
          {status.done ? 'أكملت التحدي!' : 'التحدي الكبير'}
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ marginLeft: `${pos.x}%`, transform: `translateX(-50%)` }}
    >
      <motion.button
        whileHover={status.unlocked ? { scale: 1.08 } : {}}
        whileTap={status.unlocked ? { scale: 0.92 } : {}}
        onClick={status.unlocked ? onOpen : undefined}
        className={`relative w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-candy border-4 border-white ${
          status.done
            ? `bg-gradient-to-b ${section.color}`
            : status.unlocked
            ? `bg-gradient-to-b ${section.color} animate-bob`
            : 'bg-slate-300'
        }`}
        style={{ transform: `rotate(${pos.r}deg)` }}
      >
        {status.locked ? (
          <Lock className="text-slate-500" size={24} />
        ) : status.done ? (
          <span className="text-3xl">{meta.emoji}</span>
        ) : (
          <span className="text-3xl">{meta.emoji}</span>
        )}
        {status.done && (
          <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow">
            <Check className="text-emerald-500" size={14} />
          </div>
        )}
        {!status.done && status.unlocked && (
          <motion.div
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="absolute -top-2 -right-2 bg-candy-yellow rounded-full p-1 shadow"
          >
            <Play className="text-amber-700" size={12} fill="currentColor" />
          </motion.div>
        )}
      </motion.button>
      {status.done && status.stars > 0 && (
        <div className="flex gap-0.5 mt-1 bg-white/90 rounded-full px-1.5 py-0.5 shadow-candy-sm">
          {[0, 1, 2].map((i) => (
            <StarIcon key={i} size={10} className={i < status.stars ? 'fill-candy-yellow text-candy-yellow' : 'text-slate-300'} />
          ))}
        </div>
      )}
      <div className={`mt-1 max-w-[120px] text-center text-[11px] font-bold ${status.unlocked ? 'text-slate-700' : 'text-slate-400'}`}>
        {section.title}
      </div>
    </div>
  );
}

export function MapScreen({
  progress,
  mascotName,
  onOpenSection,
  onHome,
}: {
  progress: ProgressState;
  mascotName: string;
  onOpenSection: (unitId: string, sectionIndex: number) => void;
  onHome: () => void;
}) {
  const unit = units[0]; // Unit 1 fully playable
  const score = useMemo(() => totalScore(progress), [progress]);
  const stars = useMemo(() => totalStars(progress), [progress]);

  const completedCount = unit.sections.filter((s) => progress.results[s.id]).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-candy-sky via-white to-candy-leaf" dir="rtl">
      {/* Top bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between gap-2 px-4 py-3 bg-white/80 backdrop-blur border-b-2 border-candy-rose">
        <button
          onClick={onHome}
          className="flex items-center gap-1 rounded-full bg-candy-rose px-3 py-1.5 text-sm font-bold text-candy-pink shadow-candy-sm"
        >
          <Home size={16} /> الرئيسية
        </button>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-full bg-candy-sun px-3 py-1.5 font-bold text-amber-700 shadow-candy-sm">
            <StarIcon size={16} className="fill-candy-yellow text-candy-yellow" /> {stars}
          </div>
          <div className="flex items-center gap-1 rounded-full bg-candy-leaf px-3 py-1.5 font-bold text-emerald-700 shadow-candy-sm">
            🏅 {score}
          </div>
        </div>
      </div>

      {/* Unit header */}
      <div className="px-4 pt-4 pb-2 text-center">
        <motion.h2
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-display text-2xl font-extrabold text-candy-pink"
        >
          {unit.emoji} {unit.title}
        </motion.h2>
        <p className="text-sm font-bold text-slate-500">
          أكملت {completedCount} من {unit.sections.length} دروس
        </p>
      </div>

      {/* Mascot greeting */}
      <div className="px-4 py-2 flex justify-center">
        <Mascot
          mood={completedCount === 0 ? 'idle' : completedCount === unit.sections.length ? 'cheer' : 'happy'}
          message={
            completedCount === 0
              ? `${mascotName} يقول: هيا نبدأ الرحلة! اضغط على الدرس الأول`
              : completedCount === unit.sections.length
              ? `${mascotName} يقول: أكملت كل الدروس! أنت بطل!`
              : `${mascotName} يقول: واصل التقدّم، أنت رائع!`
          }
          size={90}
        />
      </div>

      {/* The winding candy map */}
      <div className="relative mx-auto max-w-2xl px-4 pb-32 pt-4">
        {/* decorative winding path */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <path
            d="M50% 40 Q72% 120, 30% 220 Q68% 320, 26% 420 Q64% 520, 32% 620 Q50% 700, 50% 780"
            stroke="#ffd6e6"
            strokeWidth="8"
            fill="none"
            className="map-path"
          />
        </svg>

        <div className="relative flex flex-col gap-10">
          {unit.sections.map((section, i) => {
            const prevDone = i === 0 || !!progress.results[unit.sections[i - 1].id];
            const status = NodeStatus({ index: i, section, progress, prevDone });
            return (
              <MapNode
                key={section.id}
                section={section}
                index={i}
                status={status}
                unitColor={unit.color}
                onOpen={() => onOpenSection(unit.id, i)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

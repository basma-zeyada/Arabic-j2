import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { Camera, Check, Upload, X, Play, Pause } from 'lucide-react';
import { Mascot } from '../Mascot';
import { PrimaryButton, Card } from '../ui';
import { useSpeech } from '@/lib/useSpeech';
import type { WritingActivity, NasheedActivity, ChallengeMixActivity } from '@/data/curriculum';

// ---------- Writing ----------

export function Writing({ activity, onComplete }: {
  activity: WritingActivity;
  onComplete: (correct: number, total: number) => void;
}) {
  const [checked, setChecked] = useState<boolean[]>(activity.rubric.map(() => false));
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setPhotoUploaded(true);
  };

  const allChecked = checked.every(Boolean);
  const score = checked.filter(Boolean).length;

  return (
    <div className="flex flex-col items-center gap-4" dir="rtl">
      {/* Explanation */}
      <Card className="w-full max-w-md bg-gradient-to-b from-candy-rose to-white">
        <h3 className="font-display text-xl font-extrabold text-candy-grape text-center mb-2">
          📝 {activity.explanationTitle}
        </h3>
        <ol className="list-decimal pr-5 space-y-1 text-right">
          {activity.explanationSteps.map((s, i) => (
            <li key={i} className="font-bold text-slate-700">{s}</li>
          ))}
        </ol>
        <div className="mt-3 rounded-2xl bg-candy-sun p-3">
          <div className="font-bold text-amber-700">{activity.exampleTitle}</div>
          <p className="text-slate-700">{activity.exampleText}</p>
        </div>
      </Card>

      {/* Special instruction card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md rounded-candy bg-gradient-to-b from-candy-yellow to-candy-sun p-4 shadow-candy border-4 border-amber-300 text-center"
      >
        <div className="text-4xl mb-1">📷</div>
        <p className="font-display font-bold text-amber-800">
          اكتب إجابتك على ورقة خارجية، ثم صوّرها للتحقق إلكترونيًا!
        </p>
      </motion.div>

      {/* Prompt */}
      <Card className="w-full max-w-md">
        <p className="font-bold text-slate-700 text-center">{activity.prompt}</p>
      </Card>

      {/* Photo upload */}
      <div className="w-full max-w-md">
        <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFile} />
        <PrimaryButton onClick={() => fileRef.current?.click()} icon={<Camera size={20} />} className="w-full">
          {photoUploaded ? 'تم رفع الصورة ✓' : 'صوّر إجابتك'}
        </PrimaryButton>
        {photoUploaded && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 rounded-2xl bg-emerald-100 p-2 text-center text-sm font-bold text-emerald-700">
            تم استلام الصورة! الآن تحقّق من القائمة أدناه.
          </motion.div>
        )}
      </div>

      {/* Self-check rubric */}
      <Card className="w-full max-w-md">
        <h4 className="font-display font-bold text-candy-grape text-center mb-2">✅ قائمة التحقق</h4>
        <div className="space-y-2">
          {activity.rubric.map((item, i) => (
            <button
              key={i}
              onClick={() => setChecked((c) => c.map((v, j) => (j === i ? !v : v)))}
              className={`w-full flex items-center justify-between rounded-xl px-3 py-2 border-2 text-right font-bold ${
                checked[i] ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              <span>{item}</span>
              {checked[i] ? <Check size={18} /> : <X size={18} className="text-slate-300" />}
            </button>
          ))}
        </div>
      </Card>

      {allChecked && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-2">
          <Mascot mood="cheer" message="عمل رائع! أكملت كل خطوات الكتابة!" size={80} />
          <PrimaryButton onClick={() => onComplete(score, activity.rubric.length)}>إنهاء</PrimaryButton>
        </motion.div>
      )}
    </div>
  );
}

// ---------- Nasheed (karaoke) ----------

export function Nasheed({ activity, onComplete }: {
  activity: NasheedActivity;
  onComplete: (correct: number, total: number) => void;
}) {
  const { speak, speaking, stop } = useSpeech();
  const [activeLine, setActiveLine] = useState(-1);
  const [finished, setFinished] = useState(false);

  const play = () => {
    if (speaking) {
      stop();
      setActiveLine(-1);
      return;
    }
    let line = 0;
    const tick = () => {
      if (line >= activity.lines.length) {
        setActiveLine(-1);
        setFinished(true);
        return;
      }
      setActiveLine(line);
      speak(activity.lines[line], { rate: 0.9, pitch: 1.2 });
      line++;
      setTimeout(tick, 2600);
    };
    tick();
  };

  return (
    <div className="flex flex-col items-center gap-4" dir="rtl">
      <div className="w-full max-w-md rounded-candy bg-gradient-to-b from-candy-rose to-candy-sky p-6 shadow-candy border-4 border-white text-center">
        <h3 className="font-display text-2xl font-extrabold text-candy-pink mb-4">🎵 {activity.title}</h3>
        <div className="space-y-2">
          {activity.lines.map((line, i) => {
            const rhythmHits = activity.rhythm?.[i] ?? [];
            const words = line.split(' ');
            const isActive = i === activeLine;
            return (
              <motion.div
                key={i}
                animate={isActive ? { scale: 1.05 } : { scale: 1 }}
                className={`text-lg font-bold leading-loose transition ${
                  isActive ? 'text-amber-700' : finished ? 'text-slate-700' : 'text-slate-500'
                }`}
              >
                {words.map((w, wi) => (
                  <span key={wi} className={`mx-1 ${isActive && rhythmHits.includes(wi) ? 'karaoke-active' : ''}`}>
                    {w}
                  </span>
                ))}
              </motion.div>
            );
          })}
        </div>
      </div>

      <button
        onClick={play}
        className="inline-flex items-center gap-2 rounded-full bg-candy-pink px-6 py-3 font-bold text-white shadow-candy"
      >
        {speaking ? <Pause size={20} /> : <Play size={20} />}
        {speaking ? 'إيقاف' : 'غنّ معي!'}
      </button>

      {(finished || !speaking) && finished && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-2">
          <Mascot mood="cheer" message="صوتك جميل! أنت مغنٍ رائع!" size={80} />
          <PrimaryButton onClick={() => onComplete(1, 1)}>إنهاء</PrimaryButton>
        </motion.div>
      )}
      {!finished && !speaking && (
        <Mascot mood="idle" message="اضغط على زر الغناء لتبدأ!" size={80} />
      )}
    </div>
  );
}

// ---------- Challenge mix ----------

export function ChallengeMix({ activity, onComplete }: {
  activity: ChallengeMixActivity;
  onComplete: (correct: number, total: number) => void;
}) {
  // Run MCQ questions then simple matching
  const [phase, setPhase] = useState<'quiz' | 'match' | 'done'>('quiz');
  const [quizCorrect, setQuizCorrect] = useState(0);
  const [matchCorrect, setMatchCorrect] = useState(0);

  const onQuizDone = (c: number, _t: number) => {
    setQuizCorrect(c);
    if (activity.matchPairs && activity.matchPairs.length) {
      setPhase('match');
    } else {
      setPhase('done');
    }
  };

  const onMatchDone = (c: number, _t: number) => {
    setMatchCorrect(c);
    setPhase('done');
  };

  if (phase === 'quiz') {
    return <MCQInline questions={activity.questions} onComplete={onQuizDone} />;
  }

  if (phase === 'match' && activity.matchPairs) {
    return (
      <div className="flex flex-col items-center gap-4" dir="rtl">
        <h3 className="font-display text-xl font-bold text-amber-600">طابق الصور بالكلمات</h3>
        <SimpleMatch pairs={activity.matchPairs} onComplete={onMatchDone} />
      </div>
    );
  }

  const total = activity.questions.length + (activity.matchPairs?.length ?? 0);
  const correct = quizCorrect + matchCorrect;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-3" dir="rtl">
      <Mascot mood={correct >= total * 0.7 ? 'cheer' : 'happy'} message={`نقاطك: ${correct} من ${total}!`} size={100} />
      <PrimaryButton onClick={() => onComplete(correct, total)}>استلام النجوم</PrimaryButton>
    </motion.div>
  );
}

function MCQInline({ questions, onComplete }: {
  questions: { id: string; prompt: string; options: string[]; answerIndex: number; emoji?: string }[];
  onComplete: (c: number, t: number) => void;
}) {
  const [i, setI] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(false);
  const q = questions[i];

  const choose = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.answerIndex) setCorrect((c) => c + 1);
  };

  const next = () => {
    if (i + 1 >= questions.length) {
      onComplete(correct, questions.length);
      return;
    }
    setI(i + 1);
    setSelected(null);
    setAnswered(false);
  };

  return (
    <div className="flex flex-col items-center gap-4" dir="rtl">
      <div className="w-full max-w-md rounded-candy bg-white p-6 shadow-candy border-2 border-amber-300 text-center">
        {q.emoji && <div className="text-5xl mb-2">{q.emoji}</div>}
        <p className="font-display text-lg font-bold text-slate-700">{q.prompt}</p>
      </div>
      <div className="grid gap-2 w-full max-w-md">
        {q.options.map((opt, idx) => {
          const isCorrect = idx === q.answerIndex;
          let style = 'bg-white border-candy-rose text-slate-700';
          if (answered && isCorrect) style = 'bg-emerald-100 border-emerald-400 text-emerald-700';
          else if (answered && idx === selected && !isCorrect) style = 'bg-rose-100 border-rose-400 text-rose-700';
          return (
            <button key={idx} onClick={() => choose(idx)} className={`rounded-2xl border-2 px-4 py-3 font-bold ${style}`}>
              {opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <PrimaryButton onClick={next}>
          {i + 1 >= questions.length ? 'التالي' : 'السؤال التالي'}
        </PrimaryButton>
      )}
    </div>
  );
}

function SimpleMatch({ pairs, onComplete }: {
  pairs: { arabic: string; picture: string }[];
  onComplete: (c: number, t: number) => void;
}) {
  const [matched, setMatched] = useState<Set<number>>(new Set());
  return (
    <div className="flex flex-col items-center gap-3" dir="rtl">
      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {pairs.map((p, i) => (
          <button
            key={i}
            onClick={() => setMatched((m) => new Set(m).add(i))}
            disabled={matched.has(i)}
            className={`rounded-2xl p-4 border-2 text-center ${matched.has(i) ? 'bg-emerald-100 border-emerald-400' : 'bg-white border-candy-pink'}`}
          >
            <div className="text-4xl">{matched.has(i) ? p.picture : '❓'}</div>
            <div className="font-bold text-candy-pink mt-1">{p.arabic}</div>
          </button>
        ))}
      </div>
      {matched.size === pairs.length && (
        <PrimaryButton onClick={() => onComplete(pairs.length, pairs.length)}>التالي</PrimaryButton>
      )}
    </div>
  );
}

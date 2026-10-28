// Curriculum data model for the Arabic learning game.
// Unit 1 is fully populated so the app is playable end-to-end.

export type SectionType =
  | 'alphabet'      // الحروف منطوقة
  | 'listening'     // دروس الاستماع
  | 'reading'       // دروس القراءة
  | 'grammar'       // الأساليب والتراكيب
  | 'spelling'      // القواعد الإملائية
  | 'writing'       // الكتابة - شرح وعملي
  | 'nasheed'       // الأناشيد
  | 'challenge';    // التحدي المجمع

export type ActivityType =
  | 'flashcards'
  | 'listening-quiz'
  | 'reading-tap'
  | 'matching'
  | 'drag-sort'
  | 'mcq'
  | 'writing'
  | 'nasheed'
  | 'challenge-mix';

export interface BaseActivity {
  id: string;
  type: ActivityType;
  title: string;
  instructions: string;
}

export interface FlashcardItem {
  letter: string;
  word: string;
  emoji: string;
  soundLabel: string; // short description of vowel sound
}

export interface FlashcardsActivity extends BaseActivity {
  type: 'flashcards';
  cards: FlashcardItem[];
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  emoji?: string;
  audioLine?: string; // text to be spoken via TTS for listening
}

export interface MCQActivity extends BaseActivity {
  type: 'mcq';
  questions: QuizQuestion[];
}

export interface ListeningQuizActivity extends BaseActivity {
  type: 'listening-quiz';
  storyTitle: string;
  storyText: string;
  questions: QuizQuestion[];
}

export interface ReadingTapActivity extends BaseActivity {
  type: 'reading-tap';
  passage: string;
  vocab: { word: string; meaning: string; emoji?: string }[];
  matchPairs: { arabic: string; picture: string }[];
}

export interface MatchingActivity extends BaseActivity {
  type: 'matching';
  pairs: { left: string; right: string; emoji?: string }[];
}

export interface DragSortActivity extends BaseActivity {
  type: 'drag-sort';
  prompt: string;
  items: { id: string; label: string; correctBucket: string }[];
  buckets: { id: string; label: string; emoji?: string }[];
}

export interface WritingActivity extends BaseActivity {
  type: 'writing';
  explanationTitle: string;
  explanationSteps: string[];
  exampleTitle: string;
  exampleText: string;
  rubric: string[]; // self-check criteria
  prompt: string;
  imageUrl?: string;
}

export interface NasheedActivity extends BaseActivity {
  type: 'nasheed';
  lines: string[];
  // rhythm pattern: array of indices per line marking emphasized words
  rhythm?: number[][];
}

export interface ChallengeMixActivity extends BaseActivity {
  type: 'challenge-mix';
  questions: QuizQuestion[];
  matchPairs?: { arabic: string; picture: string }[];
  dragItems?: { id: string; label: string; correctBucket: string }[];
  dragBuckets?: { id: string; label: string; emoji?: string }[];
}

export type Activity =
  | FlashcardsActivity
  | MCQActivity
  | ListeningQuizActivity
  | ReadingTapActivity
  | MatchingActivity
  | DragSortActivity
  | WritingActivity
  | NasheedActivity
  | ChallengeMixActivity;

export interface Section {
  id: string;
  type: SectionType;
  title: string;
  subtitle: string;
  emoji: string;
  color: string; // tailwind gradient classes
  activity: Activity;
}

export interface Unit {
  id: string;
  number: number;
  title: string;
  emoji: string;
  color: string;
  sections: Section[];
}

export const SECTION_META: Record<SectionType, { label: string; emoji: string; color: string }> = {
  alphabet: { label: 'الحروف منطوقة', emoji: '🔤', color: 'from-candy-pink to-candy-coral' },
  listening: { label: 'دروس الاستماع', emoji: '🎧', color: 'from-candy-blue to-candy-sky' },
  reading: { label: 'دروس القراءة', emoji: '📖', color: 'from-candy-mint to-candy-leaf' },
  grammar: { label: 'الأساليب والتراكيب', emoji: '🧩', color: 'from-candy-yellow to-candy-sun' },
  spelling: { label: 'القواعد الإملائية', emoji: '✏️', color: 'from-candy-coral to-candy-rose' },
  writing: { label: 'الكتابة', emoji: '📝', color: 'from-candy-grape to-candy-rose' },
  nasheed: { label: 'الأناشيد', emoji: '🎵', color: 'from-candy-pink to-candy-grape' },
  challenge: { label: 'التحدي المجمع', emoji: '🏆', color: 'from-amber-400 to-candy-coral' },
};

// ---------------- Unit 1 ----------------

export const units: Unit[] = [
  {
    id: 'unit-1',
    number: 1,
    title: 'الوحدة الأولى: أهلاً يا صديقي',
    emoji: '🌟',
    color: 'from-candy-pink via-candy-blue to-candy-mint',
    sections: [
      {
        id: 'u1-s1',
        type: 'alphabet',
        title: 'الحروف منطوقة',
        subtitle: 'تعلّم الحروف مع الحركات',
        emoji: '🔤',
        color: 'from-candy-pink to-candy-coral',
        activity: {
          id: 'u1-s1-a',
          type: 'flashcards',
          title: 'بطاقات الحروف',
          instructions: 'اضغط على كل حرف لتسمعه، ثم استمع للكلمة مع الفتحة والكسرة والضمة.',
          cards: [
            { letter: 'أ', word: 'أَسَد', emoji: '🦁', soundLabel: 'فتحة: أَ' },
            { letter: 'ب', word: 'بَطّ', emoji: '🦆', soundLabel: 'فتحة: بَ / كسرة: بِ / ضمة: بُ' },
            { letter: 'ت', word: 'تُفّاح', emoji: '🍎', soundLabel: 'ضمة: تُ' },
            { letter: 'ث', word: 'ثَعلَب', emoji: '🦊', soundLabel: 'فتحة: ثَ' },
            { letter: 'ج', word: 'جَمَل', emoji: '🐪', soundLabel: 'فتحة: جَ' },
            { letter: 'ح', word: 'حِصان', emoji: '🐴', soundLabel: 'كسرة: حِ' },
            { letter: 'خ', word: 'خُبز', emoji: '🍞', soundLabel: 'ضمة: خُ' },
            { letter: 'د', word: 'دِيك', emoji: '🐓', soundLabel: 'كسرة: دِ' },
            { letter: 'ر', word: 'رُمّان', emoji: '🍎', soundLabel: 'ضمة: رُ' },
            { letter: 'س', word: 'سَمَك', emoji: '🐟', soundLabel: 'فتحة: سَ' },
            { letter: 'ش', word: 'شَمْس', emoji: '☀️', soundLabel: 'فتحة: شَ' },
            { letter: 'ع', word: 'عَصفور', emoji: '🐦', soundLabel: 'فتحة: عَ' },
          ],
        },
      },
      {
        id: 'u1-s2',
        type: 'listening',
        title: 'درس الاستماع',
        subtitle: 'قصة: الأمير والنخلة',
        emoji: '🎧',
        color: 'from-candy-blue to-candy-sky',
        activity: {
          id: 'u1-s2-a',
          type: 'listening-quiz',
          title: 'استمع للقصة ثم أجب',
          instructions: 'اضغط على زر التشغيل للاستماع، ثم أجب عن الأسئلة.',
          storyTitle: 'الأمير والنخلة',
          storyText: 'كان هناك أميرٌ طيبٌ يحبّ الأشجار. زرع نخلةً صغيرةً أمام بيته، وسقاها كلَّ يومٍ بالماء. كبرت النخلةُ وأعطته تمرًا حلوًا. فرِح الأميرُ وقال: شكرًا يا نخلة!',
          questions: [
            {
              id: 'q1',
              prompt: 'ماذا زرع الأمير؟',
              options: ['شجرة تفاح', 'نخلة', 'وردة', 'بطيخة'],
              answerIndex: 1,
              emoji: '🌴',
            },
            {
              id: 'q2',
              prompt: 'بماذا سقى الأمير النخلة؟',
              options: ['العصير', 'الماء', 'الحليب', 'الشاي'],
              answerIndex: 1,
              emoji: '💧',
            },
            {
              id: 'q3',
              prompt: 'ماذا أعطته النخلة حين كبرت؟',
              options: ['تفاح', 'تمر حلو', 'برتقال', 'عنب'],
              answerIndex: 1,
              emoji: '🌰',
            },
            {
              id: 'q4',
              prompt: 'بماذا شكر الأميرُ النخلة؟',
              options: ['قال: شكرًا يا نخلة', 'صفّق بيديه', 'ركض حولها', 'نام'],
              answerIndex: 0,
              emoji: '🙏',
            },
          ],
        },
      },
      {
        id: 'u1-s3',
        type: 'reading',
        title: 'درس القراءة',
        subtitle: 'الصباح الجميل',
        emoji: '📖',
        color: 'from-candy-mint to-candy-leaf',
        activity: {
          id: 'u1-s3-a',
          type: 'reading-tap',
          title: 'اقرأ وافهم',
          instructions: 'اضغط على أي كلمة لمعرفة معناها، ثم طابق الكلمات مع الصور.',
          passage: 'يبدأُ الصباحُ الجميلُ بأشعةِ الشمسِ الدافئة. تستيقظُ الطيورُ وتغنّي على الأغصان. يفتحُ الولدُ النافذةَ ويقول: صباحُ الخير يا أمي!',
          vocab: [
            { word: 'الصباح', meaning: 'بداية النهار', emoji: '🌅' },
            { word: 'أشعة', meaning: 'ضوء الشمس', emoji: '☀️' },
            { word: 'الدافئة', meaning: 'التي تُسخّن بلطف', emoji: '🔥' },
            { word: 'تستيقظ', meaning: 'تنهض من النوم', emoji: '⏰' },
            { word: 'تغنّي', meaning: 'تُسمِع صوتًا جميلًا', emoji: '🎶' },
            { word: 'الأغصان', meaning: 'فروع الشجر', emoji: '🌿' },
            { word: 'النافذة', meaning: 'فتحة في الجدار', emoji: '🪟' },
          ],
          matchPairs: [
            { arabic: 'الشمس', picture: '☀️' },
            { arabic: 'الطائر', picture: '🐦' },
            { arabic: 'النافذة', picture: '🪟' },
            { arabic: 'الغصن', picture: '🌿' },
          ],
        },
      },
      {
        id: 'u1-s4',
        type: 'grammar',
        title: 'الأساليب والتراكيب',
        subtitle: 'المفرد والجمع',
        emoji: '🧩',
        color: 'from-candy-yellow to-candy-sun',
        activity: {
          id: 'u1-s4-a',
          type: 'drag-sort',
          title: 'صنّف: مفرد أم جمع؟',
          instructions: 'اسحب كل كلمة إلى الصندوق الصحيح: مفرد أو جمع.',
          prompt: 'ضع كل كلمة في المكان المناسب.',
          items: [
            { id: 'i1', label: 'ولد', correctBucket: 'singular' },
            { id: 'i2', label: 'أولاد', correctBucket: 'plural' },
            { id: 'i3', label: 'قلم', correctBucket: 'singular' },
            { id: 'i4', label: 'أقلام', correctBucket: 'plural' },
            { id: 'i5', label: 'نخلة', correctBucket: 'singular' },
            { id: 'i6', label: 'نخيل', correctBucket: 'plural' },
            { id: 'i7', label: 'وردة', correctBucket: 'singular' },
            { id: 'i8', label: 'ورود', correctBucket: 'plural' },
          ],
          buckets: [
            { id: 'singular', label: 'مفرد', emoji: '1️⃣' },
            { id: 'plural', label: 'جمع', emoji: '🔢' },
          ],
        },
      },
      {
        id: 'u1-s5',
        type: 'spelling',
        title: 'القواعد الإملائية',
        subtitle: 'التاء المربوطة والهاء',
        emoji: '✏️',
        color: 'from-candy-coral to-candy-rose',
        activity: {
          id: 'u1-s5-a',
          type: 'mcq',
          title: 'اختر الكلمة الصحيحة',
          instructions: 'لاحظ نهاية كل كلمة: هل هي تاء مربوطة (ة) أم هاء (ه)؟',
          questions: [
            {
              id: 'q1',
              prompt: 'شجرةٌ كبيرة... أيهم صحيح؟',
              options: ['شَجَرَه', 'شَجَرَة', 'شَجَر'],
              answerIndex: 1,
              emoji: '🌳',
            },
            {
              id: 'q2',
              prompt: 'هذا بيت... نهايته:',
              options: ['بيتة', 'بيته', 'بيت'],
              answerIndex: 1,
              emoji: '🏠',
            },
            {
              id: 'q3',
              prompt: 'حديقةٌ جميلة... الكلمة الصحيحة:',
              options: ['حديقه', 'حديقة', 'حدائق'],
              answerIndex: 1,
              emoji: '🌷',
            },
            {
              id: 'q4',
              prompt: 'كتابُهُ جديد... نهاية الكلمة:',
              options: ['كتابه', 'كتابة', 'كتاب'],
              answerIndex: 0,
              emoji: '📕',
            },
            {
              id: 'q5',
              prompt: 'في المدرسة... نهاية الكلمة:',
              options: ['المدرسه', 'المدرسة', 'المدرس'],
              answerIndex: 1,
              emoji: '🏫',
            },
          ],
        },
      },
      {
        id: 'u1-s6',
        type: 'writing',
        title: 'الكتابة — شرح وعملي',
        subtitle: 'كيف أكتب جملة عن نفسي؟',
        emoji: '📝',
        color: 'from-candy-grape to-candy-rose',
        activity: {
          id: 'u1-s6-a',
          type: 'writing',
          title: 'اكتب جملة عن نفسك',
          instructions: 'اقرأ الشرح ثم اكتب إجابتك على ورقة خارجية، وصوّرها للتحقق!',
          explanationTitle: 'كيف تكتب جملة عن نفسك؟',
          explanationSteps: [
            'ابدأ باسمك: اسمي...',
            'اذكر عمرك: عمري... سنوات.',
            'اذكر شيئًا تحبّه: أحبّ...',
            'اختم بأمنية: أتمنى أن...',
          ],
          exampleTitle: 'مثال:',
          exampleText: 'اسمي سارة، عمري ثماني سنوات، أحبّ الرسم، وأتمنى أن أصبح رسّامة.',
          rubric: [
            'بدأت باسمي.',
            'ذكرت عمري.',
            'ذكرت شيئًا أحبّه.',
            'كتبت أمنية.',
            'كتبت الحروف بوضوح.',
          ],
          prompt: 'اكتب جملةً عن نفسك على ورقة، ثم صوّرها واضغط على "تحقّق من إجابتي" للتأكد من القائمة.',
        },
      },
      {
        id: 'u1-s7',
        type: 'nasheed',
        title: 'الأناشيد',
        subtitle: 'نشيد: صباح الخير',
        emoji: '🎵',
        color: 'from-candy-pink to-candy-grape',
        activity: {
          id: 'u1-s7-a',
          type: 'nasheed',
          title: 'نشيد صباح الخير',
          instructions: 'غنّ مع النشيد! تضيء الكلمات مع الإيقاع.',
          lines: [
            'صباحُ الخيرِ يا أصدقائي',
            'صباحٌ مليءٌ بالضياء',
            'نُسلِمُ الأرواحَ للسماء',
            'ونُباركُ للطيرِ الغناء',
            'صباحُ الخيرِ يا أمي',
            'صباحُ الخيرِ يا وطني',
          ],
          rhythm: [
            [0, 1, 3],
            [0, 2],
            [0, 2],
            [1, 3],
            [0, 2],
            [0, 2],
          ],
        },
      },
      {
        id: 'u1-s8',
        type: 'challenge',
        title: 'التحدي المجمع',
        subtitle: 'اختبر كل ما تعلّمته في الوحدة',
        emoji: '🏆',
        color: 'from-amber-400 to-candy-coral',
        activity: {
          id: 'u1-s8-a',
          type: 'challenge-mix',
          title: 'تحدي الوحدة الأولى',
          instructions: 'أسئلة من كل درس! اجمع النجوم الثلاثة.',
          questions: [
            {
              id: 'cq1',
              prompt: 'أيُّ كلمةٍ تبدأ بحرف "ج"؟',
              options: ['سمك', 'جمل', 'تفاح', 'قمر'],
              answerIndex: 1,
              emoji: '🐪',
            },
            {
              id: 'cq2',
              prompt: 'بماذا سقى الأميرُ النخلةَ في القصة؟',
              options: ['العصير', 'الماء', 'الحليب'],
              answerIndex: 1,
              emoji: '💧',
            },
            {
              id: 'cq3',
              prompt: 'معنى كلمة "تغنّي":',
              options: ['تبكي', 'تنام', 'تُسمِع صوتًا جميلًا'],
              answerIndex: 2,
              emoji: '🎶',
            },
            {
              id: 'cq4',
              prompt: 'كلمة "أولاد" هي:',
              options: ['مفرد', 'جمع'],
              answerIndex: 1,
              emoji: '🔢',
            },
            {
              id: 'cq5',
              prompt: 'الصحيح في كتابة "مدرسة":',
              options: ['مدرسه', 'مدرسة'],
              answerIndex: 1,
              emoji: '🏫',
            },
            {
              id: 'cq6',
              prompt: 'في نشيد صباح الخير، ماذا يملأ الأرواح؟',
              options: ['الضياء', 'الظلام', 'المطر'],
              answerIndex: 0,
              emoji: '☀️',
            },
          ],
          matchPairs: [
            { arabic: 'النخلة', picture: '🌴' },
            { arabic: 'الأسد', picture: '🦁' },
            { arabic: 'الشمس', picture: '☀️' },
          ],
        },
      },
    ],
  },
];

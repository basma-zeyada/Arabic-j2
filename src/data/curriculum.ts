// Curriculum data model for the Arabic learning game.
// Units 1, 2, and 3 fully populated based on the second-grade Arabic curriculum.

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
  soundLabel: string;
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
  audioLine?: string;
}

export interface MCQActivity extends BaseActivity {
  type: 'mcq';
  questions: QuizQuestion[];
}

export interface ListeningQuizActivity extends BaseActivity {
  type: 'listening-quiz';
  storyTitle: string;
  storyText: string;
  storySegments?: { text: string; voice: 'narrator' | 'girl' | 'boy' | 'woman' | 'man' }[];
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
  rubric: string[];
  prompt: string;
  imageUrl?: string;
}

export interface NasheedActivity extends BaseActivity {
  type: 'nasheed';
  lines: string[];
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
  color: string;
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

export const units: Unit[] = [
  {
    id: 'unit-1',
    number: 1,
    title: 'الوحدة الأولى: المعاملة الطيبة',
    emoji: '🌟',
    color: 'from-candy-pink via-candy-blue to-candy-mint',
    sections: [
      {
        id: 'u1-s1',
        type: 'listening',
        title: 'درس الاستماع',
        subtitle: 'قصة: يوم جميل',
        emoji: '🎧',
        color: 'from-candy-blue to-candy-sky',
        activity: {
          id: 'u1-s1-a',
          type: 'listening-quiz',
          title: 'استمع لقصة (يوم جميل) ثم أجب',
          instructions: 'استمع لقصة مريم وساعدتها لصديقتها ليلى، ثم أجب عن الأسئلة.',
          storyTitle: 'يوم جميل',
          storyText: 'أنا مريم، اليوم كان يوماً جميلاً، سأحكي لكم ما حدث في المدرسة اليوم. استيقظت مبكرة، وابتسمت لأمي وأبي، وقالت: صباح الخير. وتناولْتُ فطوري، فذهبت إلى المدرسة. لاحظت أن صديقتي ليلى حزينة، فسألتها: ماذا تبحثين يا علياء؟ - قالت علياء: ضاعت مقلمتي. ساعدت علياء صديقتها نور حتى وجدت مقلمتها. قالت علياء: شكراً لك يا نور، أنت أجمل صديقة، وقد أعدت قلبي بكلماتك. - ونور: عفواً.. نحن أصدقاء، ويساعد بعضنا بعضاً. وفي الفسحة، كنت ألعب مع أصدقائي، فصدمتُ زميلتي فاطمة دون قصد، فقالت فاطمة: أنا آسفة يا مريم.. لا مشكلة، أنا أعرف أنك...',
          questions: [
            {
              id: 'u1-q1',
              prompt: 'من هي بطلة قصة الاستماع؟',
              options: ['ليلى', 'مريم', 'فاطمة', 'نور'],
              answerIndex: 1,
              emoji: '👧',
            },
            {
              id: 'u1-q2',
              prompt: 'ماذا قالت مريم لأمها وأبيها عندما استيقظت؟',
              options: ['تصاب بالخير', 'صباح الخير', 'مساء الخير', 'إلى اللقاء'],
              answerIndex: 1,
              emoji: '☀️',
            },
            {
              id: 'u1-q3',
              prompt: 'لماذا كانت ليلى حزينة في المدرسة؟',
              options: ['لأنها نسيت قلمها', 'لأن مقلمتها ضاعت', 'لأنها تضايقت من الفسحة', 'لأنها تأخرت'],
              answerIndex: 1,
              emoji: '🎒',
            },
            {
              id: 'u1-q4',
              prompt: 'ما الكلمات الجميلة التي تداولها الأصدقاء في القصة؟',
              options: ['شكراً، آسف، من فضلك', 'اذهب، تعال', 'أنا لا أعرف', 'لا أستطيع'],
              answerIndex: 0,
              emoji: '💬',
            },
          ],
        },
      },
      {
        id: 'u1-s2',
        type: 'reading',
        title: 'درس القراءة',
        subtitle: 'كلماتي الجميلة',
        emoji: '📖',
        color: 'from-candy-mint to-candy-leaf',
        activity: {
          id: 'u1-s2-a',
          type: 'reading-tap',
          title: 'اقرأ وافهم درس كلماتى الجميلة',
          instructions: 'اضغط على الكلمات لمعرفة معانيها واستيعاب آداب الحديث.',
          passage: 'حضرت ليلى اليوم وهي تحمل حقيبتها الجميلة وقالت: حقيبتك جميلة يا ليلى، فابتسمت ليلى وقالت: شكراً يا سلمى. أثناء الحصة سقط قلم يوسف فقالت ليلى: هل تريد أن أضعه لك؟ وأخذت ليلى القلم وأعطته له فقال يوسف: شكراً لك.',
          vocab: [
            { word: 'الحقيبة', meaning: 'ما يحمل فيه الكتب والأدوات', emoji: '🎒' },
            { word: 'الحصة', meaning: 'درس المدرسة المدرج في الجدول', emoji: '🏫' },
            { word: 'شكراً', meaning: 'كلمة شكر وامتنان', emoji: '🙏' },
          ],
          matchPairs: [
            { arabic: 'الحقيبة', picture: '🎒' },
            { arabic: 'القلم', picture: '✏️' },
            { arabic: 'المعلمة', picture: '👩‍🏫' },
          ],
        },
      },
      {
        id: 'u1-s3',
        type: 'reading',
        title: 'درس القراءة',
        subtitle: 'أحب أصدقائي',
        emoji: '📖',
        color: 'from-candy-mint to-candy-leaf',
        activity: {
          id: 'u1-s3-a',
          type: 'reading-tap',
          title: 'قصة أحمد وشريف',
          instructions: 'استكشف معاني مفردات درس أحب أصدقائي.',
          passage: 'أنا أحمد، سأحكي لكم ما حدث في المدرسة اليوم. وجدنا زميلاً جديداً يجلس وحده في ركن الفصل. قالت المعلمة: هذا شريف زميلكم الجديد، فرحبوا به.',
          vocab: [
            { word: 'زميل', meaning: 'صديق في الدراسة', emoji: '👦' },
            { word: 'بارع', meaning: 'متقن وممتاز', emoji: '⭐' },
            { word: 'الفسحة', meaning: 'وقت الاستراحة واللعب', emoji: '⚽' },
          ],
          matchPairs: [
            { arabic: 'الشجرة', picture: '🌳' },
            { arabic: 'الرسم', picture: '🎨' },
            { arabic: 'الفصل', picture: '🏫' },
          ],
        },
      },
      {
        id: 'u1-s4',
        type: 'grammar',
        title: 'الأساليب والتراكيب',
        subtitle: 'المثنى',
        emoji: '🧩',
        color: 'from-candy-yellow to-candy-sun',
        activity: {
          id: 'u1-s4-a',
          type: 'drag-sort',
          title: 'قاعدة المثنى',
          instructions: 'صنف الكلمات المفردة والمثناة بإضافة (ان أو ين).',
          prompt: 'اختر الصندوق المناسب لكل كلمة.',
          items: [
            { id: 'm1', label: 'قلمَان', correctBucket: 'dual' },
            { id: 'm2', label: 'قلميْن', correctBucket: 'dual' },
            { id: 'm3', label: 'كتاب', correctBucket: 'singular' },
            { id: 'm4', label: 'معلم', correctBucket: 'singular' },
          ],
          buckets: [
            { id: 'singular', label: 'مفرد', emoji: '1️⃣' },
            { id: 'dual', label: 'مثنى (اثنان)', emoji: '2️⃣' },
          ],
        },
      },
      {
        id: 'u1-s5',
        type: 'nasheed',
        title: 'الأناشيد',
        subtitle: 'نشيد: الطفل المأدب',
        emoji: '🎵',
        color: 'from-candy-pink to-candy-grape',
        activity: {
          id: 'u1-s5-a',
          type: 'nasheed',
          title: 'نشيد الطفل المأدب',
          instructions: 'استمتع بقراءة وحفظ أبيات نشيد الطفل المأدب.',
          lines: [
            'أنا الطفل المأدبْ ... مع الناس مهذبْ',
            'أقول الصدق دوماً ... وما كذبت يوماً',
            'أساعد الكبارْ ... وأنصح الصغارْ',
            'بأخلاق الكرامْ ... نحيا في سلامْ',
          ],
          rhythm: [
            [0, 1, 3],
            [0, 2],
            [1, 3],
            [0, 3],
          ],
        },
      },
    ],
  },
  {
    id: 'unit-2',
    number: 2,
    title: 'الوحدة الثانية: عادات صحية',
    emoji: '🏃‍♀️',
    color: 'from-candy-blue via-candy-mint to-candy-coral',
    sections: [
      {
        id: 'u2-s1',
        type: 'listening',
        title: 'درس الاستماع',
        subtitle: 'أرتّب حياتي',
        emoji: '🎧',
        color: 'from-candy-blue to-candy-sky',
        activity: {
          id: 'u2-s1-a',
          type: 'listening-quiz',
          title: 'استمع لقصة (أرتّب حياتي)',
          instructions: 'اقرأ أو استمع للقصة حول لين وتنظيم غرفتها وأشياءها.',
          storyTitle: 'أرتّب حياتي',
          storyText: 'استيقظت لين مبكراً على صوت عصفور يغني قرب نافذتها، وقالت: حان وقت ترتيب غرفتي. بدأت لين بجمع ألعابها ووضعها في مكانها، ثم رتبت كتبها على الرفوف. وعندما انتهت شعرت بالسعادة وقالت: غرفتي الآن جميلة! النظام يجعل المكان أفضل. وفي المدرسة طلب المعلم من التلاميذ ترتيب أشيائهم بسرعة وسهولة. لاحظ المعلم أن لين رتبت أغراضها بسرعة، فابتسم المعلم وقال: عمل ممتاز يا لين.',
          questions: [
            {
              id: 'u2-q1',
              prompt: 'ما اسم بطلة قصة الاستماع؟',
              options: ['مريم', 'لين', 'آمنة', 'فاطمة'],
              answerIndex: 1,
              emoji: '👧',
            },
            {
              id: 'u2-q2',
              prompt: 'ماذا استيقظت لين على صوت؟',
              options: ['المنبه', 'عصفور يغني', 'سيارة الإسعاف', 'صوت المطر'],
              answerIndex: 1,
              emoji: '🐦',
            },
            {
              id: 'u2-q3',
              prompt: 'ماذا رتبت لين في غرفتها أولاً؟',
              options: ['الملابس', 'الألعاب والكتب', 'السرير فقط', 'النافذة'],
              answerIndex: 1,
              emoji: '🧸',
            },
            {
              id: 'u2-q4',
              prompt: 'ماذا قال المعلم عندما رأى أغراض لين مرتبة؟',
              options: ['عمل ممتاز يا لين', 'أحسنتِ يا ليلى', 'تأخري قليلاً', 'رائع'],
              answerIndex: 0,
              emoji: '⭐',
            },
          ],
        },
      },
      {
        id: 'u2-s2',
        type: 'reading',
        title: 'درس القراءة',
        subtitle: 'أسناني قوية',
        emoji: '📖',
        color: 'from-candy-mint to-candy-leaf',
        activity: {
          id: 'u2-s2-a',
          type: 'reading-tap',
          title: 'قصة أشرف وسوسة الأسنان',
          instructions: 'انقر على كلمات الدرس وتعرف على أهمية نظافة الأسنان.',
          passage: 'جلس أشرف على سريره وتذكر أنه لم يغسل أسنانه بالفرشاة، لكنه تكاسل ثم نام. رأى في الحلم حشرة كبيرة تواجهه، حاول أشرف إبعادها لكنها كانت تقترب أكثر فأكثر. هرب أشرف وهو يصرخ: لا.. لا.. ابتعدي عني!',
          vocab: [
            { word: 'فرشاة', meaning: 'أداة تنظيف الأسنان', emoji: '🪥' },
            { word: 'سوسة', meaning: 'حشرة تضر الأسنان عند إهمال غسلها', emoji: '🦠' },
            { word: 'المرآة', meaning: 'ما يعكس الصور', emoji: '🪞' },
          ],
          matchPairs: [
            { arabic: 'الفرشاة', picture: '🪥' },
            { arabic: 'الحمام', picture: '🚿' },
            { arabic: 'المرآة', picture: '🪞' },
          ],
        },
      },
      {
        id: 'u2-s3',
        type: 'reading',
        title: 'درس القراءة',
        subtitle: 'طعامي الصحي',
        emoji: '📖',
        color: 'from-candy-mint to-candy-leaf',
        activity: {
          id: 'u2-s3-a',
          type: 'reading-tap',
          title: 'قصة آمنة والطعام الصحي',
          instructions: 'اكتشف مفردات درس طعامي الصحي وأهمية التغذية السليمة.',
          passage: 'في يوم من الأيام كانت آمنة تشعر بالتعب في طريق العودة من المدرسة، فهي تمشي بصعوبة وتجر حقيبتها لأنها لا تقدر على حملها. وصلت إلى البيت ثم اشتكت لأمها: لماذا أشعر بالتعب الدائم؟',
          vocab: [
            { word: 'التعب', meaning: 'الإرهاق وقلة الطاقة', emoji: '🥱' },
            { word: 'الغذاء', meaning: 'الطعام الذي نأكله', emoji: '🥗' },
            { word: 'نشيط', meaning: 'ممتلئ بالحيوية', emoji: '⚡' },
          ],
          matchPairs: [
            { arabic: 'الخضراوات', picture: '🥦' },
            { arabic: 'الفواكه', picture: '🍎' },
            { arabic: 'الدجاج', picture: '🍗' },
          ],
        },
      },
      {
        id: 'u2-s4',
        type: 'grammar',
        title: 'الأساليب والتراكيب',
        subtitle: 'ظرف الزمان والمكان',
        emoji: '🧩',
        color: 'from-candy-yellow to-candy-sun',
        activity: {
          id: 'u2-s4-a',
          type: 'drag-sort',
          title: 'صنّف: ظرف زمان أم مكان؟',
          instructions: 'اسحب كل ظرف إلى مكانه الصحيح.',
          prompt: 'ميّز بين ظرف الزمان وظرف المكان.',
          items: [
            { id: 'ts1', label: 'صباحاً', correctBucket: 'time' },
            { id: 'ts2', label: 'مساءً', correctBucket: 'time' },
            { id: 'ts3', label: 'أمام', correctBucket: 'place' },
            { id: 'ts4', label: 'تحت', correctBucket: 'place' },
          ],
          buckets: [
            { id: 'time', label: 'ظرف زمان', emoji: '⏰' },
            { id: 'place', label: 'ظرف مكان', emoji: '📍' },
          ],
        },
      },
      {
        id: 'u2-s5',
        type: 'nasheed',
        title: 'الأناشيد',
        subtitle: 'نشيد: البطل الصغير',
        emoji: '🎵',
        color: 'from-candy-pink to-candy-grape',
        activity: {
          id: 'u2-s5-a',
          type: 'nasheed',
          title: 'نشيد البطل الصغير',
          instructions: 'استمتع بحفظ ترديد كلمات نشيد العادات الصحية.',
          lines: [
            'البطل الصغيرْ ... عاداته مفيدةْ',
            'يقوم في المبكورْ ... للنور والسرورْ',
            'ينظف الأسنانْ ... يرتّب المكانْ',
            'طعامه صحيْ ... وجسمه قويْ',
            'البطل الصغيرْ ... حياته سعيدةْ',
          ],
          rhythm: [
            [0, 2],
            [1, 3],
            [0, 2],
            [1, 3],
            [0, 3],
          ],
        },
      },
    ],
  },
  {
    id: 'unit-3',
    number: 3,
    title: 'الوحدة الثالثة: رياضة وتكنولوجيا',
    emoji: '💻',
    color: 'from-candy-coral via-candy-yellow to-candy-grape',
    sections: [
      {
        id: 'u3-s1',
        type: 'listening',
        title: 'درس الاستماع',
        subtitle: 'الرياضة لنا جميعاً',
        emoji: '🎧',
        color: 'from-candy-blue to-candy-sky',
        activity: {
          id: 'u3-s1-a',
          type: 'listening-quiz',
          title: 'استمع لقصة (الرياضة لنا جميعاً)',
          instructions: 'استمع لقصة ماجد ونور وأهمية الرياضة والتكنولوجيا.',
          storyTitle: 'الرياضة لنا جميعاً',
          storyText: 'أنا ماجد، أحب كرة السلة، وأتدرب في النادي لكي أفوز بجائزة أفضل لاعب في الفريق. علّمنا المدرب حركات مهمة، ونصحنا بمشاهدة بعض الحركات على الإنترنت لنتعلمها. كانت أختي نور مشغولة بمشاهدة فيديوهات عن الرياضة في التلفاز، وقالت نور: أنا أحب مشاهدة الرياضيين وهم يتمارينون، لكن لا أستطيع ممارسة الرياضة مثلهم. قالت الأم: يمكننا أن نبدأ بشيء بسيط، فالجري والرياضة تجعلنا أقوياء وتزيد من نشاطنا، والتكنولوجيا يمكن أن تساعدنا في تعلم حركات رياضية جديدة. وضحكت نور وقالت: سأبدأ بالجري، وسأتعلم بعض الحركات من الفيديوهات.',
          questions: [
            {
              id: 'u3-q1',
              prompt: 'ما الرياضة التي يحبها ماجد؟',
              options: ['كرة القدم', 'كرة السلة', 'السباحة', 'الكاراتيه'],
              answerIndex: 1,
              emoji: '🏀',
            },
            {
              id: 'u3-q2',
              prompt: 'ماذا نصح المدرب اللاعبين لتعلّم حركات جديدة؟',
              options: ['القراءة في كتاب', 'مشاهدة الحركات على الإنترنت', 'النوم مبكراً', 'شرب الحليب'],
              answerIndex: 1,
              emoji: '💻',
            },
            {
              id: 'u3-q3',
              prompt: 'ما أول رياضة قررت نور أن تبدأ بها؟',
              options: ['الجري', 'كرة اليد', 'السباحة', 'رفع الأثقال'],
              answerIndex: 0,
              emoji: '🏃‍♀️',
            },
            {
              id: 'u3-q4',
              prompt: 'ما فائدة الرياضة والتكنولوجيا بحسب الأم؟',
              options: ['تزيد التعب', 'تجعلنا أقوياء وتساعدنا في التعلّم', 'تضيع الوقت', 'تضر العينين'],
              answerIndex: 1,
              emoji: '⭐',
            },
          ],
        },
      },
      {
        id: 'u3-s2',
        type: 'reading',
        title: 'درس القراءة',
        subtitle: 'حسام والكمبيوتر',
        emoji: '📖',
        color: 'from-candy-mint to-candy-leaf',
        activity: {
          id: 'u3-s2-a',
          type: 'reading-tap',
          title: 'قصة حسام والكمبيوتر',
          instructions: 'انقر على كلمات الدرس وتعرف على تنظيم وقت استخدام الشاشات.',
          passage: 'يجلس حسام لفترات طويلة أمام الكمبيوتر اليوم، ووضع يده على عينه متألماً وقال: يا أمي، عيني تؤلمني. قالت الأم: سلامتك يا حسام، أعرف أنك تحب الكمبيوتر، لكن الجلوس أمام الشاشة لفترة طويلة يؤذي عينيك.',
          vocab: [
            { word: 'الكمبيوتر', meaning: 'جهاز حاسوب إلكتروني', emoji: '💻' },
            { word: 'الشاشة', meaning: 'لوحة العرض في الأجهزة', emoji: '🖥️' },
            { word: 'الصحة', meaning: 'سلامة الجسم والعافية', emoji: '💚' },
          ],
          matchPairs: [
            { arabic: 'الكمبيوتر', picture: '💻' },
            { arabic: 'الكتاب', picture: '📚' },
            { arabic: 'الصلاة', picture: '🕌' },
          ],
        },
      },
      {
        id: 'u3-s3',
        type: 'reading',
        title: 'درس القراءة',
        subtitle: 'في النادي',
        emoji: '📖',
        color: 'from-candy-mint to-candy-leaf',
        activity: {
          id: 'u3-s3-a',
          type: 'reading-tap',
          title: 'قصة في النادي',
          instructions: 'تعرف على معاني مفردات وتفوق أبطال الرياضة في النادي.',
          passage: 'في يوم العطلة ذهب نبيل وأخته سما إلى النادي لممارسة رياضتهما المفضلة. جلس نبيل مع الصديقين مهند وفريدة بعد الانتهاء، وقال مهند: ما رأيكم أن يحكي كل منا سبب تفوقه في رياضته المفضلة؟',
          vocab: [
            { word: 'النادي', meaning: 'مكان مخصص للرياضة والأنشطة', emoji: '🏟️' },
            { word: 'التعاون', meaning: 'العمل المشترك بين الفريق', emoji: '🤝' },
            { word: 'الكاراتيه', meaning: 'لعبة رياضية دفاعية', emoji: '🥋' },
          ],
          matchPairs: [
            { arabic: 'كرة القدم', picture: '⚽' },
            { arabic: 'كرة اليد', picture: '🤾' },
            { arabic: 'الكراسي المتحركة', picture: '🦽' },
          ],
        },
      },
      {
        id: 'u3-s4',
        type: 'grammar',
        title: 'الأساليب والتراكيب',
        subtitle: 'أسلوب الأمر والنهي',
        emoji: '🧩',
        color: 'from-candy-yellow to-candy-sun',
        activity: {
          id: 'u3-s4-a',
          type: 'drag-sort',
          title: 'صنّف: أسلوب أمر أم نهي؟',
          instructions: 'صنف الجمل والأساليب حسب نوعها.',
          prompt: 'ضع كل عبارة في خانتها الصحيحة.',
          items: [
            { id: 'an1', label: 'اكتب الواجب', correctBucket: 'command' },
            { id: 'an2', label: 'رتب غرفتك', correctBucket: 'command' },
            { id: 'an3', label: 'لا تكتب على الحائط', correctBucket: 'prohibition' },
            { id: 'an4', label: 'لا تلعب في الشارع', correctBucket: 'prohibition' },
          ],
          buckets: [
            { id: 'command', label: 'أسلوب أمر', emoji: '📌' },
            { id: 'prohibition', label: 'أسلوب نهي (يبدأ لا)', emoji: '🛑' },
          ],
        },
      },
      {
        id: 'u3-s5',
        type: 'nasheed',
        title: 'الأناشيد',
        subtitle: 'نشيد: رياضي',
        emoji: '🎵',
        color: 'from-candy-pink to-candy-grape',
        activity: {
          id: 'u3-s5-a',
          type: 'nasheed',
          title: 'نشيد رياضي',
          instructions: 'استمتع بحفظ وترديد نشيد الرياضة والنظام.',
          lines: [
            'رياضي الجديدةْ ... مفيدة نافعةْ',
            'جسمي به قويْ ... عقلي به ذكيْ',
            'ترتب الأوقاتْ ... تجمّل الحياةْ',
            'تعلّم النظامْ ... وتصنع السلامْ',
          ],
          rhythm: [
            [0, 2],
            [1, 3],
            [0, 2],
            [1, 3],
          ],
        },
      },
    ],
  },
];
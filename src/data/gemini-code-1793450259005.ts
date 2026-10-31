// Curriculum data model for the Arabic learning game.
// Units 1, 2, and 3 fully populated with correct Tashkeel and spelling.

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

// ---------------- Units 1, 2, 3 ----------------

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
        subtitle: 'قصة: يَوْمٌ جَمِيلٌ',
        emoji: '🎧',
        color: 'from-candy-blue to-candy-sky',
        activity: {
          id: 'u1-s1-a',
          type: 'listening-quiz',
          title: 'استمع للقصة ثم أجب',
          instructions: 'اضغط على زر التشغيل للاستماع، ثم أجب عن الأسئلة.',
          storyTitle: 'يوم جميل',
          storyText: 'أنا مَرْيَمُ، اليَوْمَ كانَ يَوْماً جَمِيلاً، سَأَحْكِي لَكُمْ ما حَدَثَ في المَدْرَسَةِ اليَوْمَ. اسْتَيْقَظْتُ مُبَكِّرَةً، وابتسَمْتُ لِأُمِّي وأبي، وقُلْتُ: "صَبَاحُ الخَيْرِ". وتناولْتُ فَطُورِي، فذهَبْتُ إلى المَدْرَسَةِ. لاحظْتُ أنَّ صَدِيقَتِي لَيْلَى حَزِينَةٌ، فسألتُها: "ماذا تبحثين يا علياء؟" - قالت علياء: ضاعت مقلمتي. ساعدت علياء صديقتها نور حتى وجدت مقلمتها. قالت علياء: شكراً لك يا نور، أنت أجمل صديقة، وقد أعدت قلبي بكلماتك. - ونور: عفواً.. نحن أصدقاء، ويساعد بعضنا بعضاً. وفي الفسحة، كنت ألعب مع أصدقائي، فصدمتُ زميلتي فاطمة دون قصد، فقالت فاطمة: أنا آسفة يا مريم.. لا مشكلة، أنا أعرف أنك...',
          questions: [
            {
              id: 'q1',
              prompt: 'مَنْ اسْتَيْقَظَ مُبَكِّرَةً في قِصَّةِ (يَوْمٌ جَمِيلٌ)؟',
              options: ['لَيْلَى', 'مَرْيَمُ', 'فَاطِمَةُ', 'عَلْيَاءُ'],
              answerIndex: 1,
              emoji: '👧',
            },
            {
              id: 'q2',
              prompt: 'لِماذَا كانَتْ لَيْلَى حَزِينَةً؟',
              options: ['لأنها نسيت حقيبتها المدرسية', 'لأنها تخرّجت', 'لأنها ناسية طعامها', 'لأنها مريضة'],
              answerIndex: 0,
              emoji: '🎒',
            },
            {
              id: 'q3',
              prompt: 'ماذا فَعَلَتْ مَرْيَمُ مَعَ لَيْلَى؟',
              options: ['تركتها وبكت', 'أعطتها قلماً وساعدتها', 'أخذت منها المقلمة', 'أبلغت المعلمة'],
              answerIndex: 1,
              emoji: '✏️',
            },
            {
              id: 'q4',
              prompt: 'مَاذَا قَالَتْ فَاطِمَةُ عِنْدَمَا صَدَمَتْهَا مَرْيَمُ دُونَ قَصْدٍ؟',
              options: ['أنا غاضبة منك', 'لا مشكلة، أنا أعرف أنك لم تعمدي', 'ابتعدي عني', 'لا بأس'],
              answerIndex: 1,
              emoji: '🤝',
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
          title: 'اقرأ وافهم',
          instructions: 'اضغط على أي كلمة لمعرفة معناها، ثم طابق الكلمات مع المعاني.',
          passage: 'حضرت ليلى اليوم وهي تحمل حقيبتها الجميلة وقالت: "حقيبتك جميلة يا ليلى"، فابتسمت ليلى وقالت: "شكراً يا سلمى". وأثناء الحصة سقط قلم يوسف فقالت ليلى: هل تريد أن أضحه لك؟ وأخذت ليلى القلم وأعطته له فقال يوسف: "شكراً لك". ابتسمت المعلمة وقالت: "ما أجمل كلماتكم.. آباؤكم وأمهاتكم علمُوكم كلمات جميلة مثل: شكراً، آسف، من فضلك".',
          vocab: [
            { word: 'حقيبة', meaning: 'محفظة أو وعاء لجمع الأغراض', emoji: '🎒' },
            { word: 'تزين', meaning: 'تجمل وتحسن', emoji: '✨' },
            { word: 'تسعد', meaning: 'تفرح وتسر', emoji: '😊' },
          ],
          matchPairs: [
            { arabic: 'حقيبة', picture: '🎒' },
            { arabic: 'قلم', picture: '✏️' },
            { arabic: 'معلمة', picture: '👩‍🏫' },
            { arabic: 'قلوب', picture: '💖' },
          ],
        },
      },
      {
        id: 'u1-s3',
        type: 'grammar',
        title: 'الأساليب والتراكيب',
        subtitle: 'الْمُثَنَّى',
        emoji: '🧩',
        color: 'from-candy-yellow to-candy-sun',
        activity: {
          id: 'u1-s3-a',
          type: 'drag-sort',
          title: 'صنّف الكلمات المثناة',
          instructions: 'اسحب الكلمات لتعرف كيفية دلالتها على اثنين.',
          prompt: 'ميِّز الكلمات المثناة الصحيحة.',
          items: [
            { id: 'i1', label: 'قَلَمَانِ', correctBucket: 'dual' },
            { id: 'i2', label: 'قَلَمَيْنِ', correctBucket: 'dual' },
            { id: 'i3', label: 'كِتَابٌ', correctBucket: 'singular' },
            { id: 'i4', label: 'مْرَسمَتَانِ', correctBucket: 'dual' },
          ],
          buckets: [
            { id: 'singular', label: 'مُفْرَدٌ', emoji: '1️⃣' },
            { id: 'dual', label: 'مُثَنَّى', emoji: '2️⃣' },
          ],
        },
      },
      {
        id: 'u1-s4',
        type: 'nasheed',
        title: 'الأناشيد',
        subtitle: 'نَشِيدُ: الطِّفْلُ الْمُؤَدَّبُ',
        emoji: '🎵',
        color: 'from-candy-pink to-candy-grape',
        activity: {
          id: 'u1-s4-a',
          type: 'nasheed',
          title: 'الطفل المؤدب',
          instructions: 'استمتع بقراءة النشيد وتعلّم الأخلاق الحميدة.',
          lines: [
            'أنا الطِّفْلُ المُؤَدَّبُ ... مَعَ النَّاسِ مُهَذَّبُ',
            'أَقُولُ الصِّدْقَ دَوْماً ... وَما كَذَبْتُ يَوْماً',
            'أُسَاعِدُ الكِبَارْ ... وَأَنْصَحُ الصِّغَارْ',
            'بِأَخْلَاقِ الكِرَامْ ... نَحْيَا في سَلَامْ',
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
    color: 'from-candy-coral via-candy-rose to-candy-yellow',
    sections: [
      {
        id: 'u2-s1',
        type: 'listening',
        title: 'درس الاستماع',
        subtitle: 'قِصَّةُ: أُرَتِّبُ حَيَاتِي',
        emoji: '🎧',
        color: 'from-candy-blue to-candy-sky',
        activity: {
          id: 'u2-s1-a',
          type: 'listening-quiz',
          title: 'استمع لقصة أرتّب حياتي وأجب',
          instructions: 'استمع للنص ثم أجب عن الأسئلة بدقة.',
          storyTitle: 'أرتّب حياتي',
          storyText: 'اسْتَيْقَظَتْ لِينُ مُبَكِّرَةً عَلى صَوْتِ عُصْفُورٍ يُغَنِّي قُرْبَ نافِذَتِها، وقالتْ: "حانَ وَقْتُ تَرْتِيبِ غُرْفَتِي". بَدَأَتْ لِينُ بِجَمْعِ ألعابِها ووضعِها في مكانِها، ثُمَّ رَتَّبَتْ كُتُبَها عَلى الرُّفُوفِ. وعِنْدَما انْتَهَتْ شَعَرَتْ بالسَّعادَةِ وقالتْ: "غُرْفَتِي الآنَ جَمِيلَةٌ! النِّظامُ يَجْعَلُ المَكانَ أَفْضَلَ". وفي المَدْرَسَةِ طَلَبَ المُعَلِّمُ مِنَ التَّلامِيذِ تَرْتِيبَ أَشْياءِهِمْ بِسُرْعَةٍ وسُهُولَةٍ. لاحظَ المُعَلِّمُ أَنَّ لِين رَتَّبَتْ أغراضَها بِسُرْعَةٍ، فابْتَسَمَ المُعَلِّمُ وقالَ: "عَمَلٌ مُمْتَازٌ يا لِينُ".',
          questions: [
            {
              id: 'uq1',
              prompt: 'عَلى مَذْ صَوْتِ اسْتَيْقَظَتْ لِينُ؟',
              options: ['صوت قطة', 'صوت عصفور يغني قرب نافذتها', 'صوت جرس المدرسة', 'صوت المطر'],
              answerIndex: 1,
              emoji: '🐦',
            },
            {
              id: 'uq2',
              prompt: 'ماذا رَتَّبَتْ لِينُ في غُرْفَتِها؟',
              options: ['ألعابها وكتبها', 'الملابس فقط', 'الحديقة', 'المطبخ'],
              answerIndex: 0,
              emoji: '🧸',
            },
            {
              id: 'uq3',
              prompt: 'ماذا قالَ المُعَلِّمُ لِليْنَ في المَدْرَسَةِ؟',
              options: ['تأخرت يا لِينُ', 'عَمَلٌ مُمْتَازٌ يا لِينُ', 'رتبي حقيبتك مرة أخرى', 'أين كتبك؟'],
              answerIndex: 1,
              emoji: '⭐',
            },
          ],
        },
      },
      {
        id: 'u2-s2',
        type: 'reading',
        title: 'درس القراءة',
        subtitle: 'أَسْنَانِي قَوِيَّةٌ',
        emoji: '📖',
        color: 'from-candy-mint to-candy-leaf',
        activity: {
          id: 'u2-s2-a',
          type: 'reading-tap',
          title: 'أسناني قوية',
          instructions: 'اقرأ القصة واعرف كيف تحافظ على أسنانك.',
          passage: 'جَلَسَ أَشْرَفُ عَلى سَرِيرِهِ وتَذَكَّرَ أَنَّهُ لَمْ يَغْسِلْ أَسْنَانَهُ بِالفُرْشاةِ، لَكِنَّهُ تَكَاسَلَ ثُمَّ نامَ. رَأَى في الحُلُمِ حَشَرَةً كَبِيرَةً تُواجِهُهُ، حاوَلَ أَشْرَفُ إبعادَها لَكِنَّها كانَتْ تَقْتَرِبُ أَكْثَرَ فَأَكْثَرَ. هَرَبَ أَشْرَفُ وهُو يصرخ: "لا.. لا.. ابتعدي عني!". فجأة ظهرت فرشاة أسنان ضخمة وقالت له: "لا تخف، أنا أحميك منها". استيقظ أشرف وأسرع إلى الحمام، وأمسك بالفرشاة وغسل أسنانه جيداً.',
          vocab: [
            { word: 'فرشاة', meaning: 'أداة تنظيف الأسنان', emoji: '🪥' },
            { word: 'سوسة', meaning: 'حشرة تؤذي الأسنان', emoji: '🐛' },
            { word: 'حمام', meaning: 'مكان الغسل والنظافة', emoji: '🚿' },
          ],
          matchPairs: [
            { arabic: 'فرشاة', picture: '🪥' },
            { arabic: 'مرآة', picture: '🪞' },
            { arabic: 'حمام', picture: '🚿' },
          ],
        },
      },
      {
        id: 'u2-s3',
        type: 'grammar',
        title: 'الأساليب والتراكيب',
        subtitle: 'ظَرْفُ الزَّمانِ وَظَرْفُ المَكانِ',
        emoji: '🧩',
        color: 'from-candy-yellow to-candy-sun',
        activity: {
          id: 'u2-s3-a',
          type: 'drag-sort',
          title: 'صنّف الظروف',
          instructions: 'صنّف الكلمات إلى ظرف زمان أو ظرف مكان.',
          prompt: 'ضع كل ظرف في مكانه الصحيح.',
          items: [
            { id: 'd1', label: 'صَبَاحاً', correctBucket: 'time' },
            { id: 'd2', label: 'فَوْقَ', correctBucket: 'place' },
            { id: 'd3', label: 'تَحْتَ', correctBucket: 'place' },
            { id: 'd4', label: 'مَسَاءً', correctBucket: 'time' },
          ],
          buckets: [
            { id: 'time', label: 'ظَرْفُ زَمَانٍ', emoji: '⏰' },
            { id: 'place', label: 'ظَرْفُ مَكَانٍ', emoji: '📍' },
          ],
        },
      },
      {
        id: 'u2-s4',
        type: 'nasheed',
        title: 'الأناشيد',
        subtitle: 'نَشِيدُ: البَطَلُ الصَّغِيرُ',
        emoji: '🎵',
        color: 'from-candy-pink to-candy-grape',
        activity: {
          id: 'u2-s4-a',
          type: 'nasheed',
          title: 'البطل الصغير',
          instructions: 'استمتع بالنشيد الصحي.',
          lines: [
            'البَطَلُ الصَّغِيرْ ... عَاداتُهُ مُفِيدَةْ',
            'يَقُومُ في المَبْكُورْ ... لِلنُّورِ والسُّرُورْ',
            'يُنَظِّفُ الأَسْنَانْ ... يُرَتِّبُ المَكَانْ',
            'طَعَامُهُ صِحِّيْ ... وجِسْمُهُ قَوِيْ',
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
    color: 'from-candy-blue via-candy-mint to-candy-pink',
    sections: [
      {
        id: 'u3-s1',
        type: 'listening',
        title: 'درس الاستماع',
        subtitle: 'قِصَّةُ: الرِّياضَةُ لَنا جَميعاً',
        emoji: '🎧',
        color: 'from-candy-blue to-candy-sky',
        activity: {
          id: 'u3-s1-a',
          type: 'listening-quiz',
          title: 'استمع لقصة الرياضة لنا جميعاً وأجب',
          instructions: 'استمع للنص بعناية وأجب عن الأسئلة.',
          storyTitle: 'الرياضة لنا جميعاً',
          storyText: 'أنا ماجِدٌ، أُحِبُّ كُرَةَ السِّلَّةِ، وأَتَدَرَّبُ في النَّادِي لِكَيْ أفُوزَ بِجائِزَةِ أَفْضَلِ لاعِبٍ في الفَرِيقِ. عَلَّمَنا المُدَرِّبُ حَرَكاتٍ مُهِمَّةً، ونَصَحَنا بِمُشاهَدَةِ بَعْضِ الحَرَكاتِ عَلى الإِنْتِرْنَتِ لِنَتَعَلَّمَها. كانَتْ أُخْتِي نُورُ مَشْغُولَةً بِمُشاهَدَةِ فِيدِيوهاتٍ عَنِ الرِّياضَةِ في التِّلْفازِ، وقالتْ نُورُ: "أنا أُحِبُّ مُشاهَدَةَ الرِّياضِيِّينَ وهُمْ يَتَمَرَّنُونَ، لَكِنْ لا أَسْتَطِيعُ مُمارَسَةَ الرِّياضَةِ مِثْلَهُمْ". قالَتِ الأُمُّ: "يُمْكِنُنا أَنْ نَبْدَأَ بِشَيْءٍ بَسِيطٍ، فَالجَرْيُ والرِّياضَةُ تَجْعَلُنا أَقْوِياءَ وتَزِيدُ مِنْ نَشاطِنا، والتِّكْنُولُوجيا يُمْكِنُ أَنْ تُساعِدَنا في تَعَلُّمِ حَرَكاتٍ رِياضِيَّةٍ جَدِيدَةٍ".',
          questions: [
            {
              id: 'uq3-1',
              prompt: 'مَا هيَ الرِّياضَةُ الَّتي يُحِبُّها ماجِدٌ؟',
              options: ['كرة القدم', 'كرة السلة', 'السباحة', 'الجري'],
              answerIndex: 1,
              emoji: '🏀',
            },
            {
              id: 'uq3-2',
              prompt: 'ماذا كانَتْ تُشاهِدُ نُورُ في التِّلْفازِ؟',
              options: ['رسوماً متحركة', 'فيديوهات عن الرياضة', 'برامج مسابقات', 'أفلام وثائقية'],
              answerIndex: 1,
              emoji: '📺',
            },
            {
              id: 'uq3-3',
              prompt: 'كَيْفَ تُساعِدُنا التِّكْنُولُوجيا حسب رأي الأم؟',
              options: ['في اللعب فقط', 'في تعلم حركات رياضية جديدة', 'في النوم', 'في إطعام العصافير'],
              answerIndex: 1,
              emoji: '📱',
            },
          ],
        },
      },
      {
        id: 'u3-s2',
        type: 'reading',
        title: 'درس القراءة',
        subtitle: 'حُسامٌ والكَمْبِيُوتَرُ',
        emoji: '📖',
        color: 'from-candy-mint to-candy-leaf',
        activity: {
          id: 'u3-s2-a',
          type: 'reading-tap',
          title: 'حسام والكمبيوتر',
          instructions: 'اقرأ القصة واعرف أهمية تنظيم الوقت بين التكنولوجيا والرياضة.',
          passage: 'يَجْلِسُ حُسامٌ لِفَتَراتٍ طَوِيلَةٍ أَمامَ الكَمْبِيُوتَرِ اليَوْمَ، ووَضَعَ يَدَهُ عَلى عَيْنِهِ مُتَأَلِّماً وقالَ: "يا أُمِّي، عَيْنِي تُؤْلِمُنِي". قالَتِ الأُمُّ: "سَلامَتُكَ يا حُسامُ، أَعْرِفُ أَنَّكَ تُحِبُّ الكَمْبِيُوتَرَ، لَكِنَّ الجُلُوسَ أَمامَ الشَّاشَةِ لِفَتْرَةٍ طَوِيلَةٍ يُؤْذِي عَيْنَيْكَ". قالَ حُسامٌ: "لَكِنَّني أُرِيدُ أَنْ أُكْمِلَ اللُّعْبَةَ". قالَتِ الأُمُّ بِابْتِسامَةٍ: "يا بُنَيَّ، أَعْلَمُ أنَّ اللَّعِبَ مُمْتِعٌ، لَكِنَّ الجُلُوسَ لِفَتَراتٍ طَوِيلَةٍ يَضُرُّ بِصِحَّتِكَ، ويُقَلِّلُ مِنْ فَتَراتِ النَّوْمِ اللازِمَةِ، وقِلَّةُ الحَرَكَةِ تَضُرُّ الجِسْمَ أَيْضاً".',
          vocab: [
            { word: 'كمبيوتر', meaning: 'جهاز حاسوب آلي', emoji: '💻' },
            { word: 'شاشة', meaning: 'لوحة العرض الإلكترونية', emoji: '🖥️' },
            { word: 'لعبة', meaning: 'وسيلة ترفيهية مسلية', emoji: '🎮' },
          ],
          matchPairs: [
            { arabic: 'كمبيوتر', picture: '💻' },
            { arabic: 'عين', picture: '👁️' },
            { arabic: 'صلاة', picture: '🕌' },
          ],
        },
      },
      {
        id: 'u3-s3',
        type: 'grammar',
        title: 'الأساليب والتراكيب',
        subtitle: 'أُسْلُوبُ الأَمْرِ وَأُسْلُوبُ النَّهْيِ',
        emoji: '🧩',
        color: 'from-candy-yellow to-candy-sun',
        activity: {
          id: 'u3-s3-a',
          type: 'drag-sort',
          title: 'أمر أم نهي؟',
          instructions: 'ميز بين أسلوب الأمر وأسلوب النهي.',
          prompt: 'صنّف الجملة حسب أسلوبها.',
          items: [
            { id: 'cmd1', label: 'اقْرَأِ الكِتابَ', correctBucket: 'command' },
            { id: 'cmd2', label: 'لا تَلْعَبْ في الشَّارِعِ', correctBucket: 'prohibition' },
            { id: 'cmd3', label: 'رَتِّبْ غُرْفَتَكَ', correctBucket: 'command' },
            { id: 'cmd4', label: 'لا تُؤْذِ الحَيَوانَاتِ', correctBucket: 'prohibition' },
          ],
          buckets: [
            { id: 'command', label: 'أُسْلُوبُ أَمْرٍ', emoji: '📢' },
            { id: 'prohibition', label: 'أُسْلُوبُ نَهْيٍ', emoji: '🛑' },
          ],
        },
      },
      {
        id: 'u3-s4',
        type: 'nasheed',
        title: 'الأناشيد',
        subtitle: 'نَشِيدُ: رِياضَتِي',
        emoji: '🎵',
        color: 'from-candy-pink to-candy-grape',
        activity: {
          id: 'u3-s4-a',
          type: 'nasheed',
          title: 'رياضتي',
          instructions: 'تغنَّ بنشيد رياضي الجميل.',
          lines: [
            'رِياضِيَ الجَدِيدَةْ ... مُفِيدَةٌ نافِعَةْ',
            'جِسْمِي بِها قَوِيٌّ ... عَقْلِي بِها ذَكِيٌّ',
            'تُرَتِّبُ الأَوْقاتْ ... تُجَمِّلُ الحَياةْ',
            'تُعَلِّمُ النِّظامْ ... وتَصْنَعُ السَّلامْ',
          ],
        },
      },
    ],
  },
];
// Progress + scoring persisted to localStorage.

export interface LevelResult {
  stars: number; // 0..3
  score: number;
  completedAt: number;
}

export interface ProgressState {
  // key: `${sectionId}`
  results: Record<string, LevelResult>;
  // badges earned
  badges: string[];
  // last opened section for "continue"
  lastSectionId?: string;
}

const STORAGE_KEY = 'saeed-arabic-progress-v1';
const NAME_KEY = 'saeed-arabic-mascot-name';

const empty: ProgressState = { results: {}, badges: [] };

export function getMascotNameLocal(): string {
  try {
    return localStorage.getItem(NAME_KEY) ?? '';
  } catch {
    return '';
  }
}

export function setMascotNameLocal(name: string): void {
  try {
    localStorage.setItem(NAME_KEY, name);
  } catch {
    /* ignore */
  }
}

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...empty };
    const parsed = JSON.parse(raw) as ProgressState;
    return { ...empty, ...parsed, results: parsed.results ?? {} };
  } catch {
    return { ...empty };
  }
}

export function saveProgress(state: ProgressState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota errors */
  }
}

export function sectionKey(unitId: string, sectionId: string): string {
  return `${unitId}::${sectionId}`;
}

export function isSectionUnlocked(
  state: ProgressState,
  unitId: string,
  sectionIndex: number,
  totalSections: number,
): boolean {
  if (sectionIndex === 0) return true;
  const prevKey = `${unitId}::section-${sectionIndex}`;
  // We rely on the result key pattern; simpler: unlocked if previous section has a result
  return true; // progressive unlock handled in UI via completed-map
}

export function starsFromScore(score: number, max: number): number {
  const ratio = max > 0 ? score / max : 0;
  if (ratio >= 0.9) return 3;
  if (ratio >= 0.6) return 2;
  if (ratio >= 0.3) return 1;
  return 0;
}

export const BADGES = [
  { id: 'first-star', label: 'أول نجمة', emoji: '⭐', desc: 'حصلت على أول نجمة!' },
  { id: 'triple-gold', label: 'ثلاث ذهبيات', emoji: '🥇', desc: '3 نجوم في درس واحد!' },
  { id: 'unit-1-hero', label: 'بطل الوحدة الأولى', emoji: '🏆', desc: 'أكملت لعبة الوحدة الأولى!' },
  { id: 'unit-2-hero', label: 'بطل الوحدة الثانية', emoji: '🥇', desc: 'أكملت لعبة الوحدة الثانية!' },
  { id: 'unit-3-hero', label: 'بطل الوحدة الثالثة', emoji: '🏅', desc: 'أكملت لعبة الوحدة الثالثة!' },
  { id: 'bookworm', label: 'دودة الكتب', emoji: '📚', desc: 'أكملت 3 دروس قراءة!' },
  { id: 'singer', label: 'المُغنّي', emoji: '🎤', desc: 'أنجزت نشيدًا كاملًا!' },
];

export function maybeAwardBadges(state: ProgressState): string[] {
  const newBadges: string[] = [];
  const has = (id: string) => state.badges.includes(id);
  const results = Object.values(state.results);

  if (!has('first-star') && results.some((r) => r.stars >= 1)) {
    newBadges.push('first-star');
  }
  if (!has('triple-gold') && results.some((r) => r.stars === 3)) {
    newBadges.push('triple-gold');
  }
  const unitGameDone = (sectionId: string) => (state.results[sectionId]?.stars ?? 0) >= 1;
  if (!has('unit-1-hero') && unitGameDone('u1-s6')) newBadges.push('unit-1-hero');
  if (!has('unit-2-hero') && unitGameDone('u2-s6')) newBadges.push('unit-2-hero');
  if (!has('unit-3-hero') && unitGameDone('u3-s6')) newBadges.push('unit-3-hero');
  return newBadges;
}

export function totalScore(state: ProgressState): number {
  return Object.values(state.results).reduce((sum, r) => sum + r.score, 0);
}

export function totalStars(state: ProgressState): number {
  return Object.values(state.results).reduce((sum, r) => sum + r.stars, 0);
}

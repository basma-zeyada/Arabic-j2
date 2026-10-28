import { supabase } from './supabase';
import type { ProgressState, LevelResult } from './progress';

// Client-generated device profile id, persisted in localStorage.
const PROFILE_KEY = 'saeed-arabic-profile-id';
const NAME_KEY = 'saeed-arabic-mascot-name';

export function getProfileId(): string {
  try {
    let id = localStorage.getItem(PROFILE_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(PROFILE_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

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

// ---------- Mascot name ----------

export async function saveMascotNameRemote(profileId: string, name: string): Promise<void> {
  const { error } = await supabase
    .from('player_profiles')
    .upsert(
      { id: profileId, mascot_name: name, updated_at: new Date().toISOString() },
      { onConflict: 'id' },
    );
  if (error) throw error;
}

export async function loadMascotNameRemote(profileId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('player_profiles')
    .select('mascot_name')
    .eq('id', profileId)
    .maybeSingle();
  if (error) throw error;
  return data?.mascot_name ?? null;
}

// ---------- Lesson results ----------

export async function saveLessonResult(
  profileId: string,
  sectionId: string,
  stars: number,
  score: number,
): Promise<void> {
  const { error } = await supabase
    .from('lesson_results')
    .upsert(
      { profile_id: profileId, section_id: sectionId, stars, score, completed_at: new Date().toISOString() },
      { onConflict: 'profile_id,section_id' },
    );
  if (error) throw error;
}

export async function loadLessonResults(profileId: string): Promise<Record<string, LevelResult>> {
  const { data, error } = await supabase
    .from('lesson_results')
    .select('section_id, stars, score, completed_at')
    .eq('profile_id', profileId);
  if (error) throw error;
  const results: Record<string, LevelResult> = {};
  for (const row of data ?? []) {
    results[row.section_id] = {
      stars: row.stars,
      score: row.score,
      completedAt: new Date(row.completed_at).getTime(),
    };
  }
  return results;
}

// ---------- Badges ----------

export async function loadBadges(profileId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('player_badges')
    .select('badge_id')
    .eq('profile_id', profileId);
  if (error) throw error;
  return (data ?? []).map((r) => r.badge_id);
}

export async function addBadges(profileId: string, badgeIds: string[]): Promise<void> {
  if (badgeIds.length === 0) return;
  const rows = badgeIds.map((b) => ({
    profile_id: profileId,
    badge_id: b,
    earned_at: new Date().toISOString(),
  }));
  const { error } = await supabase
    .from('player_badges')
    .upsert(rows, { onConflict: 'profile_id,badge_id' });
  if (error) throw error;
}

export async function clearProfileData(profileId: string): Promise<void> {
  // Delete the profile row cascades to lesson_results + player_badges
  const { error } = await supabase.from('player_profiles').delete().eq('id', profileId);
  if (error) throw error;
}

// ---------- Full sync helpers ----------

export async function loadFullProgress(profileId: string): Promise<ProgressState> {
  const [results, badges] = await Promise.all([
    loadLessonResults(profileId),
    loadBadges(profileId),
  ]);
  return { results, badges };
}

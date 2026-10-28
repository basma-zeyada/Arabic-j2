import { useState, useCallback, useEffect } from 'react';
import { HomeScreen } from '@/components/HomeScreen';
import { MapScreen } from '@/components/MapScreen';
import { LessonScreen } from '@/components/LessonScreen';
import { ParentDashboard } from '@/components/ParentDashboard';
import { NameCharacterScreen } from '@/components/NameCharacterScreen';
import {
  loadProgress,
  saveProgress,
  maybeAwardBadges,
  type ProgressState,
} from '@/lib/progress';
import {
  getProfileId,
  getMascotNameLocal,
  setMascotNameLocal,
  saveMascotNameRemote,
  loadMascotNameRemote,
  saveLessonResult,
  loadFullProgress,
  addBadges,
  clearProfileData,
} from '@/lib/sync';
import { units } from '@/data/curriculum';

type Screen =
  | { name: 'name' }
  | { name: 'home' }
  | { name: 'map' }
  | { name: 'lesson'; unitId: string; sectionIndex: number }
  | { name: 'dashboard' };

export default function App() {
  const profileId = getProfileId();
  const [screen, setScreen] = useState<Screen>(() =>
    getMascotNameLocal() ? { name: 'home' } : { name: 'name' },
  );
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());
  const [mascotName, setMascotName] = useState<string>(() => getMascotNameLocal());
  const [synced, setSynced] = useState(false);

  // On mount, pull the latest progress from the database (source of truth)
  // and merge with the local cache so the app is usable offline too.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Sync mascot name from DB if it exists there but not locally
      if (!getMascotNameLocal()) {
        try {
          const remoteName = await loadMascotNameRemote(profileId);
          if (remoteName && !cancelled) {
            setMascotNameLocal(remoteName);
            setMascotName(remoteName);
            setScreen({ name: 'home' });
          }
        } catch {
          /* network error — stay on name screen */
        }
      }

      try {
        const remoteProgress = await loadFullProgress(profileId);
        if (cancelled) return;
        // Merge: DB wins for any section that has a result, local fills gaps
        const merged: ProgressState = {
          results: { ...loadProgress().results, ...remoteProgress.results },
          badges: Array.from(new Set([...loadProgress().badges, ...remoteProgress.badges])),
        };
        setProgress(merged);
        saveProgress(merged);
        setSynced(true);
      } catch {
        // Offline — keep using localStorage cache
        setSynced(true);
      }
    })();
    return () => { cancelled = true; };
  }, [profileId]);

  const updateProgress = useCallback((next: ProgressState) => {
    setProgress(next);
    saveProgress(next);
  }, []);

  const openSection = (unitId: string, sectionIndex: number) => {
    setScreen({ name: 'lesson', unitId, sectionIndex });
  };

  const finishLesson = useCallback(
    (stars: number, score: number) => {
      setScreen((curScreen) => {
        if (curScreen.name !== 'lesson') return curScreen;
        const unit = units.find((u) => u.id === curScreen.unitId)!;
        const section = unit.sections[curScreen.sectionIndex];
        const key = section.id;

        const prev = progress.results[key];
        const bestStars = Math.max(stars, prev?.stars ?? 0);
        const bestScore = Math.max(score, prev?.score ?? 0);

        const next: ProgressState = {
          ...progress,
          results: {
            ...progress.results,
            [key]: { stars: bestStars, score: bestScore, completedAt: Date.now() },
          },
          lastSectionId: key,
        };

        const newBadges = maybeAwardBadges(next);
        if (newBadges.length) {
          next.badges = [...next.badges, ...newBadges];
        }

        updateProgress(next);

        // Persist to database (fire and forget, non-blocking)
        Promise.all([
          saveLessonResult(profileId, key, bestStars, bestScore),
          addBadges(profileId, newBadges),
        ]).catch(() => {
          /* offline or error — local cache still has the data */
        });

        return { name: 'map' as const };
      });
    },
    [progress, profileId, updateProgress],
  );

  const handleNameDone = useCallback(
    (name: string) => {
      setMascotName(name);
      setMascotNameLocal(name);
      saveMascotNameRemote(profileId, name).catch(() => {
        /* offline — name saved locally, will sync next time */
      });
      setScreen({ name: 'home' });
    },
    [profileId],
  );

  const resetProgress = useCallback(() => {
    const cleared: ProgressState = { results: {}, badges: [] };
    updateProgress(cleared);
    clearProfileData(profileId).catch(() => {
      /* offline — local cleared, will retry next session */
    });
  }, [profileId, updateProgress]);

  switch (screen.name) {
    case 'name':
      return <NameCharacterScreen onDone={handleNameDone} />;
    case 'home':
      return (
        <HomeScreen
          progress={progress}
          mascotName={mascotName}
          onPlay={() => setScreen({ name: 'map' })}
          onDashboard={() => setScreen({ name: 'dashboard' })}
        />
      );
    case 'map':
      return (
        <MapScreen
          progress={progress}
          mascotName={mascotName}
          onOpenSection={openSection}
          onHome={() => setScreen({ name: 'home' })}
        />
      );
    case 'lesson':
      return (
        <LessonScreen
          unitId={screen.unitId}
          sectionIndex={screen.sectionIndex}
          progress={progress}
          onFinish={finishLesson}
          onExit={() => setScreen({ name: 'map' })}
        />
      );
    case 'dashboard':
      return (
        <ParentDashboard
          progress={progress}
          onBack={() => setScreen({ name: 'home' })}
          onReset={resetProgress}
        />
      );
  }
}

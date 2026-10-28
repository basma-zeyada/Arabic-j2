import { useState, useCallback } from 'react';
import { HomeScreen } from '@/components/HomeScreen';
import { MapScreen } from '@/components/MapScreen';
import { LessonScreen } from '@/components/LessonScreen';
import { ParentDashboard } from '@/components/ParentDashboard';
import { NameCharacterScreen } from '@/components/NameCharacterScreen';
import {
  loadProgress,
  saveProgress,
  maybeAwardBadges,
  getMascotNameLocal,
  setMascotNameLocal,
  type ProgressState,
} from '@/lib/progress';
import { units } from '@/data/curriculum';

type Screen =
  | { name: 'name' }
  | { name: 'home' }
  | { name: 'map' }
  | { name: 'lesson'; unitId: string; sectionIndex: number }
  | { name: 'dashboard' };

export default function App() {
  const [screen, setScreen] = useState<Screen>(() =>
    getMascotNameLocal() ? { name: 'home' } : { name: 'name' },
  );
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());
  const [mascotName, setMascotName] = useState<string>(() => getMascotNameLocal());

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

        return { name: 'map' as const };
      });
    },
    [progress, updateProgress],
  );

  const handleNameDone = useCallback((name: string) => {
    setMascotName(name);
    setMascotNameLocal(name);
    setScreen({ name: 'home' });
  }, []);

  const resetProgress = useCallback(() => {
    const cleared: ProgressState = { results: {}, badges: [] };
    updateProgress(cleared);
  }, [updateProgress]);

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

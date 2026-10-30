import { useCallback, useEffect, useState } from 'react';

// Voice profiles for different story characters and narration styles.
export type VoiceProfile = 'narrator' | 'girl' | 'boy' | 'woman' | 'man';

const VOICE_PARAMS: Record<VoiceProfile, { rate: number; pitch: number }> = {
  narrator: { rate: 0.82, pitch: 1.0 },
  girl: { rate: 0.9, pitch: 1.45 },
  boy: { rate: 0.92, pitch: 1.3 },
  woman: { rate: 0.85, pitch: 1.15 },
  man: { rate: 0.82, pitch: 0.8 },
};

export interface SpeechSegment {
  text: string;
  voice: VoiceProfile;
}

// Browser speech synthesis hook for Arabic (Egyptian) TTS.
export function useSpeech() {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }, []);

  const pickVoice = (profile: VoiceProfile) => {
    const voices = window.speechSynthesis.getVoices();
    // Prefer an Egyptian Arabic voice; fall back to any Arabic voice.
    const arEG = voices.find((v) => v.lang.toLowerCase().replace('_', '-') === 'ar-eg');
    const arAny = voices.find((v) => v.lang.toLowerCase().startsWith('ar'));
    return arEG ?? arAny ?? null;
  };

  const speak = useCallback(
    (text: string, opts?: { rate?: number; pitch?: number; voice?: VoiceProfile }) => {
      if (!supported || !text) return;
      try {
        window.speechSynthesis.cancel();
        const profile = opts?.voice ?? 'narrator';
        const params = VOICE_PARAMS[profile];
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'ar-EG';
        u.rate = opts?.rate ?? params.rate;
        u.pitch = opts?.pitch ?? params.pitch;
        const v = pickVoice(profile);
        if (v) u.voice = v;
        u.onstart = () => setSpeaking(true);
        u.onend = () => setSpeaking(false);
        u.onerror = () => setSpeaking(false);
        window.speechSynthesis.speak(u);
      } catch {
        setSpeaking(false);
      }
    },
    [supported],
  );

  // Speak multiple segments sequentially, each with its own voice profile.
  const speakSegments = useCallback(
    (segments: SpeechSegment[]) => {
      if (!supported || !segments.length) return;
      try {
        window.speechSynthesis.cancel();
        let idx = 0;

        const speakNext = () => {
          if (idx >= segments.length) {
            setSpeaking(false);
            return;
          }
          const seg = segments[idx];
          const params = VOICE_PARAMS[seg.voice];
          const u = new SpeechSynthesisUtterance(seg.text);
          u.lang = 'ar-EG';
          u.rate = params.rate;
          u.pitch = params.pitch;
          const v = pickVoice(seg.voice);
          if (v) u.voice = v;
          u.onend = () => {
            idx++;
            speakNext();
          };
          u.onerror = () => {
            idx++;
            speakNext();
          };
          window.speechSynthesis.speak(u);
        };

        setSpeaking(true);
        speakNext();
      } catch {
        setSpeaking(false);
      }
    },
    [supported],
  );

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  return { speak, speakSegments, stop, speaking, supported };
}

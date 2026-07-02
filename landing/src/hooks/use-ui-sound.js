import { useCallback, useRef, useEffect } from 'react';

const AUDIO_ENABLED_KEY = 'equisaas_ui_sound_enabled';

let userHasInteracted = false;
if (typeof window !== 'undefined') {
  const markInteraction = () => {
    userHasInteracted = true;
    window.removeEventListener('pointerdown', markInteraction);
    window.removeEventListener('keydown', markInteraction);
  };
  window.addEventListener('pointerdown', markInteraction, { once: true });
  window.addEventListener('keydown', markInteraction, { once: true });
}

export function useUISound() {
  const audioCtxMain = useRef(null);
  const enabled = useRef(true);

  useEffect(() => {
    // Check local storage for user preference, default to true
    try {
      const stored = localStorage.getItem(AUDIO_ENABLED_KEY);
      if (stored !== null) {
        enabled.current = stored === 'true';
      }
    } catch {}
  }, []);

  const playSynth = useCallback((type) => {
    if (!enabled.current || !userHasInteracted) return;
    
    if (!audioCtxMain.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      audioCtxMain.current = new AudioContext();
    }

    const ctx = audioCtxMain.current;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'hover') {
      // Very soft, high pitched blip
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.02, now + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.05);

      osc.start(now);
      osc.stop(now + 0.05);

    } else if (type === 'click') {
      // Satisfying gamified "pop/thump" suitable for 3D buttons
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.15, now + 0.02);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.12);

      osc.start(now);
      osc.stop(now + 0.15);
      
    } else if (type === 'success') {
      // Sparkly chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.setValueAtTime(800, now + 0.1);
      osc.frequency.setValueAtTime(1200, now + 0.2);

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.1, now + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.4);

      osc.start(now);
      osc.stop(now + 0.4);
    }
  }, []);

  const toggleSound = useCallback(() => {
    enabled.current = !enabled.current;
    try {
      localStorage.setItem(AUDIO_ENABLED_KEY, String(enabled.current));
    } catch {}
    if (enabled.current) playSynth('success');
  }, [playSynth]);

  const soundState = enabled.current;

  return {
    playHover: () => playSynth('hover'),
    playClick: () => playSynth('click'),
    playSuccess: () => playSynth('success'),
    toggleSound,
    soundState
  };
}

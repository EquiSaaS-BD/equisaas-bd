"use client";
import { useEffect, useRef } from 'react';

const ANTHEM_PLAYED_KEY = "equisaas_brand_anthem_played_v1";
const ANTHEM_SESSION_KEY = "equisaas_brand_anthem_attempted_session_v1";

export function LmsAnthem() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    try {
      if (
        localStorage.getItem(ANTHEM_PLAYED_KEY) === "true" ||
        sessionStorage.getItem(ANTHEM_SESSION_KEY) === "true"
      ) {
        initialized.current = true;
        return;
      }
    } catch {
      // Ignore storage read failures.
    }
    
    const soundEnabled = localStorage.getItem('equisaas_ui_sound_enabled') !== 'false';
    if (!soundEnabled) return;

    let audioCtx;
    let audioElement;
    let audioStarted = false;

    const markAnthemPlayed = () => {
      initialized.current = true;
      try {
        localStorage.setItem(ANTHEM_PLAYED_KEY, "true");
      } catch {
        // Ignore storage write failures.
      }
    };

    const startAudio = () => {
      if (initialized.current || audioStarted) return;

      try {
        try {
          sessionStorage.setItem(ANTHEM_SESSION_KEY, "true");
        } catch {
          // Ignore storage write failures.
        }

        if (!audioCtx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          audioCtx = new AudioContext();
        }

        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }

        audioStarted = true;
        audioElement = new Audio('/equisaas-anthem.mp3');
        audioElement.crossOrigin = "anonymous";
        audioElement.addEventListener("playing", markAnthemPlayed, { once: true });
        
        const track = audioCtx.createMediaElementSource(audioElement);

        // Add "Pleasure to the ear" effects
        // 1. Warm EQ (High Shelf to give it clarity and air)
        const eqNode = audioCtx.createBiquadFilter();
        eqNode.type = 'highshelf';
        eqNode.frequency.value = 3500;
        eqNode.gain.value = 4; // Add 4dB of pleasant highs

        // 2. Spatial widening (Subtle delay)
        const delayNode = audioCtx.createDelay();
        delayNode.delayTime.value = 0.08; // 80ms delay for thick spatial feel
        
        const delayGain = audioCtx.createGain();
        delayGain.gain.value = 0.25; // Delay volume

        // 3. Smooth Fade-in
        const masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0.85, audioCtx.currentTime + 3); // 3 sec fade in

        // Routing
        track.connect(eqNode);
        
        // Dry signal
        eqNode.connect(masterGain);
        
        // Wet signal (delay)
        eqNode.connect(delayNode);
        delayNode.connect(delayGain);
        delayGain.connect(masterGain);

        masterGain.connect(audioCtx.destination);

        const playPromise = audioElement.play();
        
        if (playPromise !== undefined) {
          playPromise.then(() => {
            markAnthemPlayed();
          }).catch(error => {
            audioStarted = false;
            console.warn('Anthem playback blocked by browser auto-play restraints.', error);
          });
        } else {
          markAnthemPlayed();
        }
      } catch (err) {
        audioStarted = false;
        console.warn('Anthem fx graph failed:', err);
      }
    };

    // To bypass strict autoplay policies effectively when navigating between apps:
    // We attach it to the first interaction if it fails, or try immediately.
    startAudio();

    const handleInteraction = () => {
      if (!initialized.current && !audioStarted) {
        startAudio();
      }
    };
    
    // In case the immediate startAudio fails due to auto-play policy, a click anywhere catches it
    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
      if (audioCtx && audioCtx.state !== 'closed') {
        audioCtx.close().catch(() => {});
      }
    };
  }, []);

  return null;
}

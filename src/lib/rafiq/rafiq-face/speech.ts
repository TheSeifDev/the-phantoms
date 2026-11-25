/**
 * Speech synchronisation for RAFIQ's SPEAKING state. RAFIQ has no mouth: speech is expressed
 * through rhythmic eye "beats" and a soft body bob. The demo calls these from SpeechSynthesis
 * events; renderers read the shared values each frame (no React state, no re-renders).
 */
const speech = { speaking: false, strength: 0, lastPulse: 0 };
const DECAY_MS = 260;

export function setRafiqSpeaking(speaking: boolean) {
  speech.speaking = speaking;
  if (!speaking) speech.strength = 0;
}

/** Call on each SpeechSynthesisUtterance `boundary` event (word/sentence) or on a fallback interval. */
export function pulseRafiqSpeech(strength = 1) {
  speech.strength = 0.55 + 0.45 * Math.max(0, Math.min(1, strength));
  speech.lastPulse = performance.now();
}

/**
 * Current speech beat (0..1). Pure read — safe to call from several renderers per frame.
 * `speaking` is true only while real speech audio is playing.
 */
export function readRafiqSpeech(now = performance.now()) {
  const age = now - speech.lastPulse;
  const beat = speech.speaking && age < DECAY_MS ? speech.strength * (1 - age / DECAY_MS) ** 2 : 0;
  return { speaking: speech.speaking, beat };
}

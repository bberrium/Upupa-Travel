/**
 * Click sound for the Upupa logo.
 *
 * Plays public/sounds/upupa-click.mp3 (a 0.8 s three-note hoopoe call).
 * If that file is missing or the browser can't play it, it falls back to a
 * synthesized version generated with Web Audio (three soft "oop" notes, a
 * whoosh and a few sparkles), so the click always makes a sound.
 *
 * To use only the synthesized sound, set SOUND_FILE = null.
 */
const SOUND_FILE = "sounds/upupa-click.mp3";
// Browsers (and GitHub Pages) keep audio files cached for a long time. If you
// ever replace public/sounds/upupa-click.mp3 with a different recording, add 1
// to this number so every visitor downloads the new one.
const SOUND_VERSION = 2;
const VOLUME = 0.55; // 0..1 master volume. The sound is already quiet.

let ctx = null;

function getContext() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

/** Schedules the whole sound on any AudioContext (live or offline). */
export function scheduleUpupaSound(ac, destination, t0 = 0) {
  const master = ac.createGain();
  master.gain.value = VOLUME;
  master.connect(destination);

  // 1) Three soft hoopoe "oop" notes: a low round tone that dips slightly.
  [0.04, 0.3, 0.56].forEach((at, i) => {
    const t = t0 + at;
    const f = 470 - i * 6;
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.5, t + 0.018);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.19);
    const lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1400;
    g.connect(lp).connect(master);
    for (const [mult, level] of [[1, 1], [2, 0.22], [3, 0.06]]) {
      const o = ac.createOscillator();
      o.type = "sine";
      o.frequency.setValueAtTime(f * mult * 1.04, t);
      o.frequency.exponentialRampToValueAtTime(f * mult * 0.94, t + 0.17);
      const og = ac.createGain();
      og.gain.value = level;
      o.connect(og).connect(g);
      o.start(t);
      o.stop(t + 0.22);
    }
  });

  // 2) Airy whoosh that swells as the feathers fan out and fades as they settle.
  const len = Math.ceil(ac.sampleRate * 1.2);
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const noise = ac.createBufferSource();
  noise.buffer = buf;
  const bp = ac.createBiquadFilter();
  bp.type = "bandpass";
  bp.Q.value = 0.9;
  bp.frequency.setValueAtTime(700, t0);
  bp.frequency.exponentialRampToValueAtTime(2600, t0 + 0.55);
  bp.frequency.exponentialRampToValueAtTime(1100, t0 + 1.1);
  const wg = ac.createGain();
  wg.gain.setValueAtTime(0.0001, t0);
  wg.gain.exponentialRampToValueAtTime(0.16, t0 + 0.5);
  wg.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.1);
  noise.connect(bp).connect(wg).connect(master);
  noise.start(t0);
  noise.stop(t0 + 1.15);

  // 3) A few tiny sparkles at the peak of the fan-out.
  [[0.5, 1760], [0.58, 2349], [0.66, 2794], [0.73, 2093]].forEach(([at, hz]) => {
    const t = t0 + at;
    const o = ac.createOscillator();
    o.type = "sine";
    o.frequency.value = hz;
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.07, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
    o.connect(g).connect(master);
    o.start(t);
    o.stop(t + 0.22);
  });
}

let audio = null;
let fileBroken = false;

function getAudio() {
  if (!SOUND_FILE || fileBroken || typeof Audio === "undefined") return null;
  if (!audio) {
    const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");
    audio = new Audio(`${base}${SOUND_FILE}?v=${SOUND_VERSION}`);
    audio.preload = "auto"; // it is only ~10 KB
    audio.volume = VOLUME;
    audio.addEventListener("error", () => { fileBroken = true; });
  }
  return audio;
}

function playSynth() {
  const ac = getContext();
  if (ac) scheduleUpupaSound(ac, ac.destination, ac.currentTime + 0.02);
}

/** Call this from a click handler (browsers only allow sound after a click). */
export function playUpupaSound() {
  try {
    const a = getAudio();
    if (a) {
      a.currentTime = 0;
      const p = a.play();
      if (p && p.catch) p.catch(() => { fileBroken = true; playSynth(); });
      return;
    }
    playSynth();
  } catch {
    /* sound is a bonus: never let it break the click */
  }
}

// Start loading the file as soon as the page is ready, so the first click is instant.
if (typeof window !== "undefined") {
  window.addEventListener("load", () => { try { getAudio(); } catch {} }, { once: true });
}
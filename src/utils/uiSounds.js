const SOUND_ENABLED_KEY = 'portfolio-sound-enabled';

let audioContext;
let lastToneTime = 0;
let sessionEnabled;
const toneProfiles = {
  hover: { duration: 0.085, from: 820, to: 650, peak: 0.1 },
  control: { duration: 0.115, from: 680, to: 500, peak: 0.12 },
  navigation: { duration: 0.14, from: 640, to: 470, peak: 0.14 },
};

export function getUiSoundEnabled() {
  if (typeof sessionEnabled === 'boolean') return sessionEnabled;

  try {
    return typeof window !== 'undefined' && window.localStorage.getItem(SOUND_ENABLED_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setUiSoundEnabled(enabled) {
  sessionEnabled = enabled;
  try {
    window.localStorage.setItem(SOUND_ENABLED_KEY, String(enabled));
  } catch {
    // Sound remains usable for this session when storage is unavailable.
  }

  if (enabled) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    try {
      audioContext ??= new AudioContextClass();
      if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
    } catch {
      // Browsers without Web Audio keep the control usable without sound.
    }
  } else if (audioContext?.state === 'running') {
    audioContext.suspend().catch(() => {});
  }
}

export function playUiTone(kind = 'navigation') {
  if (!getUiSoundEnabled() || document.visibilityState === 'hidden') return;

  const now = performance.now();
  if (now - lastToneTime < 145) return;
  lastToneTime = now;

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  try {
    audioContext ??= new AudioContextClass();
  } catch {
    return;
  }

  const playTone = () => {
    if (!getUiSoundEnabled() || document.visibilityState === 'hidden') return;

    const profile = toneProfiles[kind] ?? toneProfiles.navigation;
    const oscillator = audioContext.createOscillator();
    const volume = audioContext.createGain();
    const start = audioContext.currentTime;
    const end = start + profile.duration;

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(profile.from, start);
    oscillator.frequency.exponentialRampToValueAtTime(profile.to, end);
    volume.gain.setValueAtTime(0.0001, start);
    volume.gain.exponentialRampToValueAtTime(profile.peak, start + 0.012);
    volume.gain.exponentialRampToValueAtTime(0.0001, end);
    oscillator.connect(volume);
    volume.connect(audioContext.destination);
    oscillator.start(start);
    oscillator.stop(end + 0.01);
  };

  if (audioContext.state === 'suspended') {
    audioContext.resume().then(playTone).catch(() => {});
  } else {
    playTone();
  }
}

export function playNavigationTone() {
  playUiTone('navigation');
}

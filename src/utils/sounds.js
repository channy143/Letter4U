let ctx = null;

function getCtx() {
  try {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  } catch (e) {
    return null;
  }
}

function noiseBurst(c, start, dur, vol, freq, q) {
  const buffer = c.createBuffer(1, Math.max(1, Math.floor(c.sampleRate * dur)), c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }
  const src = c.createBufferSource();
  src.buffer = buffer;
  const filter = c.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = freq;
  filter.Q.value = q;
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(vol, start + dur * 0.12);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(c.destination);
  src.start(start);
  return src;
}

export function playPaper() {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  noiseBurst(c, t, 0.4, 0.22, 1100 + Math.random() * 500, 0.7);
  noiseBurst(c, t + 0.18, 0.3, 0.12, 700 + Math.random() * 300, 0.9);
}

export function playThud() {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  const osc = c.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(120, t);
  osc.frequency.exponentialRampToValueAtTime(45, t + 0.22);
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.4, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(t);
  osc.stop(t + 0.32);
  noiseBurst(c, t, 0.12, 0.1, 500, 0.5);
}

export function playFlowerFall() {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  noiseBurst(c, t, 0.5, 0.08, 900, 0.6);
}

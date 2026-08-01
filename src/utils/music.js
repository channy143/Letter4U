let finaleAudio = null;

export function getFinaleAudio() {
  if (!finaleAudio) {
    finaleAudio = new Audio('/music/Musika.mp3');
    finaleAudio.loop = true;
    finaleAudio.preload = 'auto';
  }
  return finaleAudio;
}

export function startFinaleMusic(volume = 0.7) {
  const a = getFinaleAudio();
  a.volume = volume;
  if (a.paused) {
    a.play().catch(() => {});
  }
}

export function stopFinaleMusic() {
  if (finaleAudio) {
    finaleAudio.pause();
    finaleAudio.currentTime = 0;
  }
}

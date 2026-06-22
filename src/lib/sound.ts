// lib/sound.ts
import { Howl } from "howler";

const orderSound = new Howl({
  src: ["/sound/audio.wav"],
  volume: 0.8,
  preload: true, // ✅ loads the file immediately
});

export const playOrderSound = () => orderSound.play();

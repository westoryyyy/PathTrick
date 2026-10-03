class AudioController {
  private sounds: Record<string, HTMLAudioElement> = {};

  preload(src: string) {
    if (typeof window !== 'undefined' && !this.sounds[src]) {
      const audio = new Audio(src);
      audio.volume = 0.5;
      audio.load();
      this.sounds[src] = audio;
    }
  }

  play(src: string, volume: number = 0.5) {
    if (typeof window !== 'undefined') {
      let audio = this.sounds[src];
      if (!audio) {
        audio = new Audio(src);
        this.sounds[src] = audio;
      }
      audio.volume = volume;
      audio.currentTime = 0;
      audio.play().catch((e) => console.warn('Audio play failed:', e));
    }
  }
}

export const audioController = new AudioController();

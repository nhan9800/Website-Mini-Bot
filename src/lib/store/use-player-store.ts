import { create } from 'zustand';

interface Track {
  title: string;
  artist: string;
  cover: string;
  url: string;
}

interface PlayerStore {
  track: Track | null;
  isPlaying: boolean;
  playTrack: (track: Track) => void;
  setIsPlaying: (playing: boolean) => void;
  stop: () => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  track: null,
  isPlaying: false,
  playTrack: (track) => set({ track, isPlaying: true }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  stop: () => set({ track: null, isPlaying: false }),
}));

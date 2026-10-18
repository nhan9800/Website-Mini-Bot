import { create } from 'zustand';

interface Track {
  title: string;
  artist: string;
  cover: string;
  url: string;
}

type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

interface PlayerStore {
  track: Track | null;
  isPlaying: boolean;
  playbackStatus: PlaybackStatus;
  playTrack: (track: Track) => void;
  setIsPlaying: (playing: boolean) => void;
  setPlaybackStatus: (status: PlaybackStatus) => void;
  stop: () => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  track: null,
  isPlaying: false,
  playbackStatus: 'idle',
  playTrack: (track) => set({ track, isPlaying: true, playbackStatus: 'loading' }),
  setIsPlaying: (playing) => set({ isPlaying: playing, playbackStatus: playing ? 'loading' : 'paused' }),
  setPlaybackStatus: (playbackStatus) => set({ playbackStatus }),
  stop: () => set({ track: null, isPlaying: false, playbackStatus: 'idle' }),
}));

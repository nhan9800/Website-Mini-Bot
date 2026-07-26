export interface GuildInfo {
  id: string;
  name: string;
  icon: string | null;
  memberCount: number;
  inGuild: boolean;
  userPermissions?: string;
}

export interface PlayerTrack {
  title: string;
  author: string;
  url: string;
  duration: number; // in seconds
  thumbnail?: string;
  requestedBy?: string;
}

export interface PlayerState {
  connected: boolean;
  voiceChannel?: string;
  currentTrack: PlayerTrack | null;
  queue: PlayerTrack[];
  position: number; // in seconds
  volume: number;
  paused: boolean;
  loopMode: 'off' | 'track' | 'queue';
}

export interface BotStatus {
  online: boolean;
  uptime: number; // seconds
  ping: number; // ms
  guildsCount: number;
  activeVoiceConnections: number;
  memoryUsageMB: number;
  nodeVersion: string;
}

export interface CommandItem {
  name: string;
  category: 'music' | 'verification' | 'attendance' | 'economy' | 'system';
  description: string;
  usage: string;
  aliases?: string[];
  slashCommand: boolean;
}

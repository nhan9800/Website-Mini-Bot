/**
 * Kiểu dữ liệu KHỚP CHÍNH XÁC với payload mà Internal API của bot trả về
 * (xem internalApi.js — publicPlayerState / publicTrack / /internal/status).
 */

/** GET /internal/status */
export interface BotStatus {
  ok: boolean;
  online: boolean;
  clientId: string | null;
  guildCount: number;
  reachableUsers: number;
  activeVoiceSessions: number;
  wsPing: number;
  uptimeSeconds: number;
  updatedAt: string;
}

/** publicTrack() trong internalApi.js */
export interface ApiTrack {
  title: string;
  author: string | null;
  uri: string | null;
  artworkUrl: string | null;
  durationMs: number;
  isStream: boolean;
  requestedBy: { id?: string; username: string; avatarUrl?: string } | null;
}

/** publicPlayerState() trong internalApi.js */
export interface PlayerState {
  guildId: string;
  connected: boolean;
  voiceChannelId?: string | null;
  textChannelId?: string | null;
  track: ApiTrack | null;
  queue: ApiTrack[];
  positionMs: number;
  paused: boolean;
  volume: number; // 0–150 (%)
  repeatMode: 'off' | 'track' | 'queue';
  autoplay: boolean;
  updatedAt: string;
}

/** GET /internal/guilds/:id/settings */
export interface GuildSettingsResponse {
  ok: boolean;
  guild: {
    id: string;
    name: string;
    iconUrl: string | null;
    memberCount: number;
  };
  settings: {
    prefix: string;
    unverifyOnMute: boolean;
    verifyDailyMode: boolean;
    isSetupCompleted: boolean;
    isVerifySetup: boolean;
    isTtsSetup: boolean;
    isVoiceRoomSetup: boolean;
  };
}

/** GET /internal/commands */
export interface ApiCommand {
  name: string;
  description: string;
  options: { name: string; description: string; type: number; required: boolean }[];
  defaultMemberPermissions: string | null;
}

/** Lỗi chuẩn hóa từ proxy API của web */
export interface ApiErrorBody {
  ok: false;
  error: { code: string; message: string };
  apiBase?: string;
}

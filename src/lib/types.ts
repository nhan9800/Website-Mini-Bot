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

/** GET /internal/guilds/:id/stats — số liệu tổng hợp của đúng server. */
export interface GuildStatsResponse {
  ok: boolean;
  stats: {
    guild: {
      id: string;
      name: string;
      iconUrl: string | null;
      memberCount: number;
      boostCount: number;
    };
    members: { total: number; humans: number | null; bots: number | null; online: number | null };
    channels: { total: number; text: number; voice: number; category: number } | null;
    roles: number | null;
    music: { connected: boolean; queueCount: number; hasTrack: boolean; voiceChannelId: string | null };
    features: {
      setup: boolean;
      verify: boolean;
      ticket: boolean;
      feedback: boolean;
      levelChat: boolean;
      levelVoice: boolean;
      music: boolean;
    };
    levels: { chatUsers: number; voiceUsers: number; monthlyChat: boolean; monthlyVoice: boolean };
    invites: { eventEnabled: boolean; trackedMembers: number; eventMembers: number };
    updatedAt: string;
  };
}

/** Một server bot đang phục vụ, dùng cho trang Cộng đồng/Trạng thái. */
export interface CommunitySummary {
  id: string;
  name: string;
  iconUrl: string | null;
  memberCount: number;
  boostCount: number;
  owner: { id: string; username: string | null; displayName: string | null; avatarUrl: string | null } | null;
  onlineCount: number | null;
  features: { music: boolean; ticket: boolean; level: boolean };
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

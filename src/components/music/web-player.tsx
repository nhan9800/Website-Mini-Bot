"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Music, X } from "lucide-react";
import { usePlayerStore } from "@/lib/store/use-player-store";

function timeLabel(seconds: number) {
  const safe = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, "0")}`;
}

/** Trình nghe thử bài hát trên website; độc lập với nhạc đang phát trong Discord. */
export function WebPlayer() {
  const { track, isPlaying, setIsPlaying, stop } = usePlayerStore();
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackError, setPlaybackError] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const reducedMotion = useReducedMotion();
  const animateMotion = reducedMotion === false;

  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setPlaybackError("");
  }, [track]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    let cancelled = false;
    if (track && isPlaying) {
      setPlaybackError("");
      audio.play().catch(() => {
        if (cancelled) return;
        setPlaybackError("Chưa phát được bản nghe thử. Hãy bấm phát để thử lại.");
        setIsPlaying(false);
      });
    } else audio.pause();
    return () => { cancelled = true; };
  }, [isPlaying, track, setIsPlaying]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = isMuted;
    audioRef.current.volume = volume;
  }, [isMuted, volume]);

  const syncTime = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(Number.isFinite(audio.currentTime) ? Math.max(0, audio.currentTime) : 0);
    setDuration(Number.isFinite(audio.duration) ? Math.max(0, audio.duration) : 0);
  };

  const seek = (seconds: number) => {
    if (!audioRef.current || duration <= 0 || !Number.isFinite(seconds)) return;
    const nextTime = Math.min(duration, Math.max(0, seconds));
    try {
      audioRef.current.currentTime = nextTime;
      setCurrentTime(nextTime);
    } catch { setPlaybackError("Bản nghe thử này chưa hỗ trợ tua đến vị trí đã chọn."); }
  };

  return (
    <>
      <audio ref={audioRef} src={track?.url?.trim() || undefined} preload="none"
        onTimeUpdate={syncTime} onLoadedMetadata={syncTime} onDurationChange={syncTime}
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          if (!track) return;
          setPlaybackError("Không tải được bản nghe thử từ nguồn bài hát.");
          setIsPlaying(false);
        }} />
      <AnimatePresence>
        {track && (
          <motion.div initial={animateMotion ? { y: 30, opacity: 0 } : false} animate={{ y: 0, opacity: 1 }}
            exit={animateMotion ? { y: 30, opacity: 0 } : { opacity: 1 }} transition={{ duration: animateMotion ? 0.2 : 0 }}
            className="fixed bottom-20 left-1/2 z-50 w-[calc(100%_-_24px)] max-w-2xl sm:bottom-6"
            style={{ x: "-50%" }}
            aria-label="Trình nghe thử nhạc trên website">
            <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-surface p-3 shadow-xl sm:gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-background sm:h-14 sm:w-14" aria-hidden="true">
                {track.cover?.trim() ? <motion.img src={track.cover.trim()} alt="" className="h-full w-full rounded-full object-cover"
                  animate={{ rotate: animateMotion && isPlaying ? 360 : 0 }} transition={{ repeat: animateMotion && isPlaying ? Infinity : 0, duration: animateMotion ? 8 : 0, ease: "linear" }} /> : <Music className="h-6 w-6 text-mimi-green" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-500">Nghe thử trên website</p>
                <h3 title={track.title} className="truncate text-sm font-semibold text-white">{track.title}</h3>
                <p className="truncate text-xs text-gray-400">{track.artist}</p>
                <input type="range" aria-label="Vị trí nghe thử" min={0} max={duration || 1} step={0.1}
                  value={Math.min(currentTime, duration || 0)} disabled={duration <= 0}
                  onChange={(event) => seek(Number(event.target.value))}
                  className="mt-2 block h-1 w-full cursor-pointer accent-emerald-500 disabled:cursor-default" />
                <p className="mt-1 text-[9px] text-gray-500">{timeLabel(currentTime)} / {timeLabel(duration)}</p>
                {playbackError && <p role="status" className="mt-1 text-[10px] text-gray-400">{playbackError}</p>}
              </div>
              <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                <button type="button" aria-label={isPlaying ? "Tạm dừng nghe thử" : "Phát bản nghe thử"}
                  onClick={() => setIsPlaying(!isPlaying)} className="flex h-10 w-10 items-center justify-center rounded-full bg-mimi-green text-[#071510]">
                  {isPlaying ? <Pause size={19} /> : <Play size={19} />}
                </button>
                <div className="hidden items-center gap-1 sm:flex">
                  <button type="button" aria-label={isMuted ? "Bật tiếng nghe thử" : "Tắt tiếng nghe thử"}
                    onClick={() => setIsMuted(!isMuted)} className="rounded-lg p-2 text-gray-400 hover:text-white">
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                  <input type="range" aria-label="Âm lượng nghe thử" min={0} max={1} step={0.01} value={volume}
                    onChange={(event) => { const nextVolume = Number(event.target.value); setVolume(nextVolume); setIsMuted(nextVolume === 0); }}
                    className="h-1 w-16 cursor-pointer accent-emerald-500" />
                </div>
                <button type="button" onClick={stop} aria-label="Đóng trình nghe thử" className="rounded-lg p-2 text-gray-400 hover:text-white"><X size={17} /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

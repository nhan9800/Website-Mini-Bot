"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from "lucide-react";
import { usePlayerStore } from "@/lib/store/use-player-store";

export function WebPlayer() {
  const { track, isPlaying, setIsPlaying, stop } = usePlayerStore();
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Reset progress when track changes
    setProgress(0);
  }, [track]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setProgress((current / total) * 100);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={track?.url || ""}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />
      <AnimatePresence>
        {track ? (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative group overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_0_40px_rgba(30,215,96,0.15)] p-3 flex items-center gap-4">
              
              {/* Animated Glow Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-cyan-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* Vinyl Record */}
              <div className="relative z-10 w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)] shrink-0 bg-zinc-900 flex items-center justify-center">
                <motion.img 
                  src={track.cover} 
                  alt="Cover" 
                  className="w-14 h-14 rounded-full object-cover"
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                />
                {/* Center hole */}
                <div className="absolute w-3 h-3 bg-zinc-900 rounded-full border border-white/20" />
              </div>

              {/* Track Info */}
              <div className="relative z-10 flex-1 min-w-0">
                <motion.h3 
                  className="text-white font-bold truncate text-sm sm:text-base drop-shadow-md"
                  animate={{ x: isHovered && track.title.length > 20 ? -50 : 0 }}
                  transition={{ duration: 4, repeat: Infinity, repeatType: "mirror" }}
                >
                  {track.title}
                </motion.h3>
                <p className="text-zinc-400 text-xs sm:text-sm truncate">
                  {track.artist}
                </p>
                
                {/* Progress Bar */}
                <div className="mt-2 h-1.5 w-full bg-white/10 rounded-full overflow-hidden cursor-pointer group/progress">
                  <motion.div 
                    className="h-full bg-emerald-400 group-hover/progress:bg-emerald-300 transition-colors shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="relative z-10 flex items-center gap-2 sm:gap-4 shrink-0 pr-2">
                <button className="text-zinc-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full hidden sm:block">
                  <SkipBack className="w-5 h-5 fill-current" />
                </button>
                
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 flex items-center justify-center bg-white text-black hover:scale-105 active:scale-95 transition-all rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-current" />
                  ) : (
                    <Play className="w-6 h-6 fill-current ml-1" />
                  )}
                </button>

                <button className="text-zinc-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full hidden sm:block">
                  <SkipForward className="w-5 h-5 fill-current" />
                </button>

                <div className="w-px h-8 bg-white/10 mx-1 hidden sm:block" />

                <div className="hidden sm:flex items-center gap-1">
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-zinc-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  
                  <div className="w-20 flex items-center">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      defaultValue="1"
                      onChange={(e) => {
                        if (audioRef.current) {
                          const val = parseFloat(e.target.value);
                          audioRef.current.volume = val;
                          if (val > 0 && isMuted) setIsMuted(false);
                          if (val === 0 && !isMuted) setIsMuted(true);
                        }
                      }}
                      className="w-16 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

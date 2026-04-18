'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function AudioToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const audio = new Audio('/naadha.mp3');
    audio.loop = true;
    audio.volume = 0.45;
    audio.addEventListener('canplaythrough', () => setIsReady(true));
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        // autoplay blocked
      }
    }
  };

  return (
    <motion.button
      id="audio-toggle"
      aria-label={isPlaying ? 'Mute background music' : 'Play background music'}
      onClick={toggle}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
      style={{
        background: 'rgba(20, 8, 0, 0.85)',
        border: '1px solid rgba(245,200,66,0.3)',
        color: '#fde68a',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        fontFamily: 'var(--font-cinzel)',
      }}
      whileHover={{ scale: 1.05, borderColor: 'rgba(245,200,66,0.7)' }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Animated music bars when playing */}
      {isPlaying ? (
        <div className="flex items-end gap-0.5 h-4">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              style={{ width: '3px', background: '#f5c842', borderRadius: '2px' }}
              animate={{ height: ['6px', '16px', '4px', '12px', '6px'] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }}
            />
          ))}
        </div>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f5c842" strokeWidth="2" strokeLinecap="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
      <span className="text-xs">
        {!isReady ? 'Loading…' : isPlaying ? 'Naadha' : 'Play Music'}
      </span>
    </motion.button>
  );
}

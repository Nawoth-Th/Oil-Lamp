'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface FlameProps {
  isLit: boolean;
}

export default function Flame({ isLit }: FlameProps) {
  return (
    <AnimatePresence>
      {isLit && (
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none origin-bottom flex flex-col justify-end items-center"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          exit={{ scaleY: 0, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Outer glow */}
          <div
            className="absolute bottom-0 rounded-full"
            style={{
              width: '28px',
              height: '40px',
              background: 'radial-gradient(ellipse, rgba(249,115,22,0.5) 0%, transparent 70%)',
              filter: 'blur(6px)',
              animation: 'glowPulse 1.5s ease-in-out infinite',
            }}
          />
          {/* Main flame SVG */}
          <motion.svg
            width="22"
            height="38"
            viewBox="0 0 22 38"
            fill="none"
            className="relative"
            style={{
              animation: 'flicker 0.8s ease-in-out infinite',
              filter: 'drop-shadow(0 0 6px #fbbf24) drop-shadow(0 0 12px #f97316)',
            }}
          >
            {/* Flame body */}
            <path
              d="M11 37 C5 32, 1 26, 2 19 C3 13, 7 9, 9 5 C9.5 3, 10 1, 11 0 C12 1, 12.5 3, 13 5 C15 9, 19 13, 20 19 C21 26, 17 32, 11 37Z"
              fill="url(#flameGrad)"
            />
            {/* Inner bright core */}
            <path
              d="M11 32 C8 28, 6 24, 7 19 C8 15, 10 12, 11 9 C12 12, 14 15, 15 19 C16 24, 14 28, 11 32Z"
              fill="url(#coreGrad)"
            />
            <defs>
              <radialGradient id="flameGrad" cx="50%" cy="70%" r="50%">
                <stop offset="0%" stopColor="#fffde7" />
                <stop offset="40%" stopColor="#fbbf24" />
                <stop offset="80%" stopColor="#f97316" />
                <stop offset="100%" stopColor="rgba(239,68,68,0)" />
              </radialGradient>
              <radialGradient id="coreGrad" cx="50%" cy="60%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="60%" stopColor="#fffde7" />
                <stop offset="100%" stopColor="rgba(251,191,36,0)" />
              </radialGradient>
            </defs>
          </motion.svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

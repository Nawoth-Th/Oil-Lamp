'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  lit: number;
  total: number;
}

export default function ProgressBar({ lit, total }: ProgressBarProps) {
  const pct = total > 0 ? (lit / total) * 100 : 0;

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-xs">
      {/* Count label */}
      <div
        className="flex items-center gap-2 text-sm"
        style={{ color: '#fde68a', fontFamily: 'var(--font-cinzel)', letterSpacing: '0.06em' }}
      >
        <span style={{ color: '#f5c842', fontSize: '16px' }}>🔥</span>
        <span>
          <span style={{ color: '#f5c842', fontWeight: 700, fontSize: '18px' }}>{lit}</span>
          <span style={{ color: 'rgba(253,230,138,0.5)' }}> / {total} wicks lit</span>
        </span>
      </div>

      {/* Bar track */}
      <div
        className="relative w-full rounded-full overflow-hidden"
        style={{
          height: '8px',
          background: 'rgba(245,200,66,0.1)',
          border: '1px solid rgba(245,200,66,0.2)',
        }}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: 'linear-gradient(90deg, #d97706 0%, #f5c842 50%, #fde68a 100%)',
            boxShadow: '0 0 8px rgba(245,200,66,0.6)',
          }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />

        {/* Shimmer overlay */}
        {lit > 0 && (
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
            }}
            animate={{ backgroundPosition: ['-200% center', '200% center'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </div>

      {/* Wick dots indicator */}
      <div className="flex gap-2 mt-1">
        {Array.from({ length: total }).map((_, i) => (
          <motion.div
            key={i}
            className="rounded-full"
            style={{
              width: '8px',
              height: '8px',
              background: i < lit ? '#f5c842' : 'rgba(245,200,66,0.15)',
              boxShadow: i < lit ? '0 0 6px #f5c842' : 'none',
              border: '1px solid rgba(245,200,66,0.3)',
            }}
            animate={i < lit ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.4 }}
          />
        ))}
      </div>
    </div>
  );
}

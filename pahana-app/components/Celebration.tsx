'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface CelebrationProps {
  show: boolean;
}

export default function Celebration({ show }: CelebrationProps) {
  const hasRun = useRef(false);

  useEffect(() => {
    if (show && !hasRun.current) {
      hasRun.current = true;

      // Gold confetti burst
      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...opts,
          origin: { y: 0.6 },
          particleCount: Math.floor(200 * particleRatio),
          colors: ['#f5c842', '#fde68a', '#ea580c', '#dc2626', '#ffffff'],
        });
      };

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2,  { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1,  { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1,  { spread: 120, startVelocity: 45 });

      // Second wave
      setTimeout(() => {
        fire(0.3, { spread: 80, startVelocity: 40 });
        fire(0.2, { spread: 150 });
      }, 800);
    }

    if (!show) {
      hasRun.current = false;
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Radial celebration glow */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(245,200,66,0.15) 0%, transparent 60%)',
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Message card */}
          <motion.div
            className="relative text-center px-10 py-8 rounded-3xl"
            style={{
              background: 'linear-gradient(135deg, rgba(30,10,0,0.95) 0%, rgba(60,20,0,0.9) 100%)',
              border: '2px solid rgba(245,200,66,0.6)',
              boxShadow: '0 0 60px rgba(245,200,66,0.4), 0 0 120px rgba(234,88,12,0.2), inset 0 0 40px rgba(245,200,66,0.05)',
              backdropFilter: 'blur(20px)',
            }}
            initial={{ scale: 0.6, y: 60, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.175, 0.885, 0.32, 1.275] }}
          >
            {/* Decorative top line */}
            <div className="flex items-center gap-3 justify-center mb-4">
              <div style={{ height: '1px', width: '40px', background: 'linear-gradient(to right, transparent, #f5c842)' }} />
              <span style={{ fontSize: '24px' }}>🪔</span>
              <div style={{ height: '1px', width: '40px', background: 'linear-gradient(to left, transparent, #f5c842)' }} />
            </div>

            {/* Sinhala new year message */}
            <motion.p
              className="text-4xl font-bold mb-2 leading-tight"
              style={{
                fontFamily: 'var(--font-sinhala), serif',
                background: 'linear-gradient(135deg, #f5c842 0%, #fde68a 50%, #f5c842 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: 'none',
              }}
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              සුබ අලුත් අවුරුද්දක් වේවා !
            </motion.p>

            <div className="mt-4 text-sm" style={{ color: 'rgba(245,200,66,0.6)', fontFamily: 'var(--font-cinzel)' }}>
              All wicks are lit with blessings — the ceremony is complete.
            </div>

            {/* Decorative bottom line */}
            <div className="flex items-center gap-3 justify-center mt-4">
              <div style={{ height: '1px', width: '40px', background: 'linear-gradient(to right, transparent, #f5c842)' }} />
              <span style={{ fontSize: '16px' }}>✦</span>
              <div style={{ height: '1px', width: '40px', background: 'linear-gradient(to left, transparent, #f5c842)' }} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

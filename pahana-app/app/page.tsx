'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import OilLamp from '@/components/OilLamp';
import Celebration from '@/components/Celebration';
import AudioToggle from '@/components/AudioToggle';
import ProgressBar from '@/components/ProgressBar';
import { useLampState } from '@/hooks/useLampState';

const TOTAL_WICKS = 7;

// Countdown target: Sinhala New Year — April 13, 2026 at 6:17 AM
const TARGET_DATE = new Date('2026-04-13T06:17:00+05:30');

function useCountdown(target: Date) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0, past: false });

  useEffect(() => {
    const calc = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0, past: true });
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ d, h, m, s, past: false });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [target]);

  return timeLeft;
}

export default function Home() {
  const { litWicks, lightWick, resetWicks, isConnected } = useLampState(TOTAL_WICKS);
  const allLit = litWicks.size === TOTAL_WICKS;
  const countdown = useCountdown(TARGET_DATE);
  const [lighting, setLighting] = useState(false);

  const handleWickClick = useCallback((id: number) => {
    if (!litWicks.has(id)) {
      lightWick(id);
    }
  }, [litWicks, lightWick]);

  // Light all wicks sequentially
  const lightAll = useCallback(async () => {
    if (lighting || allLit) return;
    setLighting(true);
    for (let i = 0; i < TOTAL_WICKS; i++) {
      if (!litWicks.has(i)) {
        lightWick(i);
        await new Promise(r => setTimeout(r, 350));
      }
    }
    setLighting(false);
  }, [lighting, allLit, litWicks, lightWick]);

  return (
    <main className="relative min-h-screen flex flex-col items-center overflow-hidden">
      {/* Animated background */}
      <div className="bg-mandala" />
      <div className="bg-pattern" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full px-4 py-8">

        {/* ── Header ── */}
        <motion.header
          className="flex flex-col items-center gap-1 mb-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Decorative divider */}
          <div className="flex items-center gap-3 justify-center mb-2">
            <div style={{ height: '1px', width: '100px', background: 'linear-gradient(to right, transparent, rgba(245,200,66,0.6))' }} />
            <span className="text-2xl">☀️</span>
            <div style={{ height: '1px', width: '100px', background: 'linear-gradient(to left, transparent, rgba(245,200,66,0.6))' }} />
          </div>

          {/* Row 1 — Sinhala title (pahana-sarani sinhala nakshalawa) */}
          <Image
            src="/header-01.png"
            alt="පහසරණී සිංහල නක්ෂලාව"
            width={700}
            height={120}
            priority
            style={{
              width: 'min(700px, 92vw)',
              height: 'auto',
              mixBlendMode: 'lighten',
            }}
          />
          {/* Row 2 — Awrudu year (awrudu asiri 2026) */}
          <Image
            src="/header-02.png"
            alt="අවුරුදු අසිරි - 2026"
            width={700}
            height={120}
            priority
            style={{
              width: 'min(700px, 92vw)',
              height: 'auto',
              mixBlendMode: 'lighten',
              marginTop: '-8px',
            }}
          />
        </motion.header>

        {/* ── Countdown ── */}
        <AnimatePresence>
          {!countdown.past && (
            <motion.div
              className="flex gap-3 sm:gap-5 mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {[
                { label: 'Days', value: countdown.d },
                { label: 'Hours', value: countdown.h },
                { label: 'Min', value: countdown.m },
                { label: 'Sec', value: countdown.s },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex flex-col items-center px-3 py-2 rounded-xl"
                  style={{
                    background: 'rgba(20,8,0,0.7)',
                    border: '1px solid rgba(245,200,66,0.25)',
                    backdropFilter: 'blur(8px)',
                    minWidth: '64px',
                  }}
                >
                  <span
                    className="text-2xl sm:text-3xl font-bold tabular-nums"
                    style={{ color: '#f5c842', fontFamily: 'var(--font-cinzel)' }}
                  >
                    {String(value).padStart(2, '0')}
                  </span>
                  <span
                    className="text-xs mt-0.5"
                    style={{ color: 'rgba(253,230,138,0.5)', letterSpacing: '0.08em' }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Lamp ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
        >
          <OilLamp
            litWicks={litWicks}
            onWickClick={handleWickClick}
            allLit={allLit}
          />
        </motion.div>

        {/* ── Progress ── */}
        <motion.div
          className="mt-8 flex flex-col items-center gap-4 w-full max-w-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <ProgressBar lit={litWicks.size} total={TOTAL_WICKS} />

          {/* Controls */}
          <div className="flex gap-3 mt-2 flex-wrap justify-center">

            {/* Reset button */}
            <motion.button
              id="reset-btn"
              onClick={resetWicks}
              className="px-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              style={{
                background: 'rgba(20,8,0,0.7)',
                color: 'rgba(253,230,138,0.5)',
                border: '1px solid rgba(245,200,66,0.15)',
                fontFamily: 'var(--font-cinzel)',
              }}
              whileHover={{ scale: 1.03, color: 'rgba(253,230,138,0.8)' }}
              whileTap={{ scale: 0.97 }}
            >
              Reset
            </motion.button>
          </div>
        </motion.div>


        {/* ── Footer ── */}
        <motion.footer
          className="mt-10 text-center pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{ color: 'rgba(253,230,138,0.25)', fontSize: '11px', fontFamily: 'var(--font-cinzel)', letterSpacing: '0.1em' }}
        >
          <div className="flex items-center gap-3 justify-center mb-2">
            <div style={{ height: '1px', width: '40px', background: 'linear-gradient(to right, transparent, rgba(245,200,66,0.2))' }} />
            <span>✦</span>
            <div style={{ height: '1px', width: '40px', background: 'linear-gradient(to left, transparent, rgba(245,200,66,0.2))' }} />
          </div>
          AWRUDU UTHSAWAYA · SRI LANKA · 2026
        </motion.footer>
      </div>

      {/* ── Celebration overlay ── */}
      <Celebration show={allLit} />

      {/* ── Audio toggle ── */}
      <AudioToggle />
    </main>
  );
}

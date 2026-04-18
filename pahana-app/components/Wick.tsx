'use client';

import { motion } from 'framer-motion';
import Flame from './Flame';

interface WickProps {
  id: number;
  isLit: boolean;
  onClick: () => void;
  style: React.CSSProperties;
}

export default function Wick({ id, isLit, onClick, style }: WickProps) {
  return (
    <div
      className="absolute"
      style={{ ...style, width: '40px', height: '60px', zIndex: 30 }}
    >
      <motion.button
        id={`wick-${id}`}
        aria-label={isLit ? `Wick ${id + 1} is lit` : `Light wick ${id + 1}`}
        onClick={onClick}
        disabled={isLit}
        className="relative w-full h-full cursor-pointer group focus:outline-none flex justify-center items-end"
        style={{ background: 'transparent', border: 'none', padding: 0 }}
      >
        {/* Flame originates from the exact bottom center of this container */}
        <div className="absolute bottom-0 w-full flex justify-center items-end">
          <Flame isLit={isLit} />
        </div>

        {/* Hover hint logic without showing a fake stem (just a subtle glow where you click) */}
        {!isLit && (
          <motion.div
            className="absolute bottom-0 rounded-full"
            style={{
              width: '16px',
              height: '8px',
              background: 'rgba(251,191,36,0.4)',
              filter: 'blur(2px)',
            }}
            whileHover={{ scale: 1.5, opacity: 0.8 }}
          />
        )}

        {/* Hover tooltip */}
        {!isLit && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
            <span className="text-xs text-amber-400/80 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
              Click to light
            </span>
          </div>
        )}
      </motion.button>
    </div>
  );
}

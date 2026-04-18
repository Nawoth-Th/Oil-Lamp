'use client';

import Image from 'next/image';
import Wick from './Wick';

// 7 wick positions as percentages of the 500×500px lamp image coordinate space.
// Each value = pixel_coordinate / 500 * 100
// transform: translate(-50%, -100%) anchors the bottom-center of the Wick div
// exactly on the measured wick-tip pixel.
const WICK_POSITIONS = [
  { top: '43.96%', left: '37.06%', transform: 'translate(-50%, -100%)' }, // Wick 1 — x:185.3 y:219.8
  { top: '48.34%', left: '30.88%', transform: 'translate(-50%, -100%)' }, // Wick 2 — x:154.4 y:241.7
  { top: '54.26%', left: '34.86%', transform: 'translate(-50%, -100%)' }, // Wick 3 — x:174.3 y:271.3
  { top: '56.38%', left: '46.20%', transform: 'translate(-50%, -100%)' }, // Wick 4 — x:231.0 y:281.9
  { top: '52.24%', left: '56.36%', transform: 'translate(-50%, -100%)' }, // Wick 5 — x:281.8 y:261.2
  { top: '46.68%', left: '56.36%', transform: 'translate(-50%, -100%)' }, // Wick 6 — x:281.8 y:233.4
  { top: '43.46%', left: '48.12%', transform: 'translate(-50%, -100%)' }, // Wick 7 — x:240.6 y:217.3
];

interface OilLampProps {
  litWicks: Set<number>;
  onWickClick: (id: number) => void;
  allLit: boolean;
}

export default function OilLamp({ litWicks, onWickClick, allLit }: OilLampProps) {
  return (
    <div className="relative flex items-center justify-center">

      {/* Lamp container - 1:1 Aspect Ratio exactly matching 500x500 image */}
      <div
        className="relative"
        style={{ width: '600px', height: '600px' }}
      >
        {/* The real lamp image */}
        <Image
          src="/lamp.png"
          alt="Traditional Sri Lankan Brass Oil Lamp (Pahana)"
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          style={{
            objectFit: 'contain',
            filter: allLit
              ? 'drop-shadow(0 0 30px rgba(245,200,66,0.8)) drop-shadow(0 0 12px rgba(249,115,22,0.6)) brightness(1.2) saturate(1.4)'
              : 'drop-shadow(0 0 10px rgba(245,200,66,0.4)) brightness(1.0) saturate(1.1)',
            transition: 'filter 1s ease',
          }}
          priority
        />

        {/* Wick overlay — positioned precisely on each star tip */}
        {WICK_POSITIONS.map((pos, i) => (
          <Wick
            key={i}
            id={i}
            isLit={litWicks.has(i)}
            onClick={() => onWickClick(i)}
            style={{
              top: pos.top,
              left: pos.left,
              transform: pos.transform,
              zIndex: 30,
            }}
          />
        ))}
      </div>
    </div>
  );
}


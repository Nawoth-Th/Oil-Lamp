'use client';

import Image from 'next/image';
import Wick from './Wick';

// 7 wick positions as percentages of the 500×500px lamp image coordinate space.
// Each value = pixel_coordinate / 500 * 100
// transform: translate(-50%, -100%) anchors the bottom-center of the Wick div
// exactly on the measured wick-tip pixel.
const WICK_POSITIONS = [
  { top: '48.52%', left: '34.74%', transform: 'translate(-50%, -100%)' }, // Wick 1 — x:173.7 y:242.6
  { top: '54.14%', left: '38.98%', transform: 'translate(-50%, -100%)' }, // Wick 2 — x:194.9 y:270.7
  { top: '56.44%', left: '50.00%', transform: 'translate(-50%, -100%)' }, // Wick 3 — x:250.0 y:282.2
  { top: '52.18%', left: '60.38%', transform: 'translate(-50%, -100%)' }, // Wick 4 — x:301.9 y:260.9
  { top: '46.62%', left: '60.38%', transform: 'translate(-50%, -100%)' }, // Wick 5 — x:301.9 y:233.1
  { top: '43.52%', left: '52.26%', transform: 'translate(-50%, -100%)' }, // Wick 6 — x:261.3 y:217.6
  { top: '44.02%', left: '40.94%', transform: 'translate(-50%, -100%)' }, // Wick 7 — x:204.7 y:220.1
];

interface OilLampProps {
  litWicks: Set<number>;
  onWickClick: (id: number) => void;
  allLit: boolean;
}

export default function OilLamp({ litWicks, onWickClick, allLit }: OilLampProps) {
  return (
    <div className="relative flex items-center justify-center w-full">

      {/* Lamp container — responsive: full-width on mobile, capped at 600px on desktop */}
      <div
        className="relative mx-auto"
        style={{
          width: 'min(600px, 100%)',
          aspectRatio: '1 / 1',
        }}
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


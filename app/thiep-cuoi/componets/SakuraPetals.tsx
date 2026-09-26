
'use client';

import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

interface Petal {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  sway: number;
  rotation: number;
  opacity: number;
}

const PETAL_COUNT = 24;

function generatePetals(): Petal[] {
  return Array.from({ length: PETAL_COUNT }, (_, id) => ({
    id,

    // Vị trí ngẫu nhiên theo chiều ngang
    left: Math.random() * 100,

    // Kích thước từ 10–18px
    size: 10 + Math.random() * 8,

    // Thời gian rơi: 10–20 giây
    duration: 10 + Math.random() * 10,

    // Delay âm để hoa xuất hiện rải rác ngay khi mở trang
    delay: -(Math.random() * 20),

    // Độ đung đưa theo gió
    sway: -80 + Math.random() * 160,

    // Góc xoay
    rotation: 360 + Math.random() * 360,

    // Độ trong suốt
    opacity: 0.5 + Math.random() * 0.35,
  }));
}

export default function SakuraPetals() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    setPetals(generatePetals());
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
    >
      {petals.map((petal) => {
        const style = {
          left: `${petal.left}%`,

          width: `${petal.size}px`,
          height: `${petal.size}px`,

          '--duration': `${petal.duration}s`,
          '--delay': `${petal.delay}s`,

          '--sway': `${petal.sway}px`,
          '--sway-back': `${-petal.sway / 2}px`,

          '--rotation': `${petal.rotation}deg`,
          '--petal-opacity': petal.opacity,
        } as CSSProperties;

        return (
          <span
            key={petal.id}
            className="sakura-petal"
            style={style}
          >
            <span className="sakura-petal-shape" />
          </span>
        );
      })}
    </div>
  );
}

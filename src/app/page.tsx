'use client';

import { useState, useEffect } from 'react';
import RepelDiv from './components/RepelDiv';

export default function Home() {
  const [divs, setDivs] = useState<Array<{
    id: number;
    restX: number;
    restY: number;
    size: number;
  }>>([]);

  useEffect(() => {
    const calculateGridLayout = () => {
      const margin = window.innerWidth * 0.05;
      const containerWidth = window.innerWidth * 0.9;
      const containerHeight = window.innerHeight * 0.9;

      const cols = 4;
      const rows = 3;
      const gap = 16;

      const totalGapWidth = (cols - 1) * gap;
      const totalGapHeight = (rows - 1) * gap;

      const size = Math.floor(
        Math.min(
          (containerWidth - totalGapWidth) / cols,
          (containerHeight - totalGapHeight) / rows
        )
      );

      const divs = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const id = row * cols + col;
          const restX = margin + col * (size + gap);
          const restY = margin + row * (size + gap);

          divs.push({ id, restX, restY, size });
        }
      }

      setDivs(divs);
    };

    calculateGridLayout();
    window.addEventListener('resize', calculateGridLayout);
    return () => window.removeEventListener('resize', calculateGridLayout);
  }, []);

  return (
    <div className="relative w-screen h-screen bg-[#E4FFF9]">
      {divs.map((div) => (
        <RepelDiv key={div.id} {...div} />
      ))}
    </div>
  );
}
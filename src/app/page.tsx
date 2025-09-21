'use client';

import { useState, useEffect } from 'react';
import RepelDiv from './components/RepelDiv';
import { useMouse } from './hooks/useMouse';

export default function Home() {
  const mouse = useMouse();
  const [divs, setDivs] = useState<Array<{
    id: number;
    initialX: number;
    initialY: number;
    width: number;
    height: number;
  }>>([]);

  useEffect(() => {
    const calculateGridLayout = () => {
      // ✅ Container: 90% of screen, centered
      const containerWidth = window.innerWidth * 0.9;
      const containerHeight = window.innerHeight * 0.9;

      // ✅ Define grid: let’s use 4 columns x 3 rows (12 items) — adjust as needed
      const cols = 4;
      const rows = 3;
      const gap = 16; // ✅ Small, fixed padding between divs

      // ✅ Calculate maximum possible square size
      const totalGapWidth = (cols - 1) * gap;
      const totalGapHeight = (rows - 1) * gap;

      const maxSize = 200;

      const divSize = Math.floor(maxSize); // ✅ Maximized size!

      const generatedDivs = [];

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const id = row * cols + col;

          // ✅ Position: start from top-left of container, add gaps
          const x = (window.innerWidth - containerWidth) / 2 + col * (divSize + gap);
          const y = (window.innerHeight - containerHeight) / 2 + row * (divSize + gap);

          generatedDivs.push({
            id,
            initialX: x,
            initialY: y,
            width: divSize,
            height: divSize,
          });
        }
      }

      setDivs(generatedDivs);
    };

    calculateGridLayout();

    const handleResize = () => {
      calculateGridLayout(); // ✅ Recalculate on resize
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative w-screen h-screen">
      {/* Container is implied by initial positioning — no need to render it visibly */}
      {divs.map((div) => (
        <RepelDiv key={div.id} {...div} />
      ))}
    </div>
  );
}
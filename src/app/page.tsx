'use client';

import { useState, useEffect } from 'react';
import RepelDiv from './components/RepelDiv';

const divTexts = [
  "This is a short note.",
  "Hover to see more... This div contains a longer message that will expand vertically when you get close to it. Amazing!",
  "Quick tip!",
  "Medium length text with details...",
  "This one is brief.",
  "Another long one: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Tiny",
  "This expands quite a bit — enough to show how neighbors shrink gracefully while padding stays perfect.",
  "Short.",
  "Medium content here, nothing too crazy.",
  "Just a sentence.",
  "Final div: This will expand to fit multiple lines of text, pushing neighbors to shrink — all while keeping the sacred padding untouched.",
];

export default function Home() {
  const [divs, setDivs] = useState<Array<{
    id: number;
    restX: number;
    restY: number;
    initialHeight: number;
    width: number;
    fullText: string;
  }>>([]);

  const gap = 16;

  useEffect(() => {
    const calculateGridLayout = () => {
      const margin = window.innerWidth * 0.05;
      const containerWidth = window.innerWidth * 0.9;
      const containerHeight = window.innerHeight * 0.9;

      const cols = 4;
      const rows = 3;

      const totalGapWidth = (cols - 1) * gap;
      const width = Math.floor((containerWidth - totalGapWidth) / cols);
      const initialHeight = 60;

      const divs = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const id = row * cols + col;
          const restX = margin + col * (width + gap);
          const restY = margin + row * (initialHeight + gap);

          divs.push({
            id,
            restX,
            restY,
            initialHeight,
            width,
            fullText: divTexts[id] || "Default text...",
          });
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
        <RepelDiv key={div.id} {...div} gap={gap} />
      ))}
    </div>
  );
}
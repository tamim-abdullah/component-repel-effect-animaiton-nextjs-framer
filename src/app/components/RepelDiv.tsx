'use client';

import { motion } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import { HoverContext } from '../context/HoverContext';
import { useMouse } from '../hooks/useMouse';

interface RepelDivProps {
  id: number;
  restX: number;
  restY: number;
  initialHeight: number;
  width: number;
  fullText: string;
  gap: number;
}

// Simple estimation — no DOM measurement
const estimateExpandedHeight = (text: string, width: number) => {
  const avgLineLength = (width - 32) / 8; // ~8px per char
  const lines = Math.ceil(text.length / avgLineLength);
  return Math.max(60, lines * 24 + 32); // min 60px
};

export default function RepelDiv({
  id,
  restX,
  restY,
  initialHeight,
  width,
  fullText,
  gap,
}: RepelDivProps) {
  const { expandingId, setExpanding } = useContext(HoverContext);
  const { x: mouseX, y: mouseY } = useMouse();

  const [isHovered, setIsHovered] = useState(false);
  const [scale, setScale] = useState(1);

  const expandedHeight = estimateExpandedHeight(fullText, width);
  const isExpanding = isHovered && expandingId === id;

  // My center for hover detection
  const myCenterX = restX + width / 2;
  const myCenterY = restY + initialHeight / 2;
  const distance = Math.sqrt(
    (mouseX - myCenterX) ** 2 + (mouseY - myCenterY) ** 2
  );

  // ✅ Hover detection — smooth, radius-based
  useEffect(() => {
    if (distance < 120) { // larger radius = smoother activation
      if (!isHovered) {
        setIsHovered(true);
        setExpanding(id);
      }
    } else {
      if (isHovered) {
        setIsHovered(false);
        if (expandingId === id) setExpanding(null);
      }
    }
  }, [distance, isHovered, id, expandingId, setExpanding]);

  // ✅ Neighbor scale effect — if someone else is expanding
  useEffect(() => {
    if (expandingId === null) {
      setScale(1);
      return;
    }

    if (expandingId === id) {
      setScale(1); // I expand via height, not scale
      return;
    }

    // Shrink if I'm close to expanding div
    const dX = mouseX - myCenterX;
    const dY = mouseY - myCenterY;
    const dist = Math.sqrt(dX * dX + dY * dY);

    if (dist < 200) {
      const shrink = 1 - (1 - dist / 200) * 0.15; // shrink max 15%
      setScale(shrink);
    } else {
      setScale(1);
    }
  }, [mouseX, mouseY, myCenterX, myCenterY, expandingId, id]);

  return (
    <>
      {/* Main div — scales for neighbors, height for self */}
      <motion.div
        className="absolute rounded-2xl bg-[#B5FBDD] overflow-hidden will-change-transform"
        style={{
          width: width,
          height: isExpanding ? expandedHeight : initialHeight,
          x: restX,
          y: restY - (isExpanding ? (expandedHeight - initialHeight) / 2 : 0), // grow from center
          scale: expandingId === id ? 1 : scale, // only neighbors scale
        }}
        transition={{
          type: 'spring',
          stiffness: 200, // 👈 slower, smoother
          damping: 25,    // 👈 slower, smoother
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      />

      {/* Text layer */}
      <div
        className="absolute flex items-start p-4 text-gray-800 font-medium leading-relaxed"
        style={{
          width: width - 32,
          height: isExpanding ? expandedHeight - 32 : initialHeight - 32,
          left: restX + 16,
          top: restY - (isExpanding ? (expandedHeight - initialHeight) / 2 : 0) + 16,
          whiteSpace: isExpanding ? 'normal' : 'nowrap',
          overflow: 'hidden',
          textOverflow: isExpanding ? 'clip' : 'ellipsis',
        }}
      >
        {fullText}
      </div>
    </>
  );
}
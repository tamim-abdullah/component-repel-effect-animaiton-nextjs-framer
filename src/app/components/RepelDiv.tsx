'use client';

import { motion } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import { HoverContext } from '../context/HoverContext';
import { useMouse } from '../hooks/useMouse';

interface RepelDivProps {
  id: number;
  restX: number; // ✅ Center of mass (resting position)
  restY: number;
  size: number;
}

export default function RepelDiv({ id, restX, restY, size }: RepelDivProps) {
  const { hoveredId, hoveredPosition, setHoveredId } = useContext(HoverContext);
  const { x: mouseX, y: mouseY } = useMouse();

  // ✅ Always animate back to rest position
  const [isHovered, setIsHovered] = useState(false);
  const [isNearby, setIsNearby] = useState(false);

  // Calculate distance from mouse to MY center
  const dx = mouseX - restX - size / 2;
  const dy = mouseY - restY - size / 2;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // If mouse is close to MY center → I am hovered
  useEffect(() => {
    if (distance < size) {
      setIsHovered(true);
      setHoveredId(id, { x: restX + size / 2, y: restY + size / 2 });
    } else {
      setIsHovered(false);
      if (hoveredId === id) setHoveredId(null, null);
    }
  }, [distance, id, hoveredId, restX, restY, size, setHoveredId]);

  // Am I near the currently hovered div?
  useEffect(() => {
    if (!hoveredPosition || isHovered || hoveredId === null) {
      setIsNearby(false);
      return;
    }

    const myCenterX = restX + size / 2;
    const myCenterY = restY + size / 2;

    const dX = hoveredPosition.x - myCenterX;
    const dY = hoveredPosition.y - myCenterY;
    const dist = Math.sqrt(dX * dX + dY * dY);

    // If within 2.5x size radius → shrink
    setIsNearby(dist < size * 2.5);
  }, [hoveredPosition, isHovered, hoveredId, restX, restY, size]);

  // ✅ Base scale: 1.2 if hovered, 0.85 if nearby, else 1
  const targetScale = isHovered ? 1.2 : isNearby ? 0.85 : 1;

  return (
    <motion.div
      className="absolute rounded-2xl will-change-transform bg-[#B5FBDD]"
      style={{
        width: size,
        height: size,
        x: restX, // ✅ Always visually anchored to rest position
        y: restY,
      }}
      animate={{ scale: targetScale }} // ✅ Only scale changes — position fixed
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onHoverStart={() => {
        setIsHovered(true);
        setHoveredId(id, { x: restX + size / 2, y: restY + size / 2 });
      }}
      onHoverEnd={() => {
        setIsHovered(false);
        if (hoveredId === id) setHoveredId(null, null);
      }}
    />
  );
}
'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

interface RepelDivProps {
  id: number;
  initialX: number;
  initialY: number;
  width: number;
  height: number;
}

export default function RepelDiv({
  id,
  initialX,
  initialY,
  width,
  height,
}: RepelDivProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const ref = useRef<HTMLDivElement>(null);

  const { x: mouseX, y: mouseY } = useMouse();

  useEffect(() => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const divCenterX = rect.left + width / 2;
    const divCenterY = rect.top + height / 2;

    const dx = mouseX - divCenterX;
    const dy = mouseY - divCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const maxRepelDistance = 150;
    const repelStrength = 60;

    if (distance < maxRepelDistance && distance > 0) {
      const forceX = (-dx / distance) * (1 - distance / maxRepelDistance) * repelStrength;
      const forceY = (-dy / distance) * (1 - distance / maxRepelDistance) * repelStrength;

      setPosition((prev) => ({
        x: prev.x + forceX * 0.05,
        y: prev.y + forceY * 0.05,
      }));
    }
  }, [mouseX, mouseY, width, height]);

  return (
    <motion.div
      ref={ref}
      className="absolute rounded-lg will-change-transform"
      style={{
        backgroundColor: '#B5FBDD', // ✅ Your color
        width: width,
        height: height,
        x: position.x,
        y: position.y,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }}
    />
  );
}

import { useMouse } from '../hooks/useMouse';
'use client';

import { createContext, useContext, useState } from 'react';

type HoverContextType = {
  hoveredId: number | null;
  hoveredPosition: { x: number; y: number } | null;
  setHoveredId: (id: number | null, position: { x: number; y: number } | null) => void;
};

export const HoverContext = createContext<HoverContextType>({
  hoveredId: null,
  hoveredPosition: null,
  setHoveredId: () => {},
});

export function HoverProvider({ children }: { children: React.ReactNode }) {
  const [hoveredId, setHoveredIdState] = useState<number | null>(null);
  const [hoveredPosition, setHoveredPosition] = useState<{ x: number; y: number } | null>(null);

  const setHoveredId = (id: number | null, position: { x: number; y: number } | null) => {
    setHoveredIdState(id);
    setHoveredPosition(position);
  };

  return (
    <HoverContext.Provider value={{ hoveredId, hoveredPosition, setHoveredId }}>
      {children}
    </HoverContext.Provider>
  );
}

export const useHover = () => useContext(HoverContext);
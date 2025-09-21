'use client';

import { createContext, useContext, useState } from 'react';

type HoverContextType = {
  expandingId: number | null;
  setExpanding: (id: number | null) => void;
};

export const HoverContext = createContext<HoverContextType>({
  expandingId: null,
  setExpanding: () => {},
});

export function HoverProvider({ children }: { children: React.ReactNode }) {
  const [expandingId, setExpandingId] = useState<number | null>(null);

  return (
    <HoverContext.Provider value={{ expandingId, setExpanding: setExpandingId }}>
      {children}
    </HoverContext.Provider>
  );
}

export const useHover = () => useContext(HoverContext);
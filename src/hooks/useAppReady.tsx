import { createContext, useContext, useState, type ReactNode } from 'react';

/* Le préchargeur signale la fin de son rideau ; le hero attend ce signal
   pour lancer son titre. Tout le reste de la page démarre au scroll. */

const Ctx = createContext<{ ready: boolean; setReady: (v: boolean) => void }>({ ready: false, setReady: () => {} });

export function AppReadyProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  return <Ctx.Provider value={{ ready, setReady }}>{children}</Ctx.Provider>;
}

export const useAppReady = () => useContext(Ctx);

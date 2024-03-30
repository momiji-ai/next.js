'use client';

import { NetworkService } from '@momiji/network';
import { PropsWithChildren, createContext, useContext, useMemo } from 'react';
type UseNetwork = {
  network: NetworkService | null;
};
const NetworkContext = createContext<UseNetwork>({} as UseNetwork);
export function NetworkProvider({ children }: PropsWithChildren) {
  const network = useMemo(() => {
    console.log('getting twice???');
    if (typeof window !== 'undefined') {
      const networkService = new NetworkService();
      return networkService;
    }

    return null;
  }, []);

  return (
    <NetworkContext.Provider value={{ network: network }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork(): UseNetwork {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork should be used under <NetworkProvider />');
  }

  return context;
}

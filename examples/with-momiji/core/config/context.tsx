'use client';

import { PropsWithChildren, createContext, useContext } from 'react';

import { BuildConfig } from './build-config';

type Props = PropsWithChildren<BuildConfig>;
type UseConfig = BuildConfig;
const ConfigContext = createContext<UseConfig>({} as UseConfig);
export function ConfigProvider({ children, ...config }: Props) {
  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
}

export function useConfig(): UseConfig {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig needs to be used with <ConfigProvider />');
  }

  return context;
}

'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

export type DataSourceMode = 'backend' | 'fallback';

const STORAGE_KEY = 'ats_data_source';

function getStoredMode(): DataSourceMode {
  if (typeof window === 'undefined') return 'backend';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'backend' || stored === 'fallback') return stored;
  return 'backend';
}

function storeMode(mode: DataSourceMode) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, mode);
  }
}

interface DataSourceContextValue {
  mode: DataSourceMode;
  setMode: (mode: DataSourceMode) => void;
  toggle: () => void;
}

const DataSourceContext = createContext<DataSourceContextValue>({
  mode: 'backend',
  setMode: () => {},
  toggle: () => {},
});

export function DataSourceProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<DataSourceMode>('backend');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setModeState(getStoredMode());
    setHydrated(true);
  }, []);

  const setMode = useCallback((newMode: DataSourceMode) => {
    setModeState(newMode);
    storeMode(newMode);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ats-datasource-changed', { detail: newMode }));
    }
  }, []);

  const toggle = useCallback(() => {
    setMode(mode === 'backend' ? 'fallback' : 'backend');
  }, [mode, setMode]);

  if (!hydrated) {
    return <>{children}</>;
  }

  return (
    <DataSourceContext.Provider value={{ mode, setMode, toggle }}>
      {children}
    </DataSourceContext.Provider>
  );
}

export function useDataSource(): DataSourceContextValue {
  return useContext(DataSourceContext);
}

export function getCurrentDataSource(): DataSourceMode {
  return getStoredMode();
}

export function setCurrentDataSource(mode: DataSourceMode) {
  storeMode(mode);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ats-datasource-changed', { detail: mode }));
  }
}

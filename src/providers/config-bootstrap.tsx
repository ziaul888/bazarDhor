"use client";

import { useEffect } from 'react';
import { useAppStore } from '@/store/app-store';

export type ConfigBootstrapProps = {
  appConfig: Record<string, unknown> | null;
  settings: Record<string, unknown> | null;
};

export function ConfigBootstrap({ appConfig, settings }: ConfigBootstrapProps) {
  const setAppConfig = useAppStore((s) => s.setAppConfig);
  const setSettings = useAppStore((s) => s.setSettings);

  useEffect(() => {
    if (appConfig) setAppConfig(appConfig);
    if (settings) setSettings(settings);
  }, [appConfig, settings, setAppConfig, setSettings]);

  return null;
}


"use client";

import { useEffect } from 'react';
import { useAppStore } from '@/store/app-store';

export type ConfigBootstrapProps = {
  appConfig: Record<string, unknown> | null;
  settings: Record<string, unknown> | null;
  generalConfig: Record<string, unknown> | null;
};

export function ConfigBootstrap({ appConfig, settings, generalConfig }: ConfigBootstrapProps) {
  const setAppConfig = useAppStore((s) => s.setAppConfig);
  const setSettings = useAppStore((s) => s.setSettings);
  const setGeneralConfig = useAppStore((s) => s.setGeneralConfig);

  useEffect(() => {
    if (appConfig) setAppConfig(appConfig);
    if (settings) setSettings(settings);
    if (generalConfig) setGeneralConfig(generalConfig);
  }, [appConfig, settings, generalConfig, setAppConfig, setSettings, setGeneralConfig]);

  return null;
}


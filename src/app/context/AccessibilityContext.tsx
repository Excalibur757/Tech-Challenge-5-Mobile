// app/context/AccessibilityContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Settings {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  contrastLevel: "normal" | "high" | "dark";
  navigationMode: "basic" | "advanced";
  extraConfirmation: boolean;
  notificationPreference: "reminders" | "notifications" | "both" | "none";
}

// Cores para cada nível de contraste
export interface ColorPalette {
  background: string;
  backgroundSecondary: string;
  text: string;
  textSecondary: string;
  textLight: string;
  border: string;
  card: string;
  input: string;
  header: string;
  headerText: string;
  primary: string;
  success: string;
  warning: string;
  danger: string;
  shadow: string;
  badge: string;
}

export const COLOR_PALETTES: Record<Settings["contrastLevel"], ColorPalette> = {
  normal: {
    background: "#F4F4F4",
    backgroundSecondary: "#FFFFFF",
    text: "#1F2937",
    textSecondary: "#4B5563",
    textLight: "#6B7280",
    border: "#E5E7EB",
    card: "#FFFFFF",
    input: "#FFFFFF",
    header: "#3B82F6",
    headerText: "#FFFFFF",
    primary: "#3B82F6",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    shadow: "#000000",
    badge: "#EFF6FF",
  },
  high: {
    background: "#FFFFFF",
    backgroundSecondary: "#F8F9FA",
    text: "#000000",
    textSecondary: "#1A1A1A",
    textLight: "#333333",
    border: "#000000",
    card: "#FFFFFF",
    input: "#FFFFFF",
    header: "#000000",
    headerText: "#FFFFFF",
    primary: "#000000",
    success: "#000000",
    warning: "#000000",
    danger: "#000000",
    shadow: "#000000",
    badge: "#F0F0F0",
  },
  dark: {
    background: "#1A1A1A",
    backgroundSecondary: "#2D2D2D",
    text: "#FFFFFF",
    textSecondary: "#E5E7EB",
    textLight: "#9CA3AF",
    border: "#4A4A4A",
    card: "#2D2D2D",
    input: "#3D3D3D",
    header: "#0D0D0D",
    headerText: "#FFFFFF",
    primary: "#3B82F6",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    shadow: "#000000",
    badge: "#3D3D3D",
  },
};

interface AccessibilityContextType {
  settings: Settings;
  colors: ColorPalette;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}

const DEFAULT_SETTINGS: Settings = {
  fontSize: 16,
  lineHeight: 1.5,
  letterSpacing: 0,
  contrastLevel: "normal",
  navigationMode: "basic",
  extraConfirmation: false,
  notificationPreference: "both",
};

const STORAGE_KEY = "@accessibility_settings";

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar configurações do AsyncStorage
  const loadSettings = async (): Promise<Settings> => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed;
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
    }
    return DEFAULT_SETTINGS;
  };

  // Carregar ao iniciar
  useEffect(() => {
    const load = async () => {
      const loaded = await loadSettings();
      setSettings(loaded);
      setIsLoading(false);
    };
    load();
  }, []);

  // Aplicar cores ao contexto
  const colors = COLOR_PALETTES[settings.contrastLevel] || COLOR_PALETTES.normal;

  // Salvar configurações
  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const updated = { ...settings, ...newSettings };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setSettings(updated);
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      throw error;
    }
  };

  // Reset para padrões
  const resetSettings = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
      setSettings(DEFAULT_SETTINGS);
    } catch (error) {
      console.error("Erro ao resetar configurações:", error);
      throw error;
    }
  };

  // Recarregar configurações
  const refreshSettings = async () => {
    const loaded = await loadSettings();
    setSettings(loaded);
  };

  const value = {
    settings,
    colors,
    updateSettings,
    resetSettings,
    isLoading,
    refreshSettings,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
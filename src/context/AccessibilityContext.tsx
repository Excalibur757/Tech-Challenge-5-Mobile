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

// Cores para cada nível de contraste - ALINHADAS COM O WEB (tons de azul)
export interface ColorPalette {
  // Cores de fundo
  background: string;
  backgroundSecondary: string;
  
  // Cores de texto
  text: string;
  textSecondary: string;
  textLight: string;
  
  // Cores de borda
  border: string;
  
  // Cores de cards e componentes
  card: string;
  input: string;
  header: string;
  headerText: string;
  
  // Cores de ação
  primary: string;
  primaryLight: string;
  primaryDark: string;
  success: string;
  warning: string;
  danger: string;
  
  // Utilitários
  shadow: string;
  badge: string;
}

export const COLOR_PALETTES: Record<Settings["contrastLevel"], ColorPalette> = {
  normal: {
    // Fundos - tons claros
    background: "#F8FAFC",        // Cinza muito claro (slate-50)
    backgroundSecondary: "#FFFFFF", // Branco puro
    
    // Textos - tons escuros
    text: "#0F172A",              // Slate-900 (quase preto)
    textSecondary: "#334155",     // Slate-700
    textLight: "#64748B",         // Slate-500
    
    // Borda - tom suave
    border: "#CBD5E1",            // Slate-300
    
    // Cards e componentes
    card: "#FFFFFF",              // Branco
    input: "#FFFFFF",             // Branco
    header: "#2563EB",            // Azul 600
    headerText: "#FFFFFF",        // Branco
    
    // Ações - tons de azul
    primary: "#2563EB",           // Azul 600
    primaryLight: "#DBEAFE",      // Azul 100
    primaryDark: "#1D4ED8",       // Azul 700
    success: "#16A34A",           // Verde 600
    warning: "#F59E0B",           // Amarelo
    danger: "#DC2626",            // Vermelho 600
    
    // Utilitários
    shadow: "#000000",
    badge: "#EFF6FF",             // Azul 50
  },
  
  high: {
    // Fundos - alto contraste
    background: "#FFFFFF",        // Branco puro
    backgroundSecondary: "#F1F5F9", // Slate-100
    
    // Textos - preto para máximo contraste
    text: "#1a17ca",              // Preto
    textSecondary: "#1e52a5",     // Slate-800
    textLight: "#475569",         // Slate-600
    
    // Borda - preta para destaque
    border: "#000000",            // Preto
    
    // Cards e componentes
    card: "#FFFFFF",              // Branco
    input: "#FFFFFF",             // Branco
    header: "#000000",            // Preto (máximo contraste)
    headerText: "#FFFFFF",        // Branco
    
    // Ações - azul escuro para contraste
    primary: "#1E3A8A",           // Azul 900
    primaryLight: "#DBEAFE",      // Azul 100
    primaryDark: "#172554",       // Azul 950
    success: "#000000",           // Preto (alto contraste)
    warning: "#000000",           // Preto
    danger: "#000000",            // Preto
    
    // Utilitários
    shadow: "#000000",
    badge: "#F1F5F9",             // Slate-100
  },
  
  dark: {
    // Fundos - tons escuros
    background: "#0F172A",        // Slate-900
    backgroundSecondary: "#1E293B", // Slate-800
    
    // Textos - claros
    text: "#F8FAFC",              // Slate-50
    textSecondary: "#CBD5E1",     // Slate-300
    textLight: "#94A3B8",         // Slate-400
    
    // Borda - tom médio
    border: "#334155",            // Slate-700
    
    // Cards e componentes
    card: "#1E293B",              // Slate-800
    input: "#334155",             // Slate-700
    header: "#0F172A",            // Slate-900
    headerText: "#F8FAFC",        // Slate-50
    
    // Ações - azul mais vibrante no dark
    primary: "#3B82F6",           // Azul 500
    primaryLight: "#1E3A5F",      // Azul escuro
    primaryDark: "#2563EB",       // Azul 600
    success: "#22C55E",           // Verde 500
    warning: "#EAB308",           // Amarelo 500
    danger: "#EF4444",            // Vermelho 500
    
    // Utilitários
    shadow: "#000000",
    badge: "#1E293B",             // Slate-800
  },
};

// Função para aplicar contraste no filter (similar ao web)
export const getContrastFilter = (level: Settings["contrastLevel"]): string => {
  switch (level) {
    case 'high':
      return 'contrast(1.1)';
    case 'dark':
      return 'contrast(1) brightness(0.85)';
    default:
      return 'none';
  }
};

interface AccessibilityContextType {
  settings: Settings;
  colors: ColorPalette;
  contrastFilter: string;
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

  // Aplicar contraste via filter (similar ao web)
  const contrastFilter = getContrastFilter(settings.contrastLevel);
  
  // Obter paleta de cores
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
    contrastFilter,
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
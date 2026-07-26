// app/configuracoes/hooks/useAccessibilitySettings.ts
import { useState, useEffect, useCallback } from 'react';
import { Settings, useAccessibility } from '../../context/AccessibilityContext';

const DEFAULT_SETTINGS: Settings = {
  fontSize: 16,
  lineHeight: 1.5,
  letterSpacing: 0,
  contrastLevel: "normal",
  navigationMode: "basic",
  extraConfirmation: false,
  notificationPreference: "both",
};

export function useAccessibilitySettings() {
  console.log('[useAccessibilitySettings] Iniciando hook');
  
  const { settings: contextSettings, updateSettings, resetSettings, isLoading, refreshSettings } = useAccessibility();
  
  console.log('[useAccessibilitySettings] Contexto recebido:', { 
    contextSettings, 
    isLoading,
    hasUpdateSettings: !!updateSettings,
    hasResetSettings: !!resetSettings,
    hasRefreshSettings: !!refreshSettings
  });

  const [localSettings, setLocalSettings] = useState<Settings>(contextSettings);
  const [initialSettings, setInitialSettings] = useState<Settings>(contextSettings);
  const [isSaved, setIsSaved] = useState(true);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  console.log('[useAccessibilitySettings] Estado inicial:', { localSettings, initialSettings, isSaved });

  // Sincronizar com o contexto quando mudar
  useEffect(() => {
    console.log('[useAccessibilitySettings] useEffect - Sincronizando com contexto');
    console.log('[useAccessibilitySettings] contextSettings:', contextSettings);
    console.log('[useAccessibilitySettings] isLoading:', isLoading);
    
    if (!isLoading) {
      console.log('[useAccessibilitySettings] Atualizando estado local com contexto');
      setLocalSettings(contextSettings);
      setInitialSettings(contextSettings);
      setIsSaved(true);
    }
  }, [contextSettings, isLoading]);

  // Verificar se há mudanças não salvas
  const hasUnsavedChanges = JSON.stringify(localSettings) !== JSON.stringify(initialSettings);
  const isDefaultSettings = JSON.stringify(localSettings) === JSON.stringify(DEFAULT_SETTINGS);

  console.log('[useAccessibilitySettings] Estado atual:', { 
    localSettings, 
    initialSettings, 
    hasUnsavedChanges,
    isDefaultSettings,
    isSaved 
  });

  // Salvar configurações
  const handleSaveSettings = useCallback(async () => {
    console.log('[handleSaveSettings] Iniciando salvamento');
    console.log('[handleSaveSettings] localSettings:', localSettings);
    
    try {
      await updateSettings(localSettings);
      console.log('[handleSaveSettings] updateSettings concluído');
      
      setInitialSettings(localSettings);
      setIsSaved(true);
      setShowSavedMessage(true);
      console.log('[handleSaveSettings] Estado local atualizado');
      
      // Forçar refresh do contexto
      await refreshSettings();
      console.log('[handleSaveSettings] refreshSettings concluído');
      
      setTimeout(() => {
        setShowSavedMessage(false);
      }, 3000);
    } catch (error) {
      console.error('[handleSaveSettings] Erro:', error);
      throw error;
    }
  }, [localSettings, updateSettings, refreshSettings]);

  // Reset para padrões
  const handleResetToDefaults = useCallback(async () => {
    console.log('[handleResetToDefaults] Resetando para padrões');
    try {
      await resetSettings();
      console.log('[handleResetToDefaults] resetSettings concluído');
      await refreshSettings();
      console.log('[handleResetToDefaults] refreshSettings concluído');
    } catch (error) {
      console.error('[handleResetToDefaults] Erro:', error);
      throw error;
    }
  }, [resetSettings, refreshSettings]);

  // Handlers
  const handleFontSizeChange = useCallback((value: number) => {
    console.log('[handleFontSizeChange] Valor:', value);
    setLocalSettings(prev => {
      const newSettings = { ...prev, fontSize: Math.round(value) };
      console.log('[handleFontSizeChange] Novas configurações:', newSettings);
      return newSettings;
    });
    setIsSaved(false);
  }, []);

  const handleLineHeightChange = useCallback((value: number) => {
    console.log('[handleLineHeightChange] Valor:', value);
    setLocalSettings(prev => ({ ...prev, lineHeight: Math.round(value * 10) / 10 }));
    setIsSaved(false);
  }, []);

  const handleLetterSpacingChange = useCallback((value: number) => {
    console.log('[handleLetterSpacingChange] Valor:', value);
    setLocalSettings(prev => ({ ...prev, letterSpacing: Math.round(value * 2) / 2 }));
    setIsSaved(false);
  }, []);

  const handleContrastChange = useCallback((value: Settings["contrastLevel"]) => {
    console.log('[handleContrastChange] Valor:', value);
    setLocalSettings(prev => ({ ...prev, contrastLevel: value }));
    setIsSaved(false);
  }, []);

  const handleNavigationModeChange = useCallback((value: Settings["navigationMode"]) => {
    console.log('[handleNavigationModeChange] Valor:', value);
    setLocalSettings(prev => ({ ...prev, navigationMode: value }));
    setIsSaved(false);
  }, []);

  const handleExtraConfirmationChange = useCallback((value: boolean) => {
    console.log('[handleExtraConfirmationChange] Valor:', value);
    setLocalSettings(prev => ({ ...prev, extraConfirmation: value }));
    setIsSaved(false);
  }, []);

  const handleNotificationPreferenceChange = useCallback((value: Settings["notificationPreference"]) => {
    console.log('[handleNotificationPreferenceChange] Valor:', value);
    setLocalSettings(prev => ({ ...prev, notificationPreference: value }));
    setIsSaved(false);
  }, []);

  const returnValue = {
    settings: localSettings,
    isLoading,
    isSaved,
    showSavedMessage,
    isDefaultSettings,
    hasUnsavedChanges,
    handleSaveSettings,
    handleResetToDefaults,
    handleFontSizeChange,
    handleLineHeightChange,
    handleLetterSpacingChange,
    handleContrastChange,
    handleNavigationModeChange,
    handleExtraConfirmationChange,
    handleNotificationPreferenceChange,
  };

  console.log('[useAccessibilitySettings] Retornando:', returnValue);
  return returnValue;
}
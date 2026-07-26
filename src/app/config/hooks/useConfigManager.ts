import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { DEFAULT_SETTINGS } from "../constants/defaultSettings";

// Define o tipo baseado no DEFAULT_SETTINGS
type SettingsType = {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  contrastLevel: "normal" | "high" | "dark";
  navigationMode: "basic" | "advanced";
  extraConfirmation: boolean;
  notificationPreference: "reminders" | "notifications" | "both" | "none";
};

interface UseConfigManagerProps {
  contextSettings: SettingsType;
  updateSettings: (settings: SettingsType) => Promise<void>;
  resetSettings: () => Promise<void>;
  refreshSettings: () => Promise<void>;
}

export function useConfigManager({
  contextSettings,
  updateSettings,
  resetSettings,
  refreshSettings,
}: UseConfigManagerProps) {
  const [localSettings, setLocalSettings] = useState<SettingsType>(contextSettings);
  const [initialSettings, setInitialSettings] = useState<SettingsType>(contextSettings);
  const [isSaved, setIsSaved] = useState(true);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  // Sincronizar com o contexto
  useEffect(() => {
    setLocalSettings(contextSettings);
    setInitialSettings(contextSettings);
    setIsSaved(true);
  }, [contextSettings]);

  // Verificar mudanças
  const hasUnsavedChanges = JSON.stringify(localSettings) !== JSON.stringify(initialSettings);
  const isDefaultSettings = JSON.stringify(localSettings) === JSON.stringify(DEFAULT_SETTINGS);

  // Handlers para cada configuração
  const handleFontSizeChange = (value: number) => {
    setLocalSettings(prev => ({ ...prev, fontSize: Math.round(value) }));
    setIsSaved(false);
  };

  const handleLineHeightChange = (value: number) => {
    setLocalSettings(prev => ({ ...prev, lineHeight: Math.round(value * 10) / 10 }));
    setIsSaved(false);
  };

  const handleLetterSpacingChange = (value: number) => {
    setLocalSettings(prev => ({ ...prev, letterSpacing: Math.round(value * 2) / 2 }));
    setIsSaved(false);
  };

  const handleContrastChange = (value: "normal" | "high" | "dark") => {
    setLocalSettings(prev => ({ ...prev, contrastLevel: value }));
    setIsSaved(false);
  };

  const handleNavigationModeChange = (value: "basic" | "advanced") => {
    setLocalSettings(prev => ({ ...prev, navigationMode: value }));
    setIsSaved(false);
  };

  const handleExtraConfirmationChange = (value: boolean) => {
    setLocalSettings(prev => ({ ...prev, extraConfirmation: value }));
    setIsSaved(false);
  };

  const handleNotificationPreferenceChange = (
    value: "reminders" | "notifications" | "both" | "none"
  ) => {
    setLocalSettings(prev => ({ ...prev, notificationPreference: value }));
    setIsSaved(false);
  };

  // Salvar configurações
  const handleSaveSettings = async () => {
    try {
      await updateSettings(localSettings);
      setInitialSettings(localSettings);
      setIsSaved(true);
      setShowSavedMessage(true);
      
      await refreshSettings();
      
      setTimeout(() => {
        setShowSavedMessage(false);
      }, 3000);

      Alert.alert("✅ Sucesso", "Configurações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      Alert.alert("❌ Erro", "Erro ao salvar as configurações. Tente novamente.");
    }
  };

  // Reset com confirmação
  const resetWithConfirmation = () => {
    Alert.alert(
      "Restaurar Padrões",
      "Tem certeza que deseja restaurar todas as configurações para os valores padrão?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Restaurar",
          style: "destructive",
          onPress: async () => {
            try {
              await resetSettings();
              await refreshSettings();
              Alert.alert("✅", "Configurações restauradas para os valores padrão!");
            } catch (error) {
              Alert.alert("❌", "Erro ao restaurar configurações.");
            }
          }
        }
      ]
    );
  };

  return {
    localSettings,
    hasUnsavedChanges,
    isDefaultSettings,
    isSaved,
    showSavedMessage,
    setShowSavedMessage,
    handleFontSizeChange,
    handleLineHeightChange,
    handleLetterSpacingChange,
    handleContrastChange,
    handleNavigationModeChange,
    handleExtraConfirmationChange,
    handleNotificationPreferenceChange,
    handleSaveSettings,
    resetWithConfirmation,
  };
}
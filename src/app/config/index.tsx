import { View, Text, ScrollView } from "react-native";
import { useAccessibility } from "../../context/AccessibilityContext";
import { useDynamicStyles } from "../../hooks/useDynamicStyles";
import { createConfigStyles } from "../../styles/config.styles";
import { useConfigManager } from "./hooks/useConfigManager";
import { ConfigHeader } from "./components/ConfigHeader";
import { TextConfig } from "./components/TextConfig";
import { ExperienceConfig } from "./components/ExperienceConfig";
import { NotificationConfig } from "./components/NotificationConfig";
import { ConfigActions } from "./components/ConfigActions";
import { ConfigStatus } from "./components/ConfigStatus";
import { SuccessMessage } from "./components/SuccessMessage";

export default function Configuracoes() {
  const { settings: contextSettings, colors, updateSettings, resetSettings, isLoading, refreshSettings } = useAccessibility();
  const dynamicStyles = useDynamicStyles();
  const styles = createConfigStyles(colors);

  const configManager = useConfigManager({
    contextSettings: contextSettings as any,
    updateSettings,
    resetSettings,
    refreshSettings,
  });

  const {
    localSettings,
    hasUnsavedChanges,
    // isDefaultSettings, // ❌ Removido - não usado
    isSaved,
    showSavedMessage,
    // setShowSavedMessage, // ❌ Removido - não usado
    handleFontSizeChange,
    handleLineHeightChange,
    handleLetterSpacingChange,
    handleContrastChange,
    handleExtraConfirmationChange,
    handleNotificationPreferenceChange,
    handleSaveSettings,
    resetWithConfirmation,
  } = configManager;

  // Loading
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={[styles.loadingText, dynamicStyles.text]}>⏳ Carregando configurações...</Text>
        <Text style={[styles.loadingSubtext, dynamicStyles.hint]}>💡 Isso pode levar alguns segundos</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ConfigHeader 
        styles={styles} 
        isSaved={isSaved} 
        hasUnsavedChanges={hasUnsavedChanges} 
      />

      {showSavedMessage && <SuccessMessage styles={styles} />}

      <TextConfig
        styles={styles}
        settings={localSettings}
        onFontSizeChange={handleFontSizeChange}
        onLineHeightChange={handleLineHeightChange}
        onLetterSpacingChange={handleLetterSpacingChange}
        colors={colors}
      />

      <ExperienceConfig
        styles={styles}
        settings={localSettings}
        onContrastChange={handleContrastChange}
        onConfirmationChange={handleExtraConfirmationChange}
      />

      <NotificationConfig
        styles={styles}
        settings={localSettings}
        onNotificationChange={handleNotificationPreferenceChange}
      />

      <ConfigActions
        styles={styles}
        onSave={handleSaveSettings}
        onReset={resetWithConfirmation}
      />

      <ConfigStatus
        styles={styles}
        settings={localSettings}
        isSaved={isSaved}
        hasUnsavedChanges={hasUnsavedChanges}
      />
    </ScrollView>
  );
}
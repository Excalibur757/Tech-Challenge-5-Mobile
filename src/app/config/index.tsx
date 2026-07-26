import React from "react";
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

  // O useConfigManager agora aceita o tipo correto
  const configManager = useConfigManager({
    contextSettings: contextSettings as any, // 👈 Cast temporário se necessário
    updateSettings,
    resetSettings,
    refreshSettings,
  });

  const {
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
      {/* Header */}
      <ConfigHeader 
        styles={styles} 
        isSaved={isSaved} 
        hasUnsavedChanges={hasUnsavedChanges} 
      />

      {/* Mensagem de sucesso */}
      {showSavedMessage && <SuccessMessage styles={styles} />}

      {/* Configurações de Texto */}
      <TextConfig
        styles={styles}
        settings={localSettings}
        onFontSizeChange={handleFontSizeChange}
        onLineHeightChange={handleLineHeightChange}
        onLetterSpacingChange={handleLetterSpacingChange}
        colors={colors}
      />

      {/* Configurações de Experiência */}
      <ExperienceConfig
        styles={styles}
        settings={localSettings}
        onContrastChange={handleContrastChange}
        onConfirmationChange={handleExtraConfirmationChange}
      />

      {/* Configurações de Notificação */}
      <NotificationConfig
        styles={styles}
        settings={localSettings}
        onNotificationChange={handleNotificationPreferenceChange}
      />

      {/* Botões de Ação */}
      <ConfigActions
        styles={styles}
        onSave={handleSaveSettings}
        onReset={resetWithConfirmation}
      />

      {/* Status Bar */}
      <ConfigStatus
        styles={styles}
        settings={localSettings}
        isSaved={isSaved}
        hasUnsavedChanges={hasUnsavedChanges}
      />
    </ScrollView>
  );
}
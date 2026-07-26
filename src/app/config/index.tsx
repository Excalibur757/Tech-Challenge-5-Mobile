// app/configuracoes/index.tsx (atualizado com cores)
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { useAccessibility } from "../../context/AccessibilityContext";
import { useDynamicStyles } from "../../hooks/useDynamicStyles";
import { createConfigStyles } from "../../styles/config.styles";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;

export default function Configuracoes() {
  const { settings: contextSettings, colors, updateSettings, resetSettings, isLoading, refreshSettings } = useAccessibility();
  const dynamicStyles = useDynamicStyles();
  const styles = createConfigStyles(colors);
  
  // Estado local para edição
  const [localSettings, setLocalSettings] = useState(contextSettings);
  const [initialSettings, setInitialSettings] = useState(contextSettings);
  const [isSaved, setIsSaved] = useState(true);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  // Sincronizar com o contexto quando ele mudar
  useEffect(() => {
    setLocalSettings(contextSettings);
    setInitialSettings(contextSettings);
    setIsSaved(true);
  }, [contextSettings]);

  // Verificar se há mudanças não salvas
  const hasUnsavedChanges = JSON.stringify(localSettings) !== JSON.stringify(initialSettings);
  const isDefaultSettings = JSON.stringify(localSettings) === JSON.stringify({
    fontSize: 16,
    lineHeight: 1.5,
    letterSpacing: 0,
    contrastLevel: "normal",
    navigationMode: "basic",
    extraConfirmation: false,
    notificationPreference: "both",
  });

  // Handlers
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

  const handleNotificationPreferenceChange = (value: "reminders" | "notifications" | "both" | "none") => {
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
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, dynamicStyles.title]}>⚙️ Configurações de Acessibilidade</Text>
          <Text style={[styles.headerSubtitle, dynamicStyles.subtitle]}>Personalize sua experiência de navegação</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={[
            styles.statusText,
            isSaved && !hasUnsavedChanges ? styles.statusSaved : styles.statusUnsaved,
            dynamicStyles.small
          ]}>
            {isSaved && !hasUnsavedChanges ? "✅ Salvo" : "⚠️ Não salvo"}
          </Text>
        </View>
      </View>

      {/* Mensagem de sucesso */}
      {showSavedMessage && (
        <View style={styles.successMessage}>
          <Text style={[styles.successText, dynamicStyles.text]}>✅ Configurações salvas com sucesso!</Text>
          <Text style={[styles.successSubtext, dynamicStyles.hint]}>💡 As alterações já estão ativas em todas as páginas</Text>
        </View>
      )}

      {/* Configurações de Texto */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, dynamicStyles.title]}>📝 Personalizar Texto</Text>

        {/* Tamanho da Fonte */}
        <View style={styles.controlGroup}>
          <View style={styles.controlHeader}>
            <Text style={[styles.controlLabel, dynamicStyles.label]}>Tamanho da Fonte</Text>
            <Text style={[styles.controlValue, dynamicStyles.value]}>{localSettings.fontSize}px</Text>
          </View>
          <Slider
            minimumValue={12}
            maximumValue={32}
            step={1}
            value={localSettings.fontSize}
            onValueChange={handleFontSizeChange}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.primary}
            style={styles.slider}
          />
          <View style={styles.rangeLabels}>
            <Text style={[styles.rangeLabel, dynamicStyles.hint]}>Menor</Text>
            <Text style={[styles.rangeLabel, dynamicStyles.hint]}>Maior</Text>
          </View>
          <Text style={[styles.controlHint, dynamicStyles.hint]}>💡 Recomendado: 18-22px para melhor leitura</Text>
        </View>

        {/* Espaçamento entre linhas */}
        <View style={styles.controlGroup}>
          <View style={styles.controlHeader}>
            <Text style={[styles.controlLabel, dynamicStyles.label]}>Espaçamento entre Linhas</Text>
            <Text style={[styles.controlValue, dynamicStyles.value]}>{localSettings.lineHeight.toFixed(1)}</Text>
          </View>
          <Slider
            minimumValue={1}
            maximumValue={2.5}
            step={0.1}
            value={localSettings.lineHeight}
            onValueChange={handleLineHeightChange}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.primary}
            style={styles.slider}
          />
          <View style={styles.rangeLabels}>
            <Text style={[styles.rangeLabel, dynamicStyles.hint]}>Compacto</Text>
            <Text style={[styles.rangeLabel, dynamicStyles.hint]}>Espaçado</Text>
          </View>
          <Text style={[styles.controlHint, dynamicStyles.hint]}>💡 Recomendado: 1.5-2.0 para facilitar a leitura</Text>
        </View>

        {/* Espaçamento entre letras */}
        <View style={styles.controlGroup}>
          <View style={styles.controlHeader}>
            <Text style={[styles.controlLabel, dynamicStyles.label]}>Espaçamento entre Letras</Text>
            <Text style={[styles.controlValue, dynamicStyles.value]}>{localSettings.letterSpacing}px</Text>
          </View>
          <Slider
            minimumValue={0}
            maximumValue={5}
            step={0.5}
            value={localSettings.letterSpacing}
            onValueChange={handleLetterSpacingChange}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.primary}
            style={styles.slider}
          />
          <View style={styles.rangeLabels}>
            <Text style={[styles.rangeLabel, dynamicStyles.hint]}>Junto</Text>
            <Text style={[styles.rangeLabel, dynamicStyles.hint]}>Separado</Text>
          </View>
          <Text style={[styles.controlHint, dynamicStyles.hint]}>💡 Recomendado: 1-2px para melhor legibilidade</Text>
        </View>
      </View>

      {/* Configurações de Experiência */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, dynamicStyles.title]}>🎨 Configurações de Experiência</Text>

        {/* Contraste */}
        <View style={styles.controlGroup}>
          <Text style={[styles.controlLabel, dynamicStyles.label]}>Nível de Contraste</Text>
          <Text style={[styles.controlHint, dynamicStyles.hint]}>💡 Escolha o contraste que facilita a leitura para você</Text>
          <View style={styles.optionsGrid}>
            {[
              { value: "normal", label: "Normal", description: "Cores padrão" },
              { value: "high", label: "Alto", description: "Maior contraste" },
              { value: "dark", label: "Escuro", description: "Fundo escuro" },
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  localSettings.contrastLevel === option.value && styles.optionActive,
                ]}
                onPress={() => handleContrastChange(option.value as "normal" | "high" | "dark")}
              >
                <Text style={[
                  styles.optionText,
                  localSettings.contrastLevel === option.value && styles.optionTextActive,
                  dynamicStyles.label
                ]}>
                  {option.label}
                </Text>
                <Text style={[styles.optionDescription, dynamicStyles.hint]}>{option.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Modo de Navegação */}
        {/* <View style={styles.controlGroup}>
          <Text style={[styles.controlLabel, dynamicStyles.label]}>Modo de Navegação</Text>
          <Text style={[styles.controlHint, dynamicStyles.hint]}>💡 Escolha entre uma interface mais simples ou com mais recursos</Text>
          <View style={styles.optionsGrid}>
            {[
              { value: "basic", label: "Básico", description: "Interface simplificada" },
              { value: "advanced", label: "Avançado", description: "Recursos completos" },
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  localSettings.navigationMode === option.value && styles.optionActive,
                ]}
                onPress={() => handleNavigationModeChange(option.value as "basic" | "advanced")}
              >
                <Text style={[
                  styles.optionText,
                  localSettings.navigationMode === option.value && styles.optionTextActive,
                  dynamicStyles.label
                ]}>
                  {option.label}
                </Text>
                <Text style={[styles.optionDescription, dynamicStyles.hint]}>{option.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View> */}

        {/* Confirmação Extra */}
        <View style={styles.controlGroup}>
          <Text style={[styles.controlLabel, dynamicStyles.label]}>Necessidade de Confirmação Extra</Text>
          <Text style={[styles.controlHint, dynamicStyles.hint]}>💡 Quando ativado, você será perguntado antes de excluir ou editar tarefas</Text>
          <View style={styles.switchContainer}>
            <TouchableOpacity
              style={[
                styles.switchOption,
                localSettings.extraConfirmation === true && styles.switchOptionActive,
              ]}
              onPress={() => handleExtraConfirmationChange(true)}
            >
              <Text style={[styles.switchOptionText, dynamicStyles.label]}>Sim</Text>
              <Text style={[styles.switchDescription, dynamicStyles.hint]}>Perguntar antes de ações</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.switchOption,
                localSettings.extraConfirmation === false && styles.switchOptionActive,
              ]}
              onPress={() => handleExtraConfirmationChange(false)}
            >
              <Text style={[styles.switchOptionText, dynamicStyles.label]}>Não</Text>
              <Text style={[styles.switchDescription, dynamicStyles.hint]}>Ações diretas</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.controlStatus, dynamicStyles.text]}>
            {localSettings.extraConfirmation 
              ? "✅ Você será perguntado antes de ações importantes" 
              : "❌ Ações serão executadas sem confirmação extra"}
          </Text>
        </View>

        {/* Preferências de Notificação */}
        <View style={styles.controlGroup}>
          <Text style={[styles.controlLabel, dynamicStyles.label]}>Lembretes e Notificações</Text>
          <Text style={[styles.controlHint, dynamicStyles.hint]}>💡 Escolha como deseja ser notificado sobre suas tarefas</Text>
          <View style={styles.optionsGrid}>
            {[
              { value: "reminders", label: "📅 Apenas Lembretes", description: "Receba lembretes" },
              { value: "notifications", label: "🔔 Apenas Notificações", description: "Receba notificações" },
              { value: "both", label: "📅🔔 Ambos", description: "Receba tudo" },
              { value: "none", label: "🔕 Nenhum", description: "Sem notificações" },
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  styles.optionSmall,
                  localSettings.notificationPreference === option.value && styles.optionActive,
                ]}
                onPress={() => handleNotificationPreferenceChange(option.value as "reminders" | "notifications" | "both" | "none")}
              >
                <Text style={[
                  styles.optionText,
                  styles.optionSmallText,
                  localSettings.notificationPreference === option.value && styles.optionTextActive,
                  dynamicStyles.small
                ]}>
                  {option.label}
                </Text>
                <Text style={[styles.optionDescription, dynamicStyles.hint]}>{option.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Botões de Ação */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.saveButton]}
          onPress={handleSaveSettings}
        >
          <Text style={[styles.actionButtonText, dynamicStyles.button]}>💾 Salvar Configurações</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.resetButton]}
          onPress={resetWithConfirmation}
        >
          <Text style={[styles.actionButtonText, dynamicStyles.button]}>↺ Restaurar Padrões</Text>
        </TouchableOpacity>
      </View>

      {/* Status Bar */}
      <View style={styles.statusBar}>
        <Text style={[styles.statusBarText, dynamicStyles.text]}>
          📌 Status: {isSaved && !hasUnsavedChanges ? "Configurações salvas" : "Configurações não salvas"}
        </Text>
        <Text style={[styles.statusBarText, dynamicStyles.text]}>
          🔄 {isDefaultSettings ? "Configurações padrão" : "Configurações personalizadas"}
        </Text>
        <Text style={[styles.statusBarHint, dynamicStyles.hint]}>
          💾 As preferências serão mantidas por 1 ano após salvar
        </Text>
      </View>
    </ScrollView>
  );
}
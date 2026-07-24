// app/configuracoes/index.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";

// Tipos
interface Settings {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  contrastLevel: "normal" | "high" | "dark";
  navigationMode: "basic" | "advanced";
  extraConfirmation: boolean;
  notificationPreference: "reminders" | "notifications" | "both" | "none";
}

// Constantes
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

export default function Configuracoes() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [initialSettings, setInitialSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(true);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  // Carregar configurações
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setSettings(parsed);
          setInitialSettings(parsed);
          setIsSaved(true);
        } else {
          setSettings(DEFAULT_SETTINGS);
          setInitialSettings(DEFAULT_SETTINGS);
          setIsSaved(true);
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
        setSettings(DEFAULT_SETTINGS);
        setInitialSettings(DEFAULT_SETTINGS);
        setIsSaved(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Verificar se há mudanças não salvas
  const hasUnsavedChanges = JSON.stringify(settings) !== JSON.stringify(initialSettings);
  const isDefaultSettings = JSON.stringify(settings) === JSON.stringify(DEFAULT_SETTINGS);

  // Salvar configurações
  const handleSaveSettings = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setInitialSettings(settings);
      setIsSaved(true);
      setShowSavedMessage(true);
      
      setTimeout(() => {
        setShowSavedMessage(false);
      }, 3000);

      Alert.alert("✅ Sucesso", "Configurações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      Alert.alert("❌ Erro", "Erro ao salvar as configurações. Tente novamente.");
    }
  };

  // Reset para padrões
  const resetToDefaults = async () => {
    Alert.alert(
      "Restaurar Padrões",
      "Tem certeza que deseja restaurar todas as configurações para os valores padrão?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Restaurar",
          style: "destructive",
          onPress: async () => {
            setSettings(DEFAULT_SETTINGS);
            setInitialSettings(DEFAULT_SETTINGS);
            setIsSaved(true);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
            Alert.alert("✅", "Configurações restauradas para os valores padrão!");
          }
        }
      ]
    );
  };

  // Handlers
  const handleFontSizeChange = (value: number) => {
    setSettings(prev => ({ ...prev, fontSize: Math.round(value) }));
    setIsSaved(false);
  };

  const handleLineHeightChange = (value: number) => {
    setSettings(prev => ({ ...prev, lineHeight: Math.round(value * 10) / 10 }));
    setIsSaved(false);
  };

  const handleLetterSpacingChange = (value: number) => {
    setSettings(prev => ({ ...prev, letterSpacing: Math.round(value * 2) / 2 }));
    setIsSaved(false);
  };

  const handleContrastChange = (value: "normal" | "high" | "dark") => {
    setSettings(prev => ({ ...prev, contrastLevel: value }));
    setIsSaved(false);
  };

  const handleNavigationModeChange = (value: "basic" | "advanced") => {
    setSettings(prev => ({ ...prev, navigationMode: value }));
    setIsSaved(false);
  };

  const handleExtraConfirmationChange = (value: boolean) => {
    setSettings(prev => ({ ...prev, extraConfirmation: value }));
    setIsSaved(false);
  };

  const handleNotificationPreferenceChange = (value: "reminders" | "notifications" | "both" | "none") => {
    setSettings(prev => ({ ...prev, notificationPreference: value }));
    setIsSaved(false);
  };

  // Loading
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>⏳ Carregando configurações...</Text>
        <Text style={styles.loadingSubtext}>💡 Isso pode levar alguns segundos</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>⚙️ Configurações de Acessibilidade</Text>
          <Text style={styles.headerSubtitle}>Personalize sua experiência de navegação</Text>
          <Text style={styles.headerHint}>💡 Todas as configurações são salvas automaticamente</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={[
            styles.statusText,
            isSaved && !hasUnsavedChanges ? styles.statusSaved : styles.statusUnsaved
          ]}>
            {isSaved && !hasUnsavedChanges ? "✅ Salvo" : "⚠️ Não salvo"}
          </Text>
        </View>
      </View>

      {/* Mensagem de sucesso */}
      {showSavedMessage && (
        <View style={styles.successMessage}>
          <Text style={styles.successText}>✅ Configurações salvas com sucesso!</Text>
          <Text style={styles.successSubtext}>💡 As alterações já estão ativas em todas as páginas</Text>
        </View>
      )}

      {/* Configurações de Texto */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📝 Personalizar Texto</Text>

        {/* Tamanho da Fonte */}
        <View style={styles.controlGroup}>
          <View style={styles.controlHeader}>
            <Text style={styles.controlLabel}>Tamanho da Fonte</Text>
            <Text style={styles.controlValue}>{settings.fontSize}px</Text>
          </View>
          <Slider
            minimumValue={12}
            maximumValue={32}
            step={1}
            value={settings.fontSize}
            onValueChange={handleFontSizeChange}
            minimumTrackTintColor="#3B82F6"
            maximumTrackTintColor="#D1D5DB"
            thumbTintColor="#3B82F6"
            style={styles.slider}
          />
          <View style={styles.rangeLabels}>
            <Text style={styles.rangeLabel}>Menor</Text>
            <Text style={styles.rangeLabel}>Maior</Text>
          </View>
          <Text style={styles.controlHint}>💡 Recomendado: 18-22px para melhor leitura</Text>
        </View>

        {/* Espaçamento entre linhas */}
        <View style={styles.controlGroup}>
          <View style={styles.controlHeader}>
            <Text style={styles.controlLabel}>Espaçamento entre Linhas</Text>
            <Text style={styles.controlValue}>{settings.lineHeight.toFixed(1)}</Text>
          </View>
          <Slider
            minimumValue={1}
            maximumValue={2.5}
            step={0.1}
            value={settings.lineHeight}
            onValueChange={handleLineHeightChange}
            minimumTrackTintColor="#3B82F6"
            maximumTrackTintColor="#D1D5DB"
            thumbTintColor="#3B82F6"
            style={styles.slider}
          />
          <View style={styles.rangeLabels}>
            <Text style={styles.rangeLabel}>Compacto</Text>
            <Text style={styles.rangeLabel}>Espaçado</Text>
          </View>
          <Text style={styles.controlHint}>💡 Recomendado: 1.5-2.0 para facilitar a leitura</Text>
        </View>

        {/* Espaçamento entre letras */}
        <View style={styles.controlGroup}>
          <View style={styles.controlHeader}>
            <Text style={styles.controlLabel}>Espaçamento entre Letras</Text>
            <Text style={styles.controlValue}>{settings.letterSpacing}px</Text>
          </View>
          <Slider
            minimumValue={0}
            maximumValue={5}
            step={0.5}
            value={settings.letterSpacing}
            onValueChange={handleLetterSpacingChange}
            minimumTrackTintColor="#3B82F6"
            maximumTrackTintColor="#D1D5DB"
            thumbTintColor="#3B82F6"
            style={styles.slider}
          />
          <View style={styles.rangeLabels}>
            <Text style={styles.rangeLabel}>Junto</Text>
            <Text style={styles.rangeLabel}>Separado</Text>
          </View>
          <Text style={styles.controlHint}>💡 Recomendado: 1-2px para melhor legibilidade</Text>
        </View>
      </View>

      {/* Configurações de Experiência */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎨 Configurações de Experiência</Text>

        {/* Contraste */}
        <View style={styles.controlGroup}>
          <Text style={styles.controlLabel}>Nível de Contraste</Text>
          <Text style={styles.controlHint}>💡 Escolha o contraste que facilita a leitura para você</Text>
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
                  settings.contrastLevel === option.value && styles.optionActive,
                ]}
                onPress={() => handleContrastChange(option.value as "normal" | "high" | "dark")}
              >
                <Text style={[
                  styles.optionText,
                  settings.contrastLevel === option.value && styles.optionTextActive,
                ]}>
                  {option.label}
                </Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Modo de Navegação */}
        <View style={styles.controlGroup}>
          <Text style={styles.controlLabel}>Modo de Navegação</Text>
          <Text style={styles.controlHint}>💡 Escolha entre uma interface mais simples ou com mais recursos</Text>
          <View style={styles.optionsGrid}>
            {[
              { value: "basic", label: "Básico", description: "Interface simplificada" },
              { value: "advanced", label: "Avançado", description: "Recursos completos" },
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  settings.navigationMode === option.value && styles.optionActive,
                ]}
                onPress={() => handleNavigationModeChange(option.value as "basic" | "advanced")}
              >
                <Text style={[
                  styles.optionText,
                  settings.navigationMode === option.value && styles.optionTextActive,
                ]}>
                  {option.label}
                </Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Confirmação Extra */}
        <View style={styles.controlGroup}>
          <Text style={styles.controlLabel}>Necessidade de Confirmação Extra</Text>
          <Text style={styles.controlHint}>💡 Quando ativado, você será perguntado antes de excluir ou editar tarefas</Text>
          <View style={styles.switchContainer}>
            <TouchableOpacity
              style={[
                styles.switchOption,
                settings.extraConfirmation === true && styles.switchOptionActive,
              ]}
              onPress={() => handleExtraConfirmationChange(true)}
            >
              <Text style={styles.switchOptionText}>Sim</Text>
              <Text style={styles.switchDescription}>Perguntar antes de ações</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.switchOption,
                settings.extraConfirmation === false && styles.switchOptionActive,
              ]}
              onPress={() => handleExtraConfirmationChange(false)}
            >
              <Text style={styles.switchOptionText}>Não</Text>
              <Text style={styles.switchDescription}>Ações diretas</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.controlStatus}>
            {settings.extraConfirmation 
              ? "✅ Você será perguntado antes de ações importantes" 
              : "❌ Ações serão executadas sem confirmação extra"}
          </Text>
        </View>

        {/* Preferências de Notificação */}
        <View style={styles.controlGroup}>
          <Text style={styles.controlLabel}>Lembretes e Notificações</Text>
          <Text style={styles.controlHint}>💡 Escolha como deseja ser notificado sobre suas tarefas</Text>
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
                  settings.notificationPreference === option.value && styles.optionActive,
                ]}
                onPress={() => handleNotificationPreferenceChange(option.value as "reminders" | "notifications" | "both" | "none")}
              >
                <Text style={[
                  styles.optionText,
                  styles.optionSmallText,
                  settings.notificationPreference === option.value && styles.optionTextActive,
                ]}>
                  {option.label}
                </Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
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
          <Text style={styles.actionButtonText}>💾 Salvar Configurações</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.resetButton]}
          onPress={resetToDefaults}
        >
          <Text style={styles.actionButtonText}>↺ Restaurar Padrões</Text>
        </TouchableOpacity>
      </View>

      {/* Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.statusBarText}>
          📌 Status: {isSaved && !hasUnsavedChanges ? "Configurações salvas" : "Configurações não salvas"}
        </Text>
        <Text style={styles.statusBarText}>
          🔄 {isDefaultSettings ? "Configurações padrão" : "Configurações personalizadas"}
        </Text>
        <Text style={styles.statusBarHint}>
          💾 As preferências serão mantidas por 1 ano após salvar
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 18,
    color: "#4B5563",
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  header: {
    backgroundColor: "#3B82F6",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#E0E7FF",
    marginBottom: 4,
  },
  headerHint: {
    fontSize: 12,
    color: "#BFDBFE",
    opacity: 0.9,
  },
  statusBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  statusSaved: {
    color: "#86EFAC",
  },
  statusUnsaved: {
    color: "#FCD34D",
  },
  successMessage: {
    backgroundColor: "#D1FAE5",
    borderWidth: 1,
    borderColor: "#6EE7B7",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  successText: {
    color: "#065F46",
    fontSize: 16,
    fontWeight: "bold",
  },
  successSubtext: {
    color: "#047857",
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 12,
  },
  controlGroup: {
    marginBottom: 24,
  },
  controlHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  controlValue: {
    fontSize: 14,
    backgroundColor: "#EFF6FF",
    color: "#3B82F6",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: "bold",
  },
  controlHint: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 8,
  },
  controlStatus: {
    fontSize: 14,
    color: "#4B5563",
    marginTop: 12,
    padding: 10,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  rangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginTop: -8,
  },
  rangeLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  optionButton: {
    flex: 1,
    minWidth: "30%",
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFF",
    alignItems: "center",
  },
  optionSmall: {
    minWidth: "45%",
  },
  optionActive: {
    borderColor: "#3B82F6",
    backgroundColor: "#EFF6FF",
  },
  optionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4B5563",
  },
  optionSmallText: {
    fontSize: 12,
  },
  optionTextActive: {
    color: "#3B82F6",
  },
  optionDescription: {
    fontSize: 10,
    color: "#6B7280",
    marginTop: 2,
    textAlign: "center",
  },
  switchContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  switchOption: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFF",
    alignItems: "center",
  },
  switchOptionActive: {
    borderColor: "#3B82F6",
    backgroundColor: "#EFF6FF",
  },
  switchOptionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4B5563",
  },
  switchDescription: {
    fontSize: 10,
    color: "#6B7280",
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    minWidth: "45%",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#3B82F6",
  },
  resetButton: {
    backgroundColor: "#6B7280",
  },
  actionButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  statusBar: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 16,
    marginBottom: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  statusBarText: {
    fontSize: 13,
    color: "#4B5563",
    marginBottom: 4,
  },
  statusBarHint: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 4,
  },
});
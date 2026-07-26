import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { createConfigStyles } from "../../../styles/config.styles";
import { useDynamicStyles } from "../../../hooks/useDynamicStyles";
import { CONTRAST_OPTIONS, CONFIRMATION_OPTIONS } from "../constants/options";
import { SettingsType } from "../constants/defaultSettings";

interface ExperienceConfigProps {
  styles: ReturnType<typeof createConfigStyles>;
  settings: SettingsType;
  onContrastChange: (value: "normal" | "high" | "dark") => void;
  onConfirmationChange: (value: boolean) => void;
}

export function ExperienceConfig({
  styles,
  settings,
  onContrastChange,
  onConfirmationChange,
}: ExperienceConfigProps) {
  const dynamicStyles = useDynamicStyles();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, dynamicStyles.title]}>🎨 Configurações de Experiência</Text>

      {/* Contraste */}
      <View style={styles.controlGroup}>
        <Text style={[styles.controlLabel, dynamicStyles.label]}>Nível de Contraste</Text>
        <Text style={[styles.controlHint, dynamicStyles.hint]}>
          💡 Escolha o contraste que facilita a leitura para você
        </Text>
        <View style={styles.optionsGrid}>
          {CONTRAST_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                settings.contrastLevel === option.value && styles.optionActive,
              ]}
              onPress={() => onContrastChange(option.value)}
            >
              <Text style={[
                styles.optionText,
                settings.contrastLevel === option.value && styles.optionTextActive,
                dynamicStyles.label
              ]}>
                {option.label}
              </Text>
              <Text style={[styles.optionDescription, dynamicStyles.hint]}>
                {option.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Confirmação Extra */}
      <View style={styles.controlGroup}>
        <Text style={[styles.controlLabel, dynamicStyles.label]}>Necessidade de Confirmação Extra</Text>
        <Text style={[styles.controlHint, dynamicStyles.hint]}>
          💡 Quando ativado, você será perguntado antes de excluir ou editar tarefas
        </Text>
        <View style={styles.switchContainer}>
          {CONFIRMATION_OPTIONS.map((option) => (
            <TouchableOpacity
              key={String(option.value)}
              style={[
                styles.switchOption,
                settings.extraConfirmation === option.value && styles.switchOptionActive,
              ]}
              onPress={() => onConfirmationChange(option.value)}
            >
              <Text style={[styles.switchOptionText, dynamicStyles.label]}>
                {option.label}
              </Text>
              <Text style={[styles.switchDescription, dynamicStyles.hint]}>
                {option.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[styles.controlStatus, dynamicStyles.text]}>
          {settings.extraConfirmation 
            ? "✅ Você será perguntado antes de ações importantes" 
            : "❌ Ações serão executadas sem confirmação extra"}
        </Text>
      </View>
    </View>
  );
}
import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createConfigStyles } from "../../../styles/config.styles";
import { useDynamicStyles } from "../../../hooks/useDynamicStyles";
import { CONTRAST_OPTIONS, CONFIRMATION_OPTIONS } from "../constants/options";
import { SettingsType } from "../constants/defaultSettings";

const TUTORIAL_KEY = "@tutorial_completed";

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

  // Função para resetar o tutorial
  const resetTutorial = async () => {
    Alert.alert(
      "Resetar Tutorial",
      "Tem certeza que deseja resetar o tutorial? Ele será mostrado novamente na próxima vez que você abrir o app.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Resetar",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(TUTORIAL_KEY);
              Alert.alert(
                "✅ Sucesso",
                "Tutorial resetado! Ele será mostrado na próxima vez que você abrir o app."
              );
            } catch (error) {
              console.error("Erro ao resetar tutorial:", error);
              Alert.alert("❌ Erro", "Não foi possível resetar o tutorial. Tente novamente.");
            }
          }
        }
      ]
    );
  };

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

      {/* Resetar Tutorial - NOVO */}
      <View style={[styles.controlGroup, { marginTop: 8 }]}>
        <Text style={[styles.controlLabel, dynamicStyles.label]}>📚 Tutorial</Text>
        <Text style={[styles.controlHint, dynamicStyles.hint]}>
          💡 Se você quiser rever o tutorial de boas-vindas, pode resetá-lo aqui.
        </Text>
        
        <TouchableOpacity
          style={[
            styles.resetTutorialButton,
            { 
              backgroundColor: "#E74C3C",
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 10,
              alignItems: "center",
              marginTop: 8,
            }
          ]}
          onPress={resetTutorial}
        >
          <Text style={[
            styles.resetTutorialText,
            { 
              color: "#FFF",
              fontSize: 16,
              fontWeight: "600",
            }
          ]}>
            🔄 Resetar Tutorial
          </Text>
        </TouchableOpacity>
        
        <Text style={[styles.controlStatus, dynamicStyles.hint, { marginTop: 4 }]}>
          ℹ️ O tutorial será mostrado novamente quando você abrir o app
        </Text>
      </View>
    </View>
  );
}
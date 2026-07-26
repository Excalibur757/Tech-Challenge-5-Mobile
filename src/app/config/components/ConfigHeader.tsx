import React from "react";
import { View, Text } from "react-native";
import { createConfigStyles } from "../../../styles/config.styles";
import { useDynamicStyles } from "../../../hooks/useDynamicStyles";

interface ConfigHeaderProps {
  styles: ReturnType<typeof createConfigStyles>;
  isSaved: boolean;
  hasUnsavedChanges: boolean;
}

export function ConfigHeader({ styles, isSaved, hasUnsavedChanges }: ConfigHeaderProps) {
  const dynamicStyles = useDynamicStyles();

  return (
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
  );
}
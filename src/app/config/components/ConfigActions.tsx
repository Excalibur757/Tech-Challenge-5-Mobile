import { View, Text, TouchableOpacity } from "react-native";
import { createConfigStyles } from "../../../styles/config.styles";
import { useDynamicStyles } from "../../../hooks/useDynamicStyles";

interface ConfigActionsProps {
  styles: ReturnType<typeof createConfigStyles>;
  onSave: () => void;
  onReset: () => void;
}

export function ConfigActions({ styles, onSave, onReset }: ConfigActionsProps) {
  const dynamicStyles = useDynamicStyles();

  return (
    <View style={styles.actionButtons}>
      <TouchableOpacity
        style={[styles.actionButton, styles.saveButton]}
        onPress={onSave}
      >
        <Text style={[styles.actionButtonText, dynamicStyles.button]}>
          💾 Salvar Configurações
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.actionButton, styles.resetButton]}
        onPress={onReset}
      >
        <Text style={[styles.actionButtonText, dynamicStyles.button]}>
          ↺ Restaurar Padrões
        </Text>
      </TouchableOpacity>
    </View>
  );
}
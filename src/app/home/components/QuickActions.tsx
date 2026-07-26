import { View, Text, TouchableOpacity } from "react-native";
import { createHomeStyles } from "../../../styles/home.styles";

interface QuickActionsProps {
  onCompleteAll: () => void;
  onClearCompleted: () => void;
  styles: ReturnType<typeof createHomeStyles>;
  dynamicStyles: any;
}

export function QuickActions({
  onCompleteAll,
  onClearCompleted,
  styles,
  dynamicStyles
}: QuickActionsProps) {
  return (
    <View style={styles.quickActions}>
      <TouchableOpacity
        style={[styles.actionButton, styles.completeAllButton]}
        onPress={onCompleteAll}
      >
        <Text style={[styles.actionButtonText, dynamicStyles.button]}>✓ Concluir Todas</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, styles.clearButton]}
        onPress={onClearCompleted}
      >
        <Text style={[styles.actionButtonText, dynamicStyles.button]}>🗑️ Limpar Concluídas</Text>
      </TouchableOpacity>
    </View>
  );
}
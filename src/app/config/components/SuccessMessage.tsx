import { View, Text } from "react-native";
import { createConfigStyles } from "../../../styles/config.styles";
import { useDynamicStyles } from "../../../hooks/useDynamicStyles";

interface SuccessMessageProps {
  styles: ReturnType<typeof createConfigStyles>;
}

export function SuccessMessage({ styles }: SuccessMessageProps) {
  const dynamicStyles = useDynamicStyles();

  return (
    <View style={styles.successMessage}>
      <Text style={[styles.successText, dynamicStyles.text]}>
        ✅ Configurações salvas com sucesso!
      </Text>
      <Text style={[styles.successSubtext, dynamicStyles.hint]}>
        💡 As alterações já estão ativas em todas as páginas
      </Text>
    </View>
  );
}
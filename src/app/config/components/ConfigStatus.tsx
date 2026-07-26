import { View, Text } from "react-native";
import { createConfigStyles } from "../../../styles/config.styles";
import { useDynamicStyles } from "../../../hooks/useDynamicStyles";
import { getStatusText } from "../utils/configUtils";
import { SettingsType } from "../constants/defaultSettings";

interface ConfigStatusProps {
  styles: ReturnType<typeof createConfigStyles>;
  settings: SettingsType;
  isSaved: boolean;
  hasUnsavedChanges: boolean;
}

export function ConfigStatus({ styles, settings, isSaved, hasUnsavedChanges }: ConfigStatusProps) {
  const dynamicStyles = useDynamicStyles();

  return (
    <View style={styles.statusBar}>
      <Text style={[styles.statusBarText, dynamicStyles.text]}>
        📌 Status: {isSaved && !hasUnsavedChanges ? "Configurações salvas" : "Configurações não salvas"}
      </Text>
      <Text style={[styles.statusBarText, dynamicStyles.text]}>
        🔄 {getStatusText(settings)}
      </Text>
      <Text style={[styles.statusBarHint, dynamicStyles.hint]}>
        💾 As preferências serão mantidas por 1 ano após salvar
      </Text>
    </View>
  );
}
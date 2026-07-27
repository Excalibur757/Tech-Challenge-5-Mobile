import { View, Text, TouchableOpacity } from "react-native";
import { createConfigStyles } from "../../../styles/config.styles";
import { useDynamicStyles } from "../../../hooks/useDynamicStyles";
import { NOTIFICATION_OPTIONS } from "../constants/options";
import { SettingsType } from "../constants/defaultSettings";

interface NotificationConfigProps {
  styles: ReturnType<typeof createConfigStyles>;
  settings: SettingsType;
  onNotificationChange: (value: "reminders" | "notifications" | "both" | "none") => void;
}

export function NotificationConfig({
  styles,
  settings,
  onNotificationChange,
}: NotificationConfigProps) {
  const dynamicStyles = useDynamicStyles();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, dynamicStyles.title]}>🔔 Configurações de Notificação</Text>

      <View style={styles.controlGroup}>
        <Text style={[styles.controlLabel, dynamicStyles.label]}>Lembretes e Notificações</Text>
        <Text style={[styles.controlHint, dynamicStyles.hint]}>
          💡 Escolha como deseja ser notificado sobre suas tarefas
        </Text>
        <View style={styles.optionsGrid}>
          {NOTIFICATION_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                styles.optionSmall,
                settings.notificationPreference === option.value && styles.optionActive,
              ]}
              onPress={() => onNotificationChange(option.value)}
            >
              <Text style={[
                styles.optionText,
                styles.optionSmallText,
                settings.notificationPreference === option.value && styles.optionTextActive,
                dynamicStyles.small
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
    </View>
  );
}
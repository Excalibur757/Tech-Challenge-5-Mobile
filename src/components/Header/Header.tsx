import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useRouter } from "expo-router";
import { useAccessibility } from "../../context/AccessibilityContext";
import { useDynamicStyles } from "../../hooks/useDynamicStyles";
import { createHeaderStyles } from "./Header.styles";

export default function Header() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { colors, settings } = useAccessibility();
  const dynamicStyles = useDynamicStyles();
  const styles = createHeaderStyles(colors);

  const userName = "João Silva";
  
  // Verificar se está em modo de alto contraste
  const isHighContrast = settings.contrastLevel === "high";
  const isDarkMode = settings.contrastLevel === "dark";

  function navigate(path: "/" | "/home" | "/config" | "/perfil") {
    setOpen(false);
    router.push(path as any);
  }

  function logout() {
    setOpen(false);
    router.replace("/");
  }

  return (
    <View style={[
      styles.container,
      isHighContrast && styles.highContrastContainer,
      isDarkMode && styles.darkModeContainer
    ]}>
      <Text style={[
        styles.logo,
        { fontSize: dynamicStyles.title.fontSize },
        isHighContrast && styles.highContrastText,
        isDarkMode && styles.darkModeText
      ]}>
        SeniorEase
      </Text>

      <View style={styles.rightContainer}>
        <Text style={[
          styles.user,
          { fontSize: dynamicStyles.text.fontSize },
          isHighContrast && styles.highContrastText,
          isDarkMode && styles.darkModeText
        ]}>
          {userName}
        </Text>

        <TouchableOpacity
          onPress={() => setOpen(!open)}
          style={styles.button}
        >
          <Ionicons
            name={open ? "chevron-up" : "chevron-down"}
            size={22}
            color={isDarkMode ? "#FFF" : colors.text}
          />
        </TouchableOpacity>

        {open && (
          <View style={[
            styles.dropdown,
            isHighContrast && styles.highContrastDropdown,
            isDarkMode && styles.darkModeDropdown
          ]}>
            <TouchableOpacity
              style={styles.item}
              onPress={() => navigate("/home")}
            >
              <Text style={[
                styles.itemText,
                { fontSize: dynamicStyles.text.fontSize },
                isHighContrast && styles.highContrastText,
                isDarkMode && styles.darkModeText
              ]}>
                Tela Inicial
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.item}
              onPress={() => navigate("/config")}
            >
              <Text style={[
                styles.itemText,
                { fontSize: dynamicStyles.text.fontSize },
                isHighContrast && styles.highContrastText,
                isDarkMode && styles.darkModeText
              ]}>
                Configurações
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.item}
              onPress={() => navigate("/perfil")}
            >
              <Text style={[
                styles.itemText,
                { fontSize: dynamicStyles.text.fontSize },
                isHighContrast && styles.highContrastText,
                isDarkMode && styles.darkModeText
              ]}>
                Perfil
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.item}
              onPress={logout}
            >
              <Text style={[
                styles.itemText,
                styles.logout,
                { fontSize: dynamicStyles.text.fontSize },
                isHighContrast && styles.highContrastLogout,
                isDarkMode && styles.darkModeLogout
              ]}>
                Sair
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
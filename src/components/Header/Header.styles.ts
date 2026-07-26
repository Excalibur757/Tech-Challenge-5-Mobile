import { StyleSheet } from "react-native";
import { ColorPalette } from "../../context/AccessibilityContext";

export const createHeaderStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    container: {
      height: 75,
      backgroundColor: colors.background || "#FFF",
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border || "#DDD",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      elevation: 5,
      zIndex: 100,
    },

    // Modo alto contraste
    highContrastContainer: {
      backgroundColor: "#000",
      borderBottomColor: "#FFF",
      borderBottomWidth: 2,
    },

    // Modo escuro
    darkModeContainer: {
      backgroundColor: "#1a1a1a",
      borderBottomColor: "#333",
    },

    logo: {
      fontWeight: "bold",
      color: colors.primary || "#2F80ED",
    },

    highContrastText: {
      color: "#FFFFFF",
    },

    darkModeText: {
      color: "#E0E0E0",
    },

    rightContainer: {
      flexDirection: "row",
      alignItems: "center",
      position: "relative",
    },

    user: {
      marginRight: 8,
      fontWeight: "600",
      color: colors.text || "#333",
    },

    button: {
      padding: 5,
    },

    dropdown: {
      position: "absolute",
      top: 50,
      right: 0,
      width: 190,
      backgroundColor: colors.background || "#FFF",
      borderRadius: 10,
      elevation: 8,
      borderWidth: 1,
      borderColor: colors.border || "#DDD",
    },

    highContrastDropdown: {
      backgroundColor: "#000",
      borderColor: "#FFF",
      borderWidth: 2,
    },

    darkModeDropdown: {
      backgroundColor: "#2a2a2a",
      borderColor: "#444",
    },

    item: {
      paddingVertical: 14,
      paddingHorizontal: 15,
    },

    itemText: {
      color: colors.text || "#333",
    },

    logout: {
      color: colors.danger || "#D32F2F",
      fontWeight: "bold",
    },

    highContrastLogout: {
      color: "#FF4444",
    },

    darkModeLogout: {
      color: "#FF6B6B",
    },
  });
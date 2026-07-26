// app/hooks/useDynamicStyles.ts
import { useAccessibility } from "../context/AccessibilityContext";

export function useDynamicStyles() {
  const { settings, colors } = useAccessibility();

  return {
    // Estilos para textos comuns
    text: {
      fontSize: settings.fontSize,
      lineHeight: settings.fontSize * settings.lineHeight,
      letterSpacing: settings.letterSpacing,
      color: colors.text,
    },
    // Estilos para títulos
    title: {
      fontSize: settings.fontSize * 1.5,
      lineHeight: settings.fontSize * 1.5 * settings.lineHeight,
      letterSpacing: settings.letterSpacing,
      color: colors.text,
      fontWeight: "bold" as const,
    },
    // Estilos para subtítulos
    subtitle: {
      fontSize: settings.fontSize * 1.25,
      lineHeight: settings.fontSize * 1.25 * settings.lineHeight,
      letterSpacing: settings.letterSpacing,
      color: colors.textSecondary,
      fontWeight: "600" as const,
    },
    // Estilos para labels
    label: {
      fontSize: settings.fontSize * 0.9,
      lineHeight: settings.fontSize * 0.9 * settings.lineHeight,
      letterSpacing: settings.letterSpacing,
      color: colors.textSecondary,
      fontWeight: "600" as const,
    },
    // Estilos para textos pequenos
    small: {
      fontSize: settings.fontSize * 0.8,
      lineHeight: settings.fontSize * 0.8 * settings.lineHeight,
      letterSpacing: settings.letterSpacing,
      color: colors.textLight,
    },
    // Estilos para hints/dicas
    hint: {
      fontSize: settings.fontSize * 0.75,
      lineHeight: settings.fontSize * 0.75 * settings.lineHeight,
      letterSpacing: settings.letterSpacing,
      color: colors.textLight,
    },
    // Estilos para botões
    button: {
      fontSize: settings.fontSize * 1.1,
      lineHeight: settings.fontSize * 1.1 * settings.lineHeight,
      letterSpacing: settings.letterSpacing,
      color: colors.headerText,
      fontWeight: "bold" as const,
    },
    // Estilos para valores
    value: {
      fontSize: settings.fontSize * 0.9,
      lineHeight: settings.fontSize * 0.9 * settings.lineHeight,
      letterSpacing: settings.letterSpacing,
      color: colors.primary,
      fontWeight: "bold" as const,
    },
    // Cores
    colors,
  };
}
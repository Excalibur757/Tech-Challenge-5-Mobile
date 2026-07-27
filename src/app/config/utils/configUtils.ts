import { SettingsType, DEFAULT_SETTINGS } from "../constants/defaultSettings";

export function hasChanges(settings1: SettingsType, settings2: SettingsType): boolean {
  return JSON.stringify(settings1) !== JSON.stringify(settings2);
}

export function isDefault(settings: SettingsType): boolean {
  return JSON.stringify(settings) === JSON.stringify(DEFAULT_SETTINGS);
}

export function getStatusText(settings: SettingsType): string {
  return isDefault(settings) ? "Configurações padrão" : "Configurações personalizadas";
}

export function getSliderRange(
  type: "fontSize" | "lineHeight" | "letterSpacing"
): { min: number; max: number; step: number } {
  const ranges = {
    fontSize: { min: 12, max: 32, step: 1 },
    lineHeight: { min: 1, max: 2.5, step: 0.1 },
    letterSpacing: { min: 0, max: 5, step: 0.5 },
  };
  return ranges[type];
}

export function getSliderHint(
  type: "fontSize" | "lineHeight" | "letterSpacing"
): string {
  const hints = {
    fontSize: "💡 Recomendado: 18-22px para melhor leitura",
    lineHeight: "💡 Recomendado: 1.5-2.0 para facilitar a leitura",
    letterSpacing: "💡 Recomendado: 1-2px para melhor legibilidade",
  };
  return hints[type];
}
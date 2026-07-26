export const DEFAULT_SETTINGS = {
  fontSize: 16,
  lineHeight: 1.5,
  letterSpacing: 0,
  contrastLevel: "normal" as const,
  navigationMode: "basic" as const,
  extraConfirmation: false,
  notificationPreference: "both" as const,
};

// Exporta o tipo para ser usado em outros lugares
export type SettingsType = {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  contrastLevel: "normal" | "high" | "dark";
  navigationMode: "basic" | "advanced";
  extraConfirmation: boolean;
  notificationPreference: "reminders" | "notifications" | "both" | "none";
};
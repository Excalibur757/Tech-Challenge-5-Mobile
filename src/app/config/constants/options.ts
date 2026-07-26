export const CONTRAST_OPTIONS = [
  { value: "normal", label: "Normal", description: "Cores padrão" },
  { value: "high", label: "Alto", description: "Maior contraste" },
  { value: "dark", label: "Escuro", description: "Fundo escuro" },
] as const;

export const NOTIFICATION_OPTIONS = [
  { value: "reminders", label: "📅 Apenas Lembretes", description: "Receba lembretes" },
  { value: "notifications", label: "🔔 Apenas Notificações", description: "Receba notificações" },
  { value: "both", label: "📅🔔 Ambos", description: "Receba tudo" },
  { value: "none", label: "🔕 Nenhum", description: "Sem notificações" },
] as const;

export const CONFIRMATION_OPTIONS = [
  { value: true, label: "Sim", description: "Perguntar antes de ações" },
  { value: false, label: "Não", description: "Ações diretas" },
] as const;

export type ContrastType = typeof CONTRAST_OPTIONS[number]['value'];
export type NotificationType = typeof NOTIFICATION_OPTIONS[number]['value'];
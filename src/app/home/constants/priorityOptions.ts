export const PRIORITY_OPTIONS = ["baixa", "media", "alta"] as const;
export type PriorityType = typeof PRIORITY_OPTIONS[number];

export const PRIORITY_ORDER: Record<PriorityType, number> = {
  alta: 0,
  media: 1,
  baixa: 2
};

export const PRIORITY_EMOJIS: Record<PriorityType, string> = {
  alta: "🔴",
  media: "🟡",
  baixa: "🟢"
};

export const PRIORITY_LABELS: Record<PriorityType, string> = {
  alta: "Alta",
  media: "Média",
  baixa: "Baixa"
};
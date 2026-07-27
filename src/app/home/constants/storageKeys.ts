export const STORAGE_KEYS = {
  TASKS: "@todo_tasks",
  MODE: "@todo_mode"
} as const;

export const DEFAULT_MODE = "simplificado" as const;
export const MODE_TYPES = ["simplificado", "completo"] as const;
export type ModeType = typeof MODE_TYPES[number];
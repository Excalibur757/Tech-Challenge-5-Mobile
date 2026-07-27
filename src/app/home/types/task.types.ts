export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  priority?: "baixa" | "media" | "alta";
  notes?: string;
  subtasks?: Subtask[];
  reminder?: Date;
  tags?: string[];
}

export type Priority = "baixa" | "media" | "alta";
export type Mode = "simplificado" | "completo";
export type Filter = "todas" | "ativas" | "concluidas";
export type SortBy = "criado" | "prioridade" | "alfabetica";
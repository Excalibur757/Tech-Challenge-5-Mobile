import { Task } from "../types/task.types";
import { PRIORITY_ORDER } from "../constants/priorityOptions";

export type FilterType = "todas" | "ativas" | "concluidas";
export type SortType = "criado" | "prioridade" | "alfabetica";

export function filterTasks(tasks: Task[], filter: FilterType, searchTerm: string): Task[] {
  let filtered = [...tasks];

  // Aplicar filtro de status
  if (filter === "ativas") {
    filtered = filtered.filter(t => !t.completed);
  } else if (filter === "concluidas") {
    filtered = filtered.filter(t => t.completed);
  }

  // Aplicar busca
  if (searchTerm.trim()) {
    const searchLower = searchTerm.toLowerCase();
    filtered = filtered.filter(t =>
      t.text.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
}

export function sortTasks(tasks: Task[], sortBy: SortType): Task[] {
  const sorted = [...tasks];

  switch (sortBy) {
    case "criado":
      sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      break;
    case "prioridade":
      sorted.sort((a, b) =>
        (PRIORITY_ORDER[a.priority || "media"] || 1) -
        (PRIORITY_ORDER[b.priority || "media"] || 1)
      );
      break;
    case "alfabetica":
      sorted.sort((a, b) => a.text.localeCompare(b.text));
      break;
  }

  return sorted;
}

export function getFilteredAndSortedTasks(
  tasks: Task[],
  filter: FilterType,
  searchTerm: string,
  sortBy: SortType
): Task[] {
  const filtered = filterTasks(tasks, filter, searchTerm);
  return sortTasks(filtered, sortBy);
}
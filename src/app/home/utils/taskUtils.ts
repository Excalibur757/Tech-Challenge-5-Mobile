import { Task } from "../types/task.types";
import { PriorityType } from "../constants/priorityOptions";

export function createTask(text: string, priority: PriorityType): Task {
  return {
    id: Date.now().toString(),
    text: text.trim(),
    completed: false,
    createdAt: new Date(),
    priority,
    subtasks: [],
  };
}

export function addTaskToList(tasks: Task[], newTask: Task): Task[] {
  return [newTask, ...tasks];
}

export function deleteTaskFromList(tasks: Task[], id: string): Task[] {
  return tasks.filter(task => task.id !== id);
}

export function toggleTaskCompletion(tasks: Task[], id: string): Task[] {
  return tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
}

export function updateTaskText(tasks: Task[], id: string, newText: string): Task[] {
  if (newText.trim() === "") return tasks;
  return tasks.map(task =>
    task.id === id ? { ...task, text: newText.trim() } : task
  );
}

export function updateTaskPriority(tasks: Task[], id: string, priority: PriorityType): Task[] {
  return tasks.map(task =>
    task.id === id ? { ...task, priority } : task
  );
}

export function addSubtaskToTask(tasks: Task[], taskId: string, subtaskText: string): Task[] {
  if (subtaskText.trim() === "") return tasks;
  return tasks.map(task =>
    task.id === taskId ? {
      ...task,
      subtasks: [
        ...(task.subtasks || []),
        { id: Date.now().toString(), text: subtaskText.trim(), completed: false }
      ]
    } : task
  );
}

export function toggleSubtaskCompletion(tasks: Task[], taskId: string, subtaskId: string): Task[] {
  return tasks.map(task =>
    task.id === taskId ? {
      ...task,
      subtasks: task.subtasks?.map(st =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      )
    } : task
  );
}

export function deleteSubtaskFromTask(tasks: Task[], taskId: string, subtaskId: string): Task[] {
  return tasks.map(task =>
    task.id === taskId ? {
      ...task,
      subtasks: task.subtasks?.filter(st => st.id !== subtaskId)
    } : task
  );
}

export function completeAllTasks(tasks: Task[]): Task[] {
  return tasks.map(t => ({ ...t, completed: true }));
}

export function clearCompletedTasks(tasks: Task[]): Task[] {
  return tasks.filter(t => !t.completed);
}

export function updateTaskNotes(tasks: Task[], taskId: string, notes: string): Task[] {
  return tasks.map(task =>
    task.id === taskId ? { ...task, notes } : task
  );
}

export function findTaskById(tasks: Task[], id: string): Task | undefined {
  return tasks.find(t => t.id === id);
}
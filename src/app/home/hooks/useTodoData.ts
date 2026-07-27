import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS, DEFAULT_MODE, ModeType } from "../constants/storageKeys";
import { Task } from "../types/task.types";

export function useTodoData() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [mode, setMode] = useState<ModeType>(DEFAULT_MODE);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados
  useEffect(() => {
    const loadData = async () => {
      try {
        const [tasksData, modeData] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.TASKS),
          AsyncStorage.getItem(STORAGE_KEYS.MODE),
        ]);

        if (tasksData) {
          const parsed = JSON.parse(tasksData);
          setTasks(parsed.map((t: any) => ({
            ...t,
            createdAt: new Date(t.createdAt),
          })));
        }

        if (modeData === "simplificado" || modeData === "completo") {
          setMode(modeData);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Salvar tarefas
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks)).catch(console.error);
    }
  }, [tasks, isLoading]);

  // Salvar modo
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(STORAGE_KEYS.MODE, mode).catch(console.error);
    }
  }, [mode, isLoading]);

  const toggleMode = () => {
    setMode(prev => prev === "simplificado" ? "completo" : "simplificado");
  };

  return {
    tasks,
    setTasks,
    mode,
    setMode,
    toggleMode,
    isLoading
  };
}
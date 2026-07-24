// App.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../styles/home.styles"

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority?: "baixa" | "media" | "alta";
  createdAt: Date;
  notes?: string;
  subtasks?: { id: string; text: string; completed: boolean }[];
}

interface Stats {
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  completionRate: number;
}

const STORAGE_KEY = "@todo_tasks";
const MODE_KEY = "@todo_mode";
const CONFIRMATION_KEY = "@todo_confirmation";

export default function TodoScreen() {
  // Estados
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"baixa" | "media" | "alta">("media");
  const [mode, setMode] = useState<"simplificado" | "completo">("simplificado");
  const [filter, setFilter] = useState<"todas" | "ativas" | "concluidas">("todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"criado" | "prioridade" | "alfabetica">("criado");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [extraConfirmation, setExtraConfirmation] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState<string | null>(null);
  const [newSubtask, setNewSubtask] = useState("");
  const [showNotes, setShowNotes] = useState<string | null>(null);
  const [editingPriority, setEditingPriority] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados ao iniciar
  useEffect(() => {
    const loadData = async () => {
      try {
        const [tasksData, modeData, confirmationData] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(MODE_KEY),
          AsyncStorage.getItem(CONFIRMATION_KEY),
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

        if (confirmationData) {
          setExtraConfirmation(JSON.parse(confirmationData));
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
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)).catch(console.error);
    }
  }, [tasks, isLoading]);

  // Salvar modo
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(MODE_KEY, mode).catch(console.error);
    }
  }, [mode, isLoading]);

  // Função auxiliar para verificar confirmação
  const shouldConfirm = () => {
    return extraConfirmation === true;
  };

  // Adicionar tarefa
  const addTask = () => {
    if (newTask.trim() === "") return;

    const task: Task = {
      id: Date.now().toString(),
      text: newTask.trim(),
      completed: false,
      createdAt: new Date(),
      priority: newTaskPriority,
      subtasks: [],
    };

    setTasks([task, ...tasks]);
    setNewTask("");
    setNewTaskPriority("media");
  };

  // Excluir tarefa
  const deleteTask = (id: string) => {
    const taskName = tasks.find(t => t.id === id)?.text || "esta tarefa";

    if (shouldConfirm()) {
      Alert.alert(
        "Confirmar exclusão",
        `Tem certeza que deseja excluir "${taskName}"?`,
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Excluir", 
            style: "destructive",
            onPress: () => setTasks(prev => prev.filter(task => task.id !== id))
          }
        ]
      );
    } else {
      setTasks(prev => prev.filter(task => task.id !== id));
    }
  };

  // Alternar status da tarefa
  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Iniciar edição
  const startEdit = (id: string, text: string) => {
    if (shouldConfirm()) {
      Alert.alert(
        "Confirmar edição",
        `Deseja editar a tarefa "${text}"?`,
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Editar",
            onPress: () => {
              setEditingId(id);
              setEditText(text);
            }
          }
        ]
      );
    } else {
      setEditingId(id);
      setEditText(text);
    }
  };

  // Salvar edição
  const saveEdit = (id: string) => {
    if (editText.trim() === "") return;
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, text: editText.trim() } : task
      )
    );
    setEditingId(null);
    setEditText("");
  };

  // Cancelar edição
  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  // Mudar prioridade
  const changePriority = (id: string, priority: "baixa" | "media" | "alta") => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, priority } : task
      )
    );
    setEditingPriority(null);
  };

  // Adicionar subtarefa
  const addSubtask = (taskId: string) => {
    if (newSubtask.trim() === "") return;
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? {
          ...task,
          subtasks: [
            ...(task.subtasks || []),
            { id: Date.now().toString(), text: newSubtask.trim(), completed: false }
          ]
        } : task
      )
    );
    setNewSubtask("");
  };

  // Toggle subtarefa
  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? {
          ...task,
          subtasks: task.subtasks?.map(st =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          )
        } : task
      )
    );
  };

  // Excluir subtarefa
  const deleteSubtask = (taskId: string, subtaskId: string) => {
    const subtask = tasks
      .find(t => t.id === taskId)
      ?.subtasks?.find(st => st.id === subtaskId);

    if (subtask) {
      if (shouldConfirm()) {
        Alert.alert(
          "Confirmar exclusão",
          `Tem certeza que deseja excluir a subtarefa "${subtask.text}"?`,
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Excluir",
              style: "destructive",
              onPress: () => {
                setTasks(prev =>
                  prev.map(task =>
                    task.id === taskId ? {
                      ...task,
                      subtasks: task.subtasks?.filter(st => st.id !== subtaskId)
                    } : task
                  )
                );
              }
            }
          ]
        );
      } else {
        setTasks(prev =>
          prev.map(task =>
            task.id === taskId ? {
              ...task,
              subtasks: task.subtasks?.filter(st => st.id !== subtaskId)
            } : task
          )
        );
      }
    }
  };

  // Alternar modo
  const toggleMode = () => {
    setMode(prev => prev === "simplificado" ? "completo" : "simplificado");
  };

  // Alternar confirmação extra
  const toggleExtraConfirmation = () => {
    setExtraConfirmation(prev => {
      const newValue = !prev;
      AsyncStorage.setItem(CONFIRMATION_KEY, JSON.stringify(newValue)).catch(console.error);
      return newValue;
    });
  };

  // Calcular estatísticas
  const getStats = (): Stats => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const activeTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    return { totalTasks, completedTasks, activeTasks, completionRate };
  };

  const stats = getStats();

  // Filtrar e ordenar tarefas
  const getFilteredTasks = () => {
    let filtered = tasks;

    if (filter === "ativas") {
      filtered = filtered.filter(t => !t.completed);
    } else if (filter === "concluidas") {
      filtered = filtered.filter(t => t.completed);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(t =>
        t.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ordenar
    const priorityOrder = { alta: 0, media: 1, baixa: 2 };
    switch (sortBy) {
      case "criado":
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case "prioridade":
        filtered.sort((a, b) =>
          (priorityOrder[a.priority || "media"] || 1) -
          (priorityOrder[b.priority || "media"] || 1)
        );
        break;
      case "alfabetica":
        filtered.sort((a, b) => a.text.localeCompare(b.text));
        break;
    }

    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  // Renderizar loading
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>⏳ Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Lista de Tarefas</Text>

      {/* Botão de modo */}
      <TouchableOpacity style={styles.modeButton} onPress={toggleMode}>
        <Text style={styles.modeButtonText}>
          {mode === "simplificado" ? "🔹 Modo Simplificado" : "🔸 Modo Completo"}
        </Text>
      </TouchableOpacity>

      {/* Botão de confirmação extra */}
      <TouchableOpacity 
        style={[styles.confirmationButton, extraConfirmation && styles.confirmationActive]}
        onPress={toggleExtraConfirmation}
      >
        <Text style={styles.confirmationButtonText}>
          {extraConfirmation ? "✅ Confirmação Ativada" : "❌ Confirmação Desativada"}
        </Text>
      </TouchableOpacity>

      {/* Estatísticas - apenas modo completo */}
      {mode === "completo" && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>📊 Estatísticas</Text>
          <Text style={styles.statsText}>Total: {stats.totalTasks}</Text>
          <Text style={styles.statsText}>✅ Concluídas: {stats.completedTasks}</Text>
          <Text style={styles.statsText}>⏳ Pendentes: {stats.activeTasks}</Text>
          <Text style={styles.statsText}>📈 Progresso: {stats.completionRate}%</Text>
        </View>
      )}

      {/* Input para nova tarefa */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="✏️ Digite sua tarefa..."
          value={newTask}
          onChangeText={setNewTask}
          style={styles.input}
          onSubmitEditing={addTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Seletor de prioridade */}
      <View style={styles.prioritySelector}>
        <Text style={styles.priorityLabel}>Prioridade:</Text>
        {["baixa", "media", "alta"].map((p) => (
          <TouchableOpacity
            key={p}
            style={[
              styles.priorityOption,
              newTaskPriority === p && styles.priorityOptionActive,
              p === "alta" && styles.highPriority,
              p === "media" && styles.mediumPriority,
              p === "baixa" && styles.lowPriority,
            ]}
            onPress={() => setNewTaskPriority(p as "baixa" | "media" | "alta")}
          >
            <Text style={styles.priorityOptionText}>
              {p === "alta" && "🔴"} {p === "media" && "🟡"} {p === "baixa" && "🟢"} {p.charAt(0).toUpperCase() + p.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Filtros e busca - modo completo */}
      {mode === "completo" && (
        <View style={styles.filterContainer}>
          <TextInput
            placeholder="🔍 Buscar tarefas..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            style={styles.searchInput}
          />
          <View style={styles.filterButtons}>
            {["todas", "ativas", "concluidas"].map((f) => (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filterButton,
                  filter === f && styles.filterButtonActive,
                ]}
                onPress={() => setFilter(f as "todas" | "ativas" | "concluidas")}
              >
                <Text style={styles.filterButtonText}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.sortContainer}>
            <Text style={styles.sortLabel}>Ordenar:</Text>
            {["criado", "prioridade", "alfabetica"].map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.sortButton,
                  sortBy === s && styles.sortButtonActive,
                ]}
                onPress={() => setSortBy(s as "criado" | "prioridade" | "alfabetica")}
              >
                <Text style={styles.sortButtonText}>
                  {s === "criado" && "📅"}
                  {s === "prioridade" && "🎯"}
                  {s === "alfabetica" && "🔤"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Lista de tarefas */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {searchTerm ? "🔍 Nenhuma tarefa encontrada." :
              filter === "todas" ? "🎉 Nenhuma tarefa ainda. Adicione uma!" :
              filter === "ativas" ? "✅ Todas as tarefas foram concluídas!" :
              "📋 Nenhuma tarefa concluída ainda."}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.taskArea}
              onPress={() => toggleTask(item.id)}
            >
              <View
                style={[
                  styles.checkbox,
                  item.completed && styles.checkboxChecked,
                ]}
              />
              <View style={styles.taskContent}>
                {editingId === item.id ? (
                  <View style={styles.editContainer}>
                    <TextInput
                      value={editText}
                      onChangeText={setEditText}
                      style={styles.editInput}
                      onSubmitEditing={() => saveEdit(item.id)}
                      autoFocus
                    />
                    <TouchableOpacity onPress={() => saveEdit(item.id)}>
                      <Text style={styles.saveText}>Salvar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={cancelEdit}>
                      <Text style={styles.cancelText}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    <Text
                      style={[
                        styles.taskText,
                        item.completed && styles.taskCompleted,
                      ]}
                    >
                      {item.text}
                    </Text>
                    {/* Prioridade - modo simplificado */}
                    {mode === "simplificado" && item.priority && (
                      <Text style={styles.priorityIcon}>
                        {item.priority === "alta" && "🔴"}
                        {item.priority === "media" && "🟡"}
                        {item.priority === "baixa" && "🟢"}
                      </Text>
                    )}
                    {/* Detalhes - modo completo */}
                    {mode === "completo" && (
                      <View style={styles.taskDetails}>
                        {item.priority && (
                          <TouchableOpacity
                            onPress={() => setEditingPriority(item.id)}
                            style={[
                              styles.priorityBadge,
                              item.priority === "alta" && styles.highPriority,
                              item.priority === "media" && styles.mediumPriority,
                              item.priority === "baixa" && styles.lowPriority,
                            ]}
                          >
                            <Text style={styles.priorityText}>
                              {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                            </Text>
                          </TouchableOpacity>
                        )}
                        {item.subtasks && item.subtasks.length > 0 && (
                          <Text style={styles.subtaskCount}>
                            📋 {item.subtasks.filter(s => s.completed).length}/{item.subtasks.length}
                          </Text>
                        )}
                      </View>
                    )}
                    {/* Subtarefas visíveis */}
                    {mode === "completo" && showSubtasks === item.id && item.subtasks && (
                      <View style={styles.subtaskList}>
                        {item.subtasks.map((subtask) => (
                          <View key={subtask.id} style={styles.subtaskItem}>
                            <TouchableOpacity
                              onPress={() => toggleSubtask(item.id, subtask.id)}
                              style={[
                                styles.subtaskCheckbox,
                                subtask.completed && styles.checkboxChecked,
                              ]}
                            />
                            <Text style={[
                              styles.subtaskText,
                              subtask.completed && styles.taskCompleted,
                            ]}>
                              {subtask.text}
                            </Text>
                            <TouchableOpacity
                              onPress={() => deleteSubtask(item.id, subtask.id)}
                            >
                              <Text style={styles.deleteSubtask}>×</Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    )}
                    {/* Input para adicionar subtarefa */}
                    {mode === "completo" && showSubtasks === item.id && (
                      <View style={styles.addSubtaskContainer}>
                        <TextInput
                          placeholder="➕ Nova subtarefa..."
                          value={newSubtask}
                          onChangeText={setNewSubtask}
                          style={styles.addSubtaskInput}
                          onSubmitEditing={() => addSubtask(item.id)}
                        />
                        <TouchableOpacity onPress={() => addSubtask(item.id)}>
                          <Text style={styles.addSubtaskButton}>Adicionar</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    {/* Notas - modo completo */}
                    {mode === "completo" && showNotes === item.id && (
                      <TextInput
                        placeholder="📝 Adicione notas aqui..."
                        value={item.notes || ""}
                        onChangeText={(text) => {
                          setTasks(prev =>
                            prev.map(t =>
                              t.id === item.id ? { ...t, notes: text } : t
                            )
                          );
                        }}
                        style={styles.notesInput}
                        multiline
                      />
                    )}
                  </>
                )}
              </View>
            </TouchableOpacity>

            <View style={styles.actions}>
              {mode === "completo" && !editingId && (
                <>
                  <TouchableOpacity
                    onPress={() => setShowSubtasks(showSubtasks === item.id ? null : item.id)}
                    style={styles.actionButton}
                  >
                    <Text style={styles.actionText}>📋</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setShowNotes(showNotes === item.id ? null : item.id)}
                    style={styles.actionButton}
                  >
                    <Text style={styles.actionText}>📝</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => startEdit(item.id, item.text)}
                    style={styles.actionButton}
                  >
                    <Text style={styles.actionText}>✏️</Text>
                  </TouchableOpacity>
                </>
              )}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteTask(item.id)}
              >
                <Text style={styles.deleteText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Ações rápidas - modo simplificado */}
      {mode === "simplificado" && tasks.length > 0 && (
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.completeAllButton]}
            onPress={() => {
              if (shouldConfirm()) {
                Alert.alert(
                  "Confirmar",
                  "Marcar todas as tarefas como concluídas?",
                  [
                    { text: "Cancelar", style: "cancel" },
                    {
                      text: "Confirmar",
                      onPress: () => setTasks(prev => prev.map(t => ({ ...t, completed: true })))
                    }
                  ]
                );
              } else {
                setTasks(prev => prev.map(t => ({ ...t, completed: true })));
              }
            }}
          >
            <Text style={styles.actionButtonText}>✓ Concluir Todas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.clearButton]}
            onPress={() => {
              if (shouldConfirm()) {
                Alert.alert(
                  "Confirmar",
                  "Remover todas as tarefas concluídas?",
                  [
                    { text: "Cancelar", style: "cancel" },
                    {
                      text: "Confirmar",
                      onPress: () => setTasks(prev => prev.filter(t => !t.completed))
                    }
                  ]
                );
              } else {
                setTasks(prev => prev.filter(t => !t.completed));
              }
            }}
          >
            <Text style={styles.actionButtonText}>🗑️ Limpar Concluídas</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useAccessibility } from "../../context/AccessibilityContext";
import { useDynamicStyles } from "../../hooks/useDynamicStyles";
import { createHomeStyles } from "../../styles/home.styles";
import { useTodoData } from "./hooks/useTodoData";
import { 
  addTaskToList,
  deleteTaskFromList,
  toggleTaskCompletion,
  updateTaskText,
  updateTaskPriority,
  addSubtaskToTask,
  toggleSubtaskCompletion,
  deleteSubtaskFromTask,
  completeAllTasks,
  clearCompletedTasks,
  updateTaskNotes,
  findTaskById
} from "./utils/taskUtils";
import { getFilteredAndSortedTasks } from "./utils/filterUtils";
import { confirmAction } from "./utils/confirmationUtils";
import { TaskInput } from "./components/TaskInput";
import { StatsDisplay } from "./components/StatsDisplay";
import { FilterControls } from "./components/FilterControls";
import { TaskItem } from "./components/TaskItem";
import { QuickActions } from "./components/QuickActions";
import { PriorityType } from "./constants/priorityOptions";

export default function TodoScreen() {
  const { settings, colors, isLoading: settingsLoading } = useAccessibility();
  const dynamicStyles = useDynamicStyles();
  const styles = createHomeStyles(colors);

  // Estados vindos do hook
  const { tasks, setTasks, mode, toggleMode, isLoading: dataLoading } = useTodoData();

  // Estados locais
  const [newTask, setNewTask] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<PriorityType>("media");
  const [filter, setFilter] = useState<"todas" | "ativas" | "concluidas">("todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"criado" | "prioridade" | "alfabetica">("criado");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [showSubtasks, setShowSubtasks] = useState<string | null>(null);
  const [newSubtask, setNewSubtask] = useState("");
  const [showNotes, setShowNotes] = useState<string | null>(null);
  const [editingPriority, setEditingPriority] = useState<string | null>(null);

  // Verificar se precisa confirmar
  const needsConfirmation = settings.extraConfirmation === true;

  // Handlers das ações
  const handleAddTask = () => {
    if (newTask.trim() === "") return;
    setTasks(addTaskToList(tasks, {
      id: Date.now().toString(),
      text: newTask.trim(),
      completed: false,
      createdAt: new Date(),
      priority: newTaskPriority,
      subtasks: [],
    }));
    setNewTask("");
    setNewTaskPriority("media");
  };

  const handleDeleteTask = (id: string) => {
    const taskName = findTaskById(tasks, id)?.text || "esta tarefa";
    confirmAction(
      needsConfirmation,
      "Confirmar exclusão",
      `Tem certeza que deseja excluir "${taskName}"?`,
      () => setTasks(deleteTaskFromList(tasks, id)),
      true
    );
  };

  const handleToggleTask = (id: string) => {
    setTasks(toggleTaskCompletion(tasks, id));
  };

  const handleStartEdit = (id: string, text: string) => {
    confirmAction(
      needsConfirmation,
      "Confirmar edição",
      `Deseja editar a tarefa "${text}"?`,
      () => {
        setEditingId(id);
        setEditText(text);
      }
    );
  };

  const handleSaveEdit = (id: string, newText: string) => {
    setTasks(updateTaskText(tasks, id, newText));
    setEditingId(null);
    setEditText("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleChangePriority = (id: string, priority: PriorityType) => {
    setTasks(updateTaskPriority(tasks, id, priority));
    setEditingPriority(null);
  };

  const handleAddSubtask = (taskId: string, subtaskText: string) => {
    setTasks(addSubtaskToTask(tasks, taskId, subtaskText));
    setNewSubtask("");
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(toggleSubtaskCompletion(tasks, taskId, subtaskId));
  };

  const handleDeleteSubtask = (taskId: string, subtaskId: string) => {
    const subtask = findTaskById(tasks, taskId)
      ?.subtasks?.find(st => st.id === subtaskId);

    if (subtask) {
      confirmAction(
        needsConfirmation,
        "Confirmar exclusão",
        `Tem certeza que deseja excluir a subtarefa "${subtask.text}"?`,
        () => setTasks(deleteSubtaskFromTask(tasks, taskId, subtaskId)),
        true
      );
    }
  };

  const handleCompleteAll = () => {
    confirmAction(
      needsConfirmation,
      "Confirmar",
      "Marcar todas as tarefas como concluídas?",
      () => setTasks(completeAllTasks(tasks))
    );
  };

  const handleClearCompleted = () => {
    confirmAction(
      needsConfirmation,
      "Confirmar",
      "Remover todas as tarefas concluídas?",
      () => setTasks(clearCompletedTasks(tasks))
    );
  };

  const handleUpdateNotes = (taskId: string, notes: string) => {
    setTasks(updateTaskNotes(tasks, taskId, notes));
  };

  // Calcular estatísticas
  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const activeTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    return { totalTasks, completedTasks, activeTasks, completionRate };
  }, [tasks]);

  // Filtrar e ordenar tarefas
  const filteredTasks = useMemo(() => {
    return getFilteredAndSortedTasks(tasks, filter, searchTerm, sortBy);
  }, [tasks, filter, searchTerm, sortBy]);

  // Loading
  if (dataLoading || settingsLoading) {
    return (
      <View style={styles.container}>
        <Text style={[styles.loadingText, dynamicStyles.text]}>⏳ Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={true}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={[styles.title, dynamicStyles.title]}>📋 Lista de Tarefas</Text>

      {/* Botão de modo */}
      <TouchableOpacity style={styles.modeButton} onPress={toggleMode}>
        <Text style={[styles.modeButtonText, dynamicStyles.button]}>
          {mode === "simplificado" ? "🔹 Modo Simplificado" : "🔸 Modo Completo"}
        </Text>
      </TouchableOpacity>

      {/* Estatísticas - apenas modo completo */}
      {mode === "completo" && <StatsDisplay stats={stats} styles={styles} dynamicStyles={dynamicStyles} />}

      {/* Input para nova tarefa */}
      <TaskInput
        newTask={newTask}
        setNewTask={setNewTask}
        newTaskPriority={newTaskPriority}
        setNewTaskPriority={setNewTaskPriority}
        onAddTask={handleAddTask}
        styles={styles}
        dynamicStyles={dynamicStyles}
      />

      {/* Filtros e busca - modo completo */}
      {mode === "completo" && (
        <FilterControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filter={filter}
          setFilter={setFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          styles={styles}
          dynamicStyles={dynamicStyles}
        />
      )}

      <View style={styles.listWrapper}>
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={[styles.empty, dynamicStyles.text]}>
              {searchTerm ? "🔍 Nenhuma tarefa encontrada." :
                filter === "todas" ? "🎉 Nenhuma tarefa ainda. Adicione uma!" :
                filter === "ativas" ? "✅ Todas as tarefas foram concluídas!" :
                "📋 Nenhuma tarefa concluída ainda."}
            </Text>
          }
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              mode={mode}
              styles={styles}
              dynamicStyles={dynamicStyles}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onStartEdit={handleStartEdit}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
              onChangePriority={handleChangePriority}
              onAddSubtask={handleAddSubtask}
              onToggleSubtask={handleToggleSubtask}
              onDeleteSubtask={handleDeleteSubtask}
              onUpdateNotes={handleUpdateNotes}
              editingId={editingId}
              editText={editText}
              setEditText={setEditText}
              showSubtasks={showSubtasks}
              setShowSubtasks={setShowSubtasks}
              showNotes={showNotes}
              setShowNotes={setShowNotes}
              editingPriority={editingPriority}
              setEditingPriority={setEditingPriority}
              newSubtask={newSubtask}
              setNewSubtask={setNewSubtask}
            />
          )}
        />
      </View>

      {/* Ações rápidas - modo simplificado */}
      {mode === "simplificado" && tasks.length > 0 && (
        <QuickActions
          onCompleteAll={handleCompleteAll}
          onClearCompleted={handleClearCompleted}
          styles={styles}
          dynamicStyles={dynamicStyles}
        />
      )}
    </ScrollView>
  );
}
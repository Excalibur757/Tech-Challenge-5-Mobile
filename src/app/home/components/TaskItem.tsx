import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Task } from "../../../types/task.types";
import { ModeType } from "../constants/storageKeys";
import { PriorityType, PRIORITY_EMOJIS, PRIORITY_LABELS } from "../constants/priorityOptions";
import { useAccessibility } from "../../../context/AccessibilityContext";
import { useDynamicStyles } from "../../../hooks/useDynamicStyles";
import { createHomeStyles } from "../../../styles/home.styles";

interface TaskItemProps {
  task: Task;
  mode: ModeType;
  styles: ReturnType<typeof createHomeStyles>;
  dynamicStyles: any;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onStartEdit: (id: string, text: string) => void;
  onSaveEdit: (id: string, newText: string) => void;
  onCancelEdit: () => void;
  onChangePriority: (id: string, priority: PriorityType) => void;
  onAddSubtask: (taskId: string, text: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
  onUpdateNotes: (taskId: string, notes: string) => void;
  editingId: string | null;
  editText: string;
  setEditText: (text: string) => void;
  showSubtasks: string | null;
  setShowSubtasks: (id: string | null) => void;
  showNotes: string | null;
  setShowNotes: (id: string | null) => void;
  editingPriority: string | null;
  setEditingPriority: (id: string | null) => void;
  newSubtask: string;
  setNewSubtask: (text: string) => void;
}

export function TaskItem({
  task,
  mode,
  styles,
  dynamicStyles,
  onToggleTask,
  onDeleteTask,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onChangePriority,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onUpdateNotes,
  editingId,
  editText,
  setEditText,
  showSubtasks,
  setShowSubtasks,
  showNotes,
  setShowNotes,
  editingPriority,
  setEditingPriority,
  newSubtask,
  setNewSubtask,
}: TaskItemProps) {
  const { colors } = useAccessibility();

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.taskArea}
        onPress={() => onToggleTask(task.id)}
      >
        <View
          style={[
            styles.checkbox,
            task.completed && styles.checkboxChecked,
          ]}
        />
        <View style={styles.taskContent}>
          {editingId === task.id ? (
            <View style={styles.editContainer}>
              <TextInput
                value={editText}
                onChangeText={setEditText}
                style={[styles.editInput, { fontSize: dynamicStyles.text.fontSize }]}
                onSubmitEditing={() => onSaveEdit(task.id, editText)}
                autoFocus
                placeholderTextColor={colors.textLight}
              />
              <TouchableOpacity onPress={() => onSaveEdit(task.id, editText)}>
                <Text style={[styles.saveText, dynamicStyles.text]}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onCancelEdit}>
                <Text style={[styles.cancelText, dynamicStyles.text]}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text
                style={[
                  styles.taskText,
                  task.completed && styles.taskCompleted,
                  dynamicStyles.text
                ]}
              >
                {task.text}
              </Text>
              {/* Prioridade - modo simplificado */}
              {mode === "simplificado" && task.priority && (
                <Text style={[styles.priorityIcon, dynamicStyles.text]}>
                  {PRIORITY_EMOJIS[task.priority]}
                </Text>
              )}
              {/* Detalhes - modo completo */}
              {mode === "completo" && (
                <View style={styles.taskDetails}>
                  {task.priority && (
                    <TouchableOpacity
                      onPress={() => setEditingPriority(editingPriority === task.id ? null : task.id)}
                      style={[
                        styles.priorityBadge,
                        task.priority === "alta" && styles.highPriority,
                        task.priority === "media" && styles.mediumPriority,
                        task.priority === "baixa" && styles.lowPriority,
                      ]}
                    >
                      <Text style={[styles.priorityText, dynamicStyles.small]}>
                        {PRIORITY_LABELS[task.priority]}
                      </Text>
                    </TouchableOpacity>
                  )}
                  {task.subtasks && task.subtasks.length > 0 && (
                    <TouchableOpacity
                      onPress={() => setShowSubtasks(showSubtasks === task.id ? null : task.id)}
                    >
                      <Text style={[styles.subtaskCount, dynamicStyles.hint]}>
                        📋 {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
              {/* Subtarefas visíveis */}
              {mode === "completo" && showSubtasks === task.id && task.subtasks && (
                <View style={styles.addSubtaskContainer}>
                  <Text style={[styles.subtaskList, dynamicStyles.label]}>
                    📋 Subtarefas ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})
                  </Text>
                  {task.subtasks.map((subtask) => (
                    <View key={subtask.id} style={styles.subtaskItem}>
                      <TouchableOpacity
                        onPress={() => onToggleSubtask(task.id, subtask.id)}
                        style={[
                          styles.subtaskCheckbox,
                          subtask.completed && styles.checkboxChecked,
                        ]}
                      />
                      <Text style={[
                        styles.subtaskText,
                        subtask.completed && styles.taskCompleted,
                        dynamicStyles.text
                      ]}>
                        {subtask.text}
                      </Text>
                      <TouchableOpacity
                        onPress={() => onDeleteSubtask(task.id, subtask.id)}
                        style={styles.deleteSubtask}
                      >
                        <Text style={[styles.deleteSubtask, dynamicStyles.text]}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
              {/* Input para adicionar subtarefa */}
              {mode === "completo" && showSubtasks === task.id && (
                <View style={styles.addSubtaskContainer}>
                  <View style={styles.addSubtaskWrapper}>
                    <TextInput
                      placeholder="Digite"
                      placeholderTextColor={colors.textLight}
                      value={newSubtask}
                      onChangeText={setNewSubtask}
                      style={[
                        styles.addSubtaskInput,
                        { fontSize: dynamicStyles.text.fontSize },
                      ]}
                      onSubmitEditing={() => onAddSubtask(task.id, newSubtask)}
                      autoFocus
                    />
                    <TouchableOpacity
                      style={[
                        styles.addSubtaskButton,
                        !newSubtask.trim() && styles.addSubtaskButtonDisabled,
                      ]}
                      onPress={() => onAddSubtask(task.id, newSubtask)}
                      disabled={!newSubtask.trim()}
                    >
                      <Text
                        style={[
                          styles.addSubtaskButtonText,
                          dynamicStyles.button,
                        ]}
                      >
                        Adicionar
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={[styles.addSubtaskHint, dynamicStyles.hint]}>
                    💡 Digite a subtarefa e pressione "Adicionar" ou Enter
                  </Text>
                </View>
              )}
              {/* Notas - modo completo */}
              {mode === "completo" && showNotes === task.id && (
                <TextInput
                  placeholder="📝 Adicione notas aqui..."
                  placeholderTextColor={colors.textLight}
                  value={task.notes || ""}
                  onChangeText={(text) => onUpdateNotes(task.id, text)}
                  style={[styles.notesInput, { fontSize: dynamicStyles.text.fontSize }]}
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
              onPress={() => setShowSubtasks(showSubtasks === task.id ? null : task.id)}
              style={styles.actionButton}
            >
              <Text style={[styles.actionText, dynamicStyles.text]}>📋</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowNotes(showNotes === task.id ? null : task.id)}
              style={styles.actionButton}
            >
              <Text style={[styles.actionText, dynamicStyles.text]}>📝</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onStartEdit(task.id, task.text)}
              style={styles.actionButton}
            >
              <Text style={[styles.actionText, dynamicStyles.text]}>✏️</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDeleteTask(task.id)}
        >
          <Text style={[styles.deleteText, dynamicStyles.text]}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
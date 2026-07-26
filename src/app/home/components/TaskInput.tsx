import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { PriorityType } from "../constants/priorityOptions";
import { useDynamicStyles } from "../../../hooks/useDynamicStyles";
import { createHomeStyles } from "../../../styles/home.styles";

interface TaskInputProps {
  newTask: string;
  setNewTask: (text: string) => void;
  newTaskPriority: PriorityType;
  setNewTaskPriority: (priority: PriorityType) => void;
  onAddTask: () => void;
  styles: ReturnType<typeof createHomeStyles>;
  dynamicStyles: any;
}

export function TaskInput({
  newTask,
  setNewTask,
  newTaskPriority,
  setNewTaskPriority,
  onAddTask,
  styles,
  dynamicStyles
}: TaskInputProps) {
  const priorityOptions: PriorityType[] = ["baixa", "media", "alta"];
  
  return (
    <>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="✏️ Digite sua tarefa..."
          placeholderTextColor={styles.input.color}
          value={newTask}
          onChangeText={setNewTask}
          style={[styles.input, { fontSize: dynamicStyles.text.fontSize }]}
          onSubmitEditing={onAddTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={onAddTask}>
          <Text style={[styles.addButtonText, { fontSize: dynamicStyles.title.fontSize }]}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.prioritySelector}>
        <Text style={[styles.priorityLabel, dynamicStyles.label]}>Prioridade:</Text>
        {priorityOptions.map((p) => (
          <TouchableOpacity
            key={p}
            style={[
              styles.priorityOption,
              newTaskPriority === p && styles.priorityOptionActive,
              p === "alta" && styles.highPriority,
              p === "media" && styles.mediumPriority,
              p === "baixa" && styles.lowPriority,
            ]}
            onPress={() => setNewTaskPriority(p)}
          >
            <Text style={[styles.priorityOptionText, dynamicStyles.small]}>
              {p === "alta" && "🔴"} {p === "media" && "🟡"} {p === "baixa" && "🟢"} {p.charAt(0).toUpperCase() + p.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}
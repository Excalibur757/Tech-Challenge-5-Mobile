import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import styles from "../styles/home.styles";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

const STORAGE_KEY = "@todo_list";

export default function TodoScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskName, setTaskName] = useState("");

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);

        if (data) {
          setTasks(JSON.parse(data));
        }
      } catch (error) {
        console.log(error);
      }
    };

    void loadTasks();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)).catch(
      console.error
    );
  }, [tasks]);

  function addTask() {
    if (!taskName.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: taskName,
      completed: false,
    };

    setTasks((prev) => [newTask, ...prev]);
    setTaskName("");
  }

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To Do List</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Digite uma tarefa..."
          value={taskName}
          onChangeText={setTaskName}
          style={styles.input}
        />

        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Nenhuma tarefa cadastrada.
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

              <Text
                style={[
                  styles.taskText,
                  item.completed && styles.taskCompleted,
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteTask(item.id)}
            >
              <Text style={styles.deleteText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
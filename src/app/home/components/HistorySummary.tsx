import { useState, useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Task } from "../../../app/home/types/task.types";
import { useAccessibility } from "../../../context/AccessibilityContext";
import { useDynamicStyles } from "../../../hooks/useDynamicStyles";
import { createHomeStyles } from "../../../styles/home.styles";

interface HistorySummaryProps {
  tasks: Task[];
  onViewMore?: () => void;
}

export function HistorySummary({ tasks, onViewMore }: HistorySummaryProps) {
  const { colors } = useAccessibility();
  const dynamicStyles = useDynamicStyles();
  const styles = createHomeStyles(colors);
  const [expanded, setExpanded] = useState(false);

  // Pegar apenas as últimas 5 tarefas concluídas
  const recentCompleted = useMemo(() => {
    return tasks
      .filter(t => t.completed)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, expanded ? 10 : 5);
  }, [tasks, expanded]);

  // Estatísticas rápidas
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Tarefas concluídas hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const completedToday = tasks.filter(t => {
      if (!t.completed) return false;
      const taskDate = new Date(t.createdAt);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === today.getTime();
    }).length;

    return { total, completed, pending, completionRate, completedToday };
  }, [tasks]);

  // Se não houver tarefas concluídas
  if (recentCompleted.length === 0) {
    return (
      <View style={[styles.statsContainer, { marginBottom: 16 }]}>
        <Text style={[styles.statsTitle, dynamicStyles.subtitle]}>
          📊 Histórico
        </Text>
        <Text style={[styles.statsText, dynamicStyles.text, { textAlign: "center", padding: 10 }]}>
          🎉 Nenhuma tarefa concluída ainda.
        </Text>
        <Text style={[styles.statsText, dynamicStyles.hint, { textAlign: "center" }]}>
          Complete suas primeiras tarefas para ver o histórico aqui!
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.statsContainer, { marginBottom: 16 }]}>
      {/* Cabeçalho com estatísticas rápidas */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <Text style={[styles.statsTitle, dynamicStyles.subtitle]}>
          📊 Histórico
        </Text>
        <Text style={[dynamicStyles.small, { color: colors.textLight }]}>
          {stats.completedToday > 0 && `✅ ${stats.completedToday} hoje`}
        </Text>
      </View>

      {/* Mini estatísticas */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        <View style={{ flex: 1, minWidth: 80 }}>
          <Text style={[styles.statsText, dynamicStyles.text]}>
            ✅ {stats.completed} concluídas
          </Text>
        </View>
        <View style={{ flex: 1, minWidth: 80 }}>
          <Text style={[styles.statsText, dynamicStyles.text]}>
            📈 {stats.completionRate}% progresso
          </Text>
        </View>
      </View>

      {/* Lista das últimas concluídas */}
      <View style={{ marginTop: 4 }}>
        <Text style={[dynamicStyles.label, { marginBottom: 8 }]}>
          🕐 Últimas {expanded ? "10" : "5"} tarefas concluídas:
        </Text>
        
        {recentCompleted.map((task, index) => (
          <View 
            key={task.id} 
            style={[
              styles.taskArea,
              { 
                paddingVertical: 6,
                borderBottomWidth: index < recentCompleted.length - 1 ? 1 : 0,
                borderBottomColor: colors.border,
              }
            ]}
          >
            <View
              style={[
                styles.checkbox,
                styles.checkboxChecked,
                { width: 16, height: 16, marginRight: 8 }
              ]}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.taskText,
                  styles.taskCompleted,
                  dynamicStyles.text,
                  { fontSize: dynamicStyles.text.fontSize * 0.9 }
                ]}
                numberOfLines={1}
              >
                {task.text}
              </Text>
              <Text style={[dynamicStyles.hint, { fontSize: 10 }]}>
                {task.createdAt.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
            {task.priority && (
              <Text style={{ fontSize: 12 }}>
                {task.priority === "alta" && "🔴"}
                {task.priority === "media" && "🟡"}
                {task.priority === "baixa" && "🟢"}
              </Text>
            )}
          </View>
        ))}

        {/* Botões de ação */}
        <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
          {tasks.filter(t => t.completed).length > 5 && (
            <TouchableOpacity
              style={[
                styles.filterButton,
                { flex: 1, paddingVertical: 6 }
              ]}
              onPress={() => setExpanded(!expanded)}
            >
              <Text style={[styles.filterButtonText, dynamicStyles.small]}>
                {expanded ? "▲ Ver menos" : "▼ Ver mais"}
              </Text>
            </TouchableOpacity>
          )}
          
          {onViewMore && (
            <TouchableOpacity
              style={[
                styles.filterButton,
                styles.filterButtonActive,
                { flex: 1, paddingVertical: 6 }
              ]}
              onPress={onViewMore}
            >
              <Text style={[styles.filterButtonText, dynamicStyles.small]}>
                📋 Ver todos
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
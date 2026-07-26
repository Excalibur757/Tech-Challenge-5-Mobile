import { useEffect, useMemo, useCallback } from "react"; // 👈 Adicionou useCallback
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useAccessibility } from "../../../context/AccessibilityContext";
import { useDynamicStyles } from "../../../hooks/useDynamicStyles";
import { createHomeStyles } from "../../../styles/home.styles";
import { Task } from "../../../app/home/types/task.types";

interface NotificationsProps {
  tasks: Task[];
}

export function Notifications({ tasks }: NotificationsProps) {
  const { settings, colors } = useAccessibility();
  const dynamicStyles = useDynamicStyles();
  const styles = createHomeStyles(colors);

  // Verificar qual tipo de notificação está ativo
  const preference = settings.notificationPreference;

  // Calcular tarefas urgentes (prioridade alta e não concluídas)
  const urgentTasks = useMemo(() => {
    return tasks.filter(t => t.priority === "alta" && !t.completed);
  }, [tasks]);

  // Tarefas atrasadas (criadas há mais de 3 dias)
  const overdueTasks = useMemo(() => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    return tasks.filter(t => {
      if (t.completed) return false;
      return new Date(t.createdAt) < threeDaysAgo;
    });
  }, [tasks]);

  // Tarefas para hoje (criadas hoje)
  const todayTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return tasks.filter(t => {
      if (t.completed) return false;
      const taskDate = new Date(t.createdAt);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === today.getTime();
    });
  }, [tasks]);

  // Verificar se deve mostrar com base na preferência
  const shouldShowReminders = preference === "reminders" || preference === "both";
  const shouldShowNotifications = preference === "notifications" || preference === "both";
  const shouldShowNothing = preference === "none";

  // Função para mostrar alerta de lembrete - MEMORIZADA
  const showReminderAlert = useCallback((title: string, message: string) => {
    if (!shouldShowReminders) return;
    
    Alert.alert(
      `🔔 ${title}`,
      message,
      [
        { text: "OK", style: "default" }
      ]
    );
  }, [shouldShowReminders]); // 👈 Dependência: shouldShowReminders

  // Função para mostrar notificação - MEMORIZADA
  const showNotification = useCallback((title: string, message: string) => {
    if (!shouldShowNotifications) return;
    
    Alert.alert(
      `📢 ${title}`,
      message,
      [
        { text: "OK", style: "default" }
      ]
    );
  }, [shouldShowNotifications]); // 👈 Dependência: shouldShowNotifications

  // Efeito para verificar tarefas urgentes
  useEffect(() => {
    if (shouldShowNothing) return;
    
    if (urgentTasks.length > 0 && shouldShowReminders) {
      const taskNames = urgentTasks.map(t => `• ${t.text}`).join("\n");
      showReminderAlert(
        "Tarefas Urgentes!",
        `Você tem ${urgentTasks.length} tarefa(s) de prioridade alta pendente(s):\n\n${taskNames}`
      );
    }
  }, [urgentTasks, shouldShowNothing, shouldShowReminders, showReminderAlert]); // 👈 Adicionou showReminderAlert

  // Efeito para verificar tarefas atrasadas
  useEffect(() => {
    if (shouldShowNothing) return;
    
    if (overdueTasks.length > 0 && shouldShowNotifications) {
      const taskNames = overdueTasks.map(t => `• ${t.text}`).join("\n");
      showNotification(
        "Tarefas Atrasadas!",
        `Você tem ${overdueTasks.length} tarefa(s) atrasada(s):\n\n${taskNames}`
      );
    }
  }, [overdueTasks, shouldShowNothing, shouldShowNotifications, showNotification]); // 👈 Adicionou showNotification

  // Se for "none", não mostra nada
  if (shouldShowNothing) {
    return null;
  }

  // Se não tiver tarefas relevantes, mostra mensagem
  if (urgentTasks.length === 0 && overdueTasks.length === 0 && todayTasks.length === 0) {
    return (
      <View style={[styles.statsContainer, { marginBottom: 16 }]}>
        <Text style={[styles.statsTitle, dynamicStyles.subtitle]}>
          🔔 Lembretes
        </Text>
        <Text style={[styles.statsText, dynamicStyles.text, { textAlign: "center", padding: 10 }]}>
          ✅ Nenhum lembrete pendente!
        </Text>
        <Text style={[styles.statsText, dynamicStyles.hint, { textAlign: "center" }]}>
          Continue assim! Todas as suas tarefas estão em dia.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.statsContainer, { marginBottom: 16 }]}>
      {/* Cabeçalho - VERSÃO RESPONSIVA */}
      <View style={{ 
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: 8,
        flexWrap: "wrap",
        gap: 4
      }}>
        <Text 
          style={[
            styles.statsTitle, 
            dynamicStyles.subtitle,
            { 
              flexShrink: 1,
              flexWrap: "wrap",
              maxWidth: "70%",
            }
          ]}
          numberOfLines={2}
        >
          🔔 Lembretes e Notificações
        </Text>
        <View style={{ 
          flexDirection: "row", 
          alignItems: "center",
          flexShrink: 0,
        }}>
          <Text 
            style={[
              dynamicStyles.small, 
              { 
                color: colors.textLight,
                fontSize: dynamicStyles.small?.fontSize || 12,
                textAlign: "right",
              }
            ]}
            numberOfLines={1}
          >
            {shouldShowReminders && "📅"}
            {shouldShowReminders && shouldShowNotifications && " "}
            {shouldShowNotifications && "🔔"}
            {preference === "both" && " Ambos"}
            {preference === "reminders" && " Lembretes"}
            {preference === "notifications" && " Notificações"}
          </Text>
        </View>
      </View>

      {/* Status das preferências */}
      <View style={{ flexDirection: "row", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Text style={[dynamicStyles.small, { color: shouldShowReminders ? colors.success : colors.textLight }]}>
            {shouldShowReminders ? "✅" : "❌"}
          </Text>
          <Text style={[dynamicStyles.small, { color: shouldShowReminders ? colors.text : colors.textLight }]}>
            Lembretes
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Text style={[dynamicStyles.small, { color: shouldShowNotifications ? colors.success : colors.textLight }]}>
            {shouldShowNotifications ? "✅" : "❌"}
          </Text>
          <Text style={[dynamicStyles.small, { color: shouldShowNotifications ? colors.text : colors.textLight }]}>
            Notificações
          </Text>
        </View>
      </View>

      {/* Tarefas urgentes */}
      {urgentTasks.length > 0 && shouldShowReminders && (
        <View style={{ marginBottom: 12 }}>
          <Text style={[dynamicStyles.label, { color: colors.danger, marginBottom: 4 }]}>
            🔴 Tarefas Urgentes ({urgentTasks.length})
          </Text>
          {urgentTasks.slice(0, 3).map((task) => (
            <View key={task.id} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 2 }}>
              <Text style={[dynamicStyles.text, { fontSize: dynamicStyles.text.fontSize * 0.9 }]} numberOfLines={1}>
                • {task.text}
              </Text>
            </View>
          ))}
          {urgentTasks.length > 3 && (
            <Text style={[dynamicStyles.hint, { fontSize: 10 }]}>
              + {urgentTasks.length - 3} outras tarefas urgentes
            </Text>
          )}
        </View>
      )}

      {/* Tarefas atrasadas */}
      {overdueTasks.length > 0 && shouldShowNotifications && (
        <View style={{ marginBottom: 12 }}>
          <Text style={[dynamicStyles.label, { color: colors.warning, marginBottom: 4 }]}>
            ⚠️ Tarefas Atrasadas ({overdueTasks.length})
          </Text>
          {overdueTasks.slice(0, 3).map((task) => (
            <View key={task.id} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 2 }}>
              <Text style={[dynamicStyles.text, { fontSize: dynamicStyles.text.fontSize * 0.9 }]} numberOfLines={1}>
                • {task.text}
              </Text>
            </View>
          ))}
          {overdueTasks.length > 3 && (
            <Text style={[dynamicStyles.hint, { fontSize: 10 }]}>
              + {overdueTasks.length - 3} outras tarefas atrasadas
            </Text>
          )}
        </View>
      )}

      {/* Tarefas de hoje */}
      {todayTasks.length > 0 && (
        <View style={{ marginBottom: 4 }}>
          <Text style={[dynamicStyles.label, { marginBottom: 4 }]}>
            📅 Tarefas de Hoje ({todayTasks.length})
          </Text>
          {todayTasks.slice(0, 3).map((task) => (
            <View key={task.id} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 2 }}>
              <Text style={[dynamicStyles.text, { fontSize: dynamicStyles.text.fontSize * 0.9 }]} numberOfLines={1}>
                • {task.text}
              </Text>
            </View>
          ))}
          {todayTasks.length > 3 && (
            <Text style={[dynamicStyles.hint, { fontSize: 10 }]}>
              + {todayTasks.length - 3} outras tarefas para hoje
            </Text>
          )}
        </View>
      )}

      {/* Botão para ver todas as notificações */}
      <TouchableOpacity
        style={[
          styles.filterButton,
          styles.filterButtonActive,
          { paddingVertical: 8, marginTop: 8 }
        ]}
        onPress={() => {
          let message = "";
          if (urgentTasks.length > 0) {
            message += `🔴 Tarefas Urgentes (${urgentTasks.length}):\n`;
            urgentTasks.forEach(t => { message += `  • ${t.text}\n`; });
            message += "\n";
          }
          if (overdueTasks.length > 0) {
            message += `⚠️ Tarefas Atrasadas (${overdueTasks.length}):\n`;
            overdueTasks.forEach(t => { message += `  • ${t.text}\n`; });
            message += "\n";
          }
          if (todayTasks.length > 0) {
            message += `📅 Tarefas de Hoje (${todayTasks.length}):\n`;
            todayTasks.forEach(t => { message += `  • ${t.text}\n`; });
          }
          
          Alert.alert(
            "📋 Resumo de Lembretes",
            message || "Nenhum lembrete pendente! 🎉",
            [{ text: "OK", style: "default" }]
          );
        }}
      >
        <Text style={[styles.filterButtonText, dynamicStyles.small]}>
          📋 Ver todos os lembretes
        </Text>
      </TouchableOpacity>
    </View>
  );
}
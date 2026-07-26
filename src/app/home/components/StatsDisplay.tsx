import React from "react";
import { View, Text } from "react-native";
import { Stats } from "../types/Stats";
import { useDynamicStyles } from "../../../hooks/useDynamicStyles";
import { createHomeStyles } from "../../../styles/home.styles";

interface StatsDisplayProps {
  stats: Stats;
  styles: ReturnType<typeof createHomeStyles>;
  dynamicStyles: any;
}

export function StatsDisplay({ stats, styles, dynamicStyles }: StatsDisplayProps) {
  return (
    <View style={styles.statsContainer}>
      <Text style={[styles.statsTitle, dynamicStyles.subtitle]}>📊 Estatísticas</Text>
      <Text style={[styles.statsText, dynamicStyles.text]}>Total: {stats.totalTasks}</Text>
      <Text style={[styles.statsText, dynamicStyles.text]}>✅ Concluídas: {stats.completedTasks}</Text>
      <Text style={[styles.statsText, dynamicStyles.text]}>⏳ Pendentes: {stats.activeTasks}</Text>
      <Text style={[styles.statsText, dynamicStyles.text]}>📈 Progresso: {stats.completionRate}%</Text>
    </View>
  );
}
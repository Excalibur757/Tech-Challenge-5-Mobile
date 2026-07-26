import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { FilterType, SortType } from "../utils/filterUtils";
import { createHomeStyles } from "../../../styles/home.styles";
import { useAccessibility } from "../../../context/AccessibilityContext";

interface FilterControlsProps {
  searchTerm: string;
  setSearchTerm: (text: string) => void;
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  sortBy: SortType;
  setSortBy: (sort: SortType) => void;
  styles: ReturnType<typeof createHomeStyles>;
  dynamicStyles: any;
}

export function FilterControls({
  searchTerm,
  setSearchTerm,
  filter,
  setFilter,
  sortBy,
  setSortBy,
  styles,
  dynamicStyles
}: FilterControlsProps) {
  const { colors } = useAccessibility();
  const filterOptions: FilterType[] = ["todas", "ativas", "concluidas"];
  const sortOptions: SortType[] = ["criado", "prioridade", "alfabetica"];

  return (
    <View style={styles.filterContainer}>
      <TextInput
        placeholder="🔍 Buscar tarefas..."
        placeholderTextColor={colors.textLight}
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={[styles.searchInput, { fontSize: dynamicStyles.text.fontSize }]}
      />
      <View style={styles.filterButtons}>
        {filterOptions.map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterButton,
              filter === f && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterButtonText, dynamicStyles.small]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.sortContainer}>
        <Text style={[styles.sortLabel, dynamicStyles.label]}>Ordenar:</Text>
        {sortOptions.map((s) => (
          <TouchableOpacity
            key={s}
            style={[
              styles.sortButton,
              sortBy === s && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy(s)}
          >
            <Text style={[styles.sortButtonText, dynamicStyles.text]}>
              {s === "criado" && "📅"}
              {s === "prioridade" && "🎯"}
              {s === "alfabetica" && "🔤"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
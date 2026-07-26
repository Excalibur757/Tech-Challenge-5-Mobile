// styles/home.styles.ts
import { StyleSheet } from "react-native";
import { ColorPalette } from "../app/context/AccessibilityContext";

export const createHomeStyles = (colors: ColorPalette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 40,
    color: colors.textLight,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: colors.text,
  },
  modeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  modeButtonText: {
    color: colors.headerText,
    fontWeight: "bold",
  },
  confirmationButton: {
    backgroundColor: colors.textLight,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  confirmationActive: {
    backgroundColor: colors.success,
  },
  confirmationButtonText: {
    color: colors.headerText,
    fontWeight: "600",
  },
  statsContainer: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsTitle: {
    fontWeight: "bold",
    marginBottom: 8,
    color: colors.text,
  },
  statsText: {
    color: colors.textSecondary,
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    backgroundColor: colors.input,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
  },
  addButton: {
    width: 55,
    height: 55,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginLeft: 10,
  },
  addButtonText: {
    color: colors.headerText,
    fontWeight: "bold",
  },
  prioritySelector: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    flexWrap: "wrap",
  },
  priorityLabel: {
    fontWeight: "bold",
    marginRight: 8,
    color: colors.textSecondary,
  },
  priorityOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginHorizontal: 4,
    backgroundColor: colors.backgroundSecondary,
  },
  priorityOptionActive: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  priorityOptionText: {
    fontWeight: "600",
    color: colors.text,
  },
  highPriority: {
    backgroundColor: colors.danger,
  },
  mediumPriority: {
    backgroundColor: colors.warning,
  },
  lowPriority: {
    backgroundColor: colors.success,
  },
  filterContainer: {
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: colors.input,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
    color: colors.text,
  },
  filterButtons: {
    flexDirection: "row",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.backgroundSecondary,
    marginRight: 8,
    marginBottom: 4,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    color: colors.text,
    fontWeight: "600",
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  sortLabel: {
    fontWeight: "bold",
    marginRight: 8,
    color: colors.textSecondary,
  },
  sortButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.backgroundSecondary,
    marginHorizontal: 4,
    marginBottom: 4,
  },
  sortButtonActive: {
    backgroundColor: colors.primary,
  },
  sortButtonText: {
    color: colors.text,
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: colors.textLight,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  taskArea: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 6,
    marginRight: 12,
    marginTop: 4,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  taskContent: {
    flex: 1,
  },
  taskText: {
    color: colors.text,
    flexWrap: "wrap",
  },
  taskCompleted: {
    textDecorationLine: "line-through",
    color: colors.textLight,
  },
  priorityIcon: {
    marginTop: 2,
  },
  taskDetails: {
    flexDirection: "row",
    marginTop: 4,
    flexWrap: "wrap",
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    marginRight: 4,
    marginBottom: 4,
  },
  priorityText: {
    color: colors.headerText,
    fontWeight: "bold",
  },
  subtaskCount: {
    color: colors.textLight,
    marginBottom: 4,
  },
  subtaskList: {
    marginTop: 8,
    marginLeft: 8,
  },
  subtaskItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  subtaskCheckbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 4,
    marginRight: 8,
  },
  subtaskText: {
    color: colors.textSecondary,
    flex: 1,
  },
  deleteSubtask: {
    color: colors.danger,
    fontWeight: "bold",
    paddingHorizontal: 8,
  },
  addSubtaskContainer: {
    marginTop: 12,
    marginLeft: 8,
    padding: 12,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
  },

  addSubtaskWrapper: {
    width: "100%",
    gap: 10,
  },

  addSubtaskInput: {
    width: "100%",
    backgroundColor: colors.input,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 48,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addSubtaskButton: {
    width: "100%",
    height: 46,
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  addSubtaskButtonDisabled: {
    opacity: 0.5,
  },

  addSubtaskButtonText: {
    color: colors.headerText,
    fontWeight: "600",
    fontSize: 15,
  },

  addSubtaskHint: {
    marginTop: 4,
    color: colors.textLight,
    fontSize: 12,
    lineHeight: 18,
    fontStyle: "italic",
  },
  notesInput: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 6,
    padding: 10,
    marginTop: 8,
    minHeight: 60,
    textAlignVertical: "top",
    color: colors.text,
  },
  editContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  editInput: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 8,
    minWidth: 100,
    color: colors.text,
  },
  saveText: {
    color: colors.success,
    fontWeight: "bold",
    marginRight: 8,
  },
  cancelText: {
    color: colors.textLight,
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  actionButton: {
    padding: 8,
  },
  actionText: {
    fontSize: 18,
  },
  deleteButton: {
    padding: 8,
  },
  deleteText: {
    fontSize: 18,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  completeAllButton: {
    backgroundColor: colors.success,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  clearButton: {
    backgroundColor: colors.danger,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionButtonText: {
    color: colors.headerText,
    fontWeight: "bold",
  },
  scrollContent: {
    paddingBottom: 30,
  },

  listWrapper: {
    flex: 1,
    minHeight: 200, // Altura mínima para a lista
  },
});
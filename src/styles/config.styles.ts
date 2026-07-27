// styles/config.styles.ts
import { StyleSheet } from "react-native";
import { ColorPalette } from "../context/AccessibilityContext";

export const createConfigStyles = (colors: ColorPalette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    color: colors.textSecondary,
    marginBottom: 8,
  },
  loadingSubtext: {
    color: colors.textLight,
  },
  header: {
    backgroundColor: colors.header,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  headerContent: {
    flex: 1,
    marginRight: 8,
  },
  headerTitle: {
    fontWeight: "bold",
    color: colors.headerText,
    marginBottom: 4,
  },
  headerSubtitle: {
    color: colors.headerText,
    opacity: 0.9,
    marginBottom: 4,
  },
  statusBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  statusText: {
    fontWeight: "bold",
  },
  statusSaved: {
    color: "#86EFAC",
  },
  statusUnsaved: {
    color: "#FCD34D",
  },
  successMessage: {
    backgroundColor: colors.success + "20",
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  successText: {
    color: colors.success,
    fontWeight: "bold",
  },
  successSubtext: {
    color: colors.textSecondary,
    marginTop: 4,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 10,
  },
  controlGroup: {
    marginBottom: 24,
  },
  controlHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  controlLabel: {
    fontWeight: "600",
    color: colors.textSecondary,
  },
  controlValue: {
    backgroundColor: colors.badge,
    color: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: "bold",
  },
  controlHint: {
    color: colors.textLight,
    marginTop: 6,
  },
  controlStatus: {
    color: colors.textSecondary,
    marginTop: 10,
    padding: 10,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  rangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginTop: -8,
  },
  rangeLabel: {
    color: colors.textLight,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  optionButton: {
    flex: 1,
    minWidth: "30%",
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: "center",
  },
  optionSmall: {
    minWidth: "45%",
  },
  optionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.badge,
  },
  optionText: {
    fontWeight: "600",
    color: colors.text,
  },
  optionSmallText: {
    fontWeight: "600",
    color: colors.text,
  },
  optionTextActive: {
    color: colors.primary,
  },
  optionDescription: {
    color: colors.textLight,
    marginTop: 2,
    textAlign: "center",
  },
  switchContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  switchOption: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: "center",
  },
  switchOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.badge,
  },
  switchOptionText: {
    fontWeight: "bold",
    color: colors.text,
  },
  switchDescription: {
    color: colors.textLight,
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    minWidth: "45%",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  resetButton: {
    backgroundColor: colors.textLight,
  },
  actionButtonText: {
    color: colors.headerText,
    fontWeight: "bold",
  },
  statusBar: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 16,
    marginBottom: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusBarText: {
    color: colors.textSecondary,
    marginBottom: 4,
    textAlign: "center",
  },
  statusBarHint: {
    color: colors.textLight,
    marginTop: 4,
    textAlign: "center",
  },
  resetTutorialButton: {
    backgroundColor: colors.danger || "#E74C3C",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  resetTutorialText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
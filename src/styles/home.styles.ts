import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    paddingHorizontal: 20,
    paddingTop: 60,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },

  input: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#DDD",
  },

  addButton: {
    width: 55,
    height: 55,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginLeft: 10,
  },

  addButtonText: {
    color: "#FFF",
    fontSize: 30,
    fontWeight: "bold",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#888",
    fontSize: 16,
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },

  taskArea: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#3B82F6",
    borderRadius: 6,
    marginRight: 15,
  },

  checkboxChecked: {
    backgroundColor: "#3B82F6",
  },

  taskText: {
    fontSize: 16,
    flexShrink: 1,
  },

  taskCompleted: {
    textDecorationLine: "line-through",
    color: "#999",
  },

  deleteButton: {
    marginLeft: 15,
  },

  deleteText: {
    color: "#EF4444",
    fontWeight: "bold",
  },
});
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    height: 75,
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    elevation: 5,
    zIndex: 100,
  },

  logo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2F80ED",
  },

  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },

  user: {
    fontSize: 16,
    marginRight: 8,
    fontWeight: "600",
  },

  button: {
    padding: 5,
  },

  dropdown: {
    position: "absolute",
    top: 50,
    right: 0,

    width: 190,

    backgroundColor: "#FFF",

    borderRadius: 10,

    elevation: 8,

    borderWidth: 1,
    borderColor: "#DDD",
  },

  item: {
    paddingVertical: 14,
    paddingHorizontal: 15,
  },

  itemText: {
    fontSize: 16,
    color: "#333",
  },

  logout: {
    color: "#D32F2F",
    fontWeight: "bold",
  },
});
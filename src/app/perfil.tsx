import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function PerfilScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text style={styles.label}>Nome</Text>
      <Text style={styles.value}>{user?.name || "Usuário"}</Text>
      <Text style={styles.label}>Usuário</Text>
      <Text style={styles.value}>{user?.username || "Sem usuário"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#111827",
  },
  label: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "600",
  },
});

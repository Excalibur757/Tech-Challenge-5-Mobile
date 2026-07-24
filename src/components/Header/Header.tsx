import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useRouter } from "expo-router";

import styles from "./Header.styles";

export default function Header() {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const userName = "João Silva";

  function navigate(path: "/" | "/home" | "/config" | "/perfil") {
    setOpen(false);
    router.push(path as any);
  }

  function logout() {
    setOpen(false);

    // Futuramente você limpa o token aqui

    router.replace("/");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>SeniorEase</Text>

      <View style={styles.rightContainer}>
        <Text style={styles.user}>{userName}</Text>

        <TouchableOpacity
          onPress={() => setOpen(!open)}
          style={styles.button}
        >
          <Ionicons
            name={open ? "chevron-up" : "chevron-down"}
            size={22}
            color="#333"
          />
        </TouchableOpacity>

        {open && (
          <View style={styles.dropdown}>
            <TouchableOpacity
              style={styles.item}
              onPress={() => navigate("/home")}
            >
              <Text style={styles.itemText}>Tela Inicial</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.item}
              onPress={() => navigate("/config")}
            >
              <Text style={styles.itemText}>Configurações</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.item}
              onPress={() => navigate("/perfil")}
            >
              <Text style={styles.itemText}>Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.item}
              onPress={logout}
            >
              <Text style={[styles.itemText, styles.logout]}>
                Sair
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
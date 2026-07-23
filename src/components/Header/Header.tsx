import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
// ALTERAÇÃO AQUI: Importação direta do novo pacote
import Ionicons from "@react-native-vector-icons/ionicons";

import styles from "./Header.styles";

export default function Header() {
  const [open, setOpen] = useState(false);

  const userName = "João Silva";

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
            <TouchableOpacity style={styles.item}>
              <Text style={styles.itemText}>Tela Inicial</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item}>
              <Text style={styles.itemText}>Configurações</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item}>
              <Text style={styles.itemText}>Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item}>
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
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";

type ProfileFormData = {
  name: string;
  username: string;
  password: string;
  phone: string;
  email: string;
};

export default function PerfilScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [originalData, setOriginalData] = useState<ProfileFormData>({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [wantChangePassword, setWantChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  useEffect(() => {
    if (user) {
      const nextData = {
        name: user.name,
        username: user.username,
        email: user.email ?? "",
        phone: user.phone ?? "",
        password: user.password,
      };
      setFormData(nextData);
      setOriginalData(nextData);
      setCurrentPassword("");
      setPasswordError("");
      setWantChangePassword(false);
    }
  }, [user]);

  useEffect(() => {
    if (!showSavedMessage) {
      return;
    }

    const timer = setTimeout(() => setShowSavedMessage(false), 2000);
    return () => clearTimeout(timer);
  }, [showSavedMessage]);

  const handleFieldChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "password") {
      setPasswordError("");
    }
  };

  const handleSave = async () => {
    if (!user) {
      return;
    }

    if (wantChangePassword && currentPassword !== user.password) {
      setPasswordError("A senha atual informada não confere.");
      return;
    }

    setIsSaving(true);
    const updates: Partial<Pick<ProfileFormData, "name" | "username" | "password" | "email" | "phone">> = {
      name: formData.name,
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
    };

    if (wantChangePassword) {
      updates.password = formData.password;
    }

    const ok = await updateProfile(updates);
    setIsSaving(false);

    if (ok) {
      setOriginalData({
        name: formData.name,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: wantChangePassword ? formData.password : user.password,
      });
      setCurrentPassword("");
      setWantChangePassword(false);
      setShowSavedMessage(true);
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    } else {
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    }
  };

  const handleRestore = () => {
    setFormData(originalData);
    setCurrentPassword("");
    setPasswordError("");
    setWantChangePassword(false);
  };

  const hasChanges =
    formData.name !== originalData.name ||
    formData.username !== originalData.username ||
    formData.email !== originalData.email ||
    formData.phone !== originalData.phone ||
    (wantChangePassword &&
        formData.password !== originalData.password);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Perfil do Usuário</Text>
          <Text style={styles.subtitle}>Atualize seus dados pessoais e informações de acesso.</Text>
        </View>

        <View style={styles.badgeRow}>
          {hasChanges ? (
            <View style={styles.pendingBadge}>
              <Text style={styles.badgeText}>⚠️ Alterações pendentes</Text>
            </View>
          ) : (
            <View style={styles.savedBadge}>
              <Text style={styles.badgeText}>✅ Salvo</Text>
            </View>
          )}
        </View>
      </View>

      {showSavedMessage ? (
        <View style={styles.successBox}>
          <Text style={styles.successText}>✅ Perfil atualizado com sucesso!</Text>
        </View>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Dados pessoais</Text>
        <Text style={styles.sectionSubtitle}>Atualize nome e usuário.</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome completo</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(value) => handleFieldChange("name", value)}
            placeholder="Digite seu nome"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Usuário</Text>
          <TextInput
            style={styles.input}
            value={formData.username}
            onChangeText={(value) => handleFieldChange("username", value)}
            placeholder="Digite seu usuário"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
        <Text style={styles.label}>Celular (opcional)</Text>
        <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(value) => handleFieldChange("phone", value)}
            placeholder="(11) 99999-9999"
            placeholderTextColor="#B8BDC7"
            keyboardType="phone-pad"
        />
        </View>

        <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail (opcional)</Text>
            <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(value) => handleFieldChange("email", value)}
                placeholder="Digite seu e-mail"
                placeholderTextColor="#B8BDC7"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
            />
            </View> 
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Segurança</Text>
        <Text style={styles.sectionSubtitle}>Você pode alterar sua senha quando quiser.</Text>

        <View style={styles.switchRow}>
          <Text style={styles.label}>Deseja alterar a senha?</Text>
          <View style={styles.switchButtons}>
            <TouchableOpacity
              style={[styles.switchButton, wantChangePassword && styles.switchButtonActive]}
              onPress={() => setWantChangePassword(true)}
            >
              <Text style={[styles.switchText, wantChangePassword && styles.switchTextActive]}>Sim</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.switchButton, !wantChangePassword && styles.switchButtonActive]}
              onPress={() => setWantChangePassword(false)}
            >
              <Text style={[styles.switchText, !wantChangePassword && styles.switchTextActive]}>Não</Text>
            </TouchableOpacity>
          </View>
        </View>

        {wantChangePassword ? (
          <View style={{ gap: 12 }}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha atual</Text>
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Digite a senha atual"
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nova senha</Text>
              <TextInput
                style={styles.input}
                value={formData.password}
                onChangeText={(value) => handleFieldChange("password", value)}
                placeholder="Digite uma nova senha"
                secureTextEntry
              />
            </View>

            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          </View>
        ) : null}
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleSave} disabled={isSaving}>
          {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Salvar alterações</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={handleRestore}>
          <Text style={styles.secondaryButtonText}>Restaurar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statusBox}>
        <Text style={styles.statusText}>
          {hasChanges ? "Há alterações não salvas no seu perfil." : "Seu perfil está atualizado."}
        </Text>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/home")}>
        <Text style={styles.backButtonText}>← Voltar para a tela inicial</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  headerCard: {
    backgroundColor: "#1f2937",
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: {
    color: "#d1d5db",
    fontSize: 13,
    marginTop: 6,
  },
  badgeRow: {
    marginLeft: 12,
  },
  savedBadge: {
    backgroundColor: "#10b981",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pendingBadge: {
    backgroundColor: "#f59e0b",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  successBox: {
    backgroundColor: "#dcfce7",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  successText: {
    color: "#166534",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#111827",
  },
  switchRow: {
    marginBottom: 10,
  },
  switchButtons: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  switchButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#e5e7eb",
  },
  switchButtonActive: {
    backgroundColor: "#111827",
  },
  switchText: {
    color: "#374151",
    fontWeight: "600",
  },
  switchTextActive: {
    color: "#fff",
  },
  errorText: {
    color: "#dc2626",
    fontSize: 13,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
    marginBottom: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#111827",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#e5e7eb",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#111827",
    fontWeight: "700",
  },
  statusBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  statusText: {
    color: "#374151",
    fontSize: 14,
  },
  backButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  backButtonText: {
    color: "#2563eb",
    fontWeight: "600",
  },
});

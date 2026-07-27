import { useEffect, useReducer, useState } from "react";
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
import { blue } from "react-native-reanimated/lib/typescript/Colors";

type ProfileFormData = {
  name: string;
  username: string;
  password: string;
  email: string;
  phone: string;
};

type ProfileState = {
  formData: ProfileFormData;
  originalData: ProfileFormData;
  currentPassword: string;
  passwordError: string;
  wantChangePassword: boolean;
};

type ProfileAction =
  | { type: 'SET_USER_DATA'; payload: { name: string; username: string; password: string; email: string; phone: string } }
  | { type: 'UPDATE_FIELD'; field: keyof ProfileFormData; value: string }
  | { type: 'SET_PASSWORD_ERROR'; error: string }
  | { type: 'CLEAR_PASSWORD_ERROR' }
  | { type: 'TOGGLE_CHANGE_PASSWORD'; value: boolean }
  | { type: 'SET_CURRENT_PASSWORD'; value: string }
  | { type: 'SAVE_SUCCESS'; payload: { name: string; username: string; password: string; email: string; phone: string } }
  | { type: 'RESTORE' }
  | { type: 'RESET' };

const initialState: ProfileState = {
  formData: { name: "", username: "", password: "", email: "", phone: "" },
  originalData: { name: "", username: "", password: "", email: "", phone: "" },
  currentPassword: "",
  passwordError: "",
  wantChangePassword: false
};

function profileReducer(state: ProfileState, action: ProfileAction): ProfileState {
  switch (action.type) {
    case 'SET_USER_DATA':
      const nextData = {
        name: action.payload.name,
        username: action.payload.username,
        password: action.payload.password,
        email: action.payload.email,
        phone: action.payload.phone
      };
      // Verifica se os dados são iguais para evitar re-renderização
      const isSameData = 
        state.formData.name === nextData.name &&
        state.formData.username === nextData.username &&
        state.formData.password === nextData.password &&
        state.formData.email === nextData.email &&
        state.formData.phone === nextData.phone;
      
      if (isSameData) {
        return state;
      }
      
      return {
        ...state,
        formData: nextData,
        originalData: nextData,
        currentPassword: "",
        passwordError: "",
        wantChangePassword: false
      };
      
    case 'UPDATE_FIELD':
      return {
        ...state,
        formData: { ...state.formData, [action.field]: action.value },
        passwordError: action.field === "password" ? "" : state.passwordError
      };
      
    case 'SET_PASSWORD_ERROR':
      return { ...state, passwordError: action.error };
      
    case 'CLEAR_PASSWORD_ERROR':
      return { ...state, passwordError: "" };
      
    case 'TOGGLE_CHANGE_PASSWORD':
      return { ...state, wantChangePassword: action.value };
      
    case 'SET_CURRENT_PASSWORD':
      return { ...state, currentPassword: action.value };
      
    case 'SAVE_SUCCESS':
      return {
        ...state,
        originalData: {
          name: action.payload.name,
          username: action.payload.username,
          password: action.payload.password,
          email: action.payload.email,
          phone: action.payload.phone
        },
        currentPassword: "",
        wantChangePassword: false
      };
      
    case 'RESTORE':
      return {
        ...state,
        formData: state.originalData,
        currentPassword: "",
        passwordError: "",
        wantChangePassword: false
      };
      
    case 'RESET':
      return {
        ...state,
        formData: state.originalData,
        currentPassword: "",
        passwordError: "",
        wantChangePassword: false
      };
      
    default:
      return state;
  }
}

export default function PerfilScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  
  // ✅ Usando useReducer com inicialização lazy
  const [state, dispatch] = useReducer(
    profileReducer,
    undefined,
    () => {
      if (user) {
        const nextData = {
          name: user.name,
          username: user.username,
          password: user.password,
          email: user.email ?? "",
          phone: user.phone ?? ""
        };
        return {
          formData: nextData,
          originalData: nextData,
          currentPassword: "",
          passwordError: "",
          wantChangePassword: false
        };
      }
      return initialState;
    }
  );

  const [isSaving, setIsSaving] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  // ✅ Effect para sincronizar com o user - agora usando dispatch (que é estável)
  useEffect(() => {
    if (user) {
      dispatch({
        type: 'SET_USER_DATA',
        payload: {
          name: user.name,
          username: user.username,
          password: user.password,
          email: user.email ?? "",
          phone: user.phone ?? "",
        }
      });
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
    dispatch({ type: 'UPDATE_FIELD', field, value });
  };

  const handleSave = async () => {
    if (!user) {
      return;
    }

    if (state.wantChangePassword && state.currentPassword !== user.password) {
      dispatch({ type: 'SET_PASSWORD_ERROR', error: "A senha atual informada não confere." });
      return;
    }

    setIsSaving(true);
    const updates: Partial<Pick<ProfileFormData, "name" | "username" | "password" | "email" | "phone">> = {
      name: state.formData.name,
      username: state.formData.username,
      email: state.formData.email,
      phone: state.formData.phone,
    };

    if (state.wantChangePassword) {
      updates.password = state.formData.password;
    }

    const ok = await updateProfile(updates);
    setIsSaving(false);

    if (ok) {
      dispatch({
        type: 'SAVE_SUCCESS',
        payload: {
          name: state.formData.name,
          username: state.formData.username,
          password: state.wantChangePassword ? state.formData.password : user.password,
          email: state.formData.email,
          phone: state.formData.phone
        }
      });
      setShowSavedMessage(true);
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    } else {
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    }
  };

  const handleRestore = () => {
    dispatch({ type: 'RESTORE' });
  };

  const hasChanges =
    state.formData.email !== state.originalData.email ||
    state.formData.phone !== state.originalData.phone ||
    state.formData.name !== state.originalData.name ||
    state.formData.username !== state.originalData.username ||
    (state.wantChangePassword && state.formData.password !== state.originalData.password);

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
            value={state.formData.name}
            onChangeText={(value) => handleFieldChange("name", value)}
            placeholder="Digite seu nome"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Usuário</Text>
          <TextInput
            style={styles.input}
            value={state.formData.username}
            onChangeText={(value) => handleFieldChange("username", value)}
            placeholder="Digite seu usuário"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-mail (opcional)</Text>
          <TextInput
            style={styles.input}
            value={state.formData.email}
            onChangeText={(value) => handleFieldChange("email", value)}
            placeholder="Digite seu e-mail"
            placeholderTextColor="#cacaca"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Celular (opcional)</Text>
          <TextInput
            style={styles.input}
            value={state.formData.phone}
            onChangeText={(value) => handleFieldChange("phone", value)}
            placeholderTextColor="#cacaca"
            placeholder="(11) 99999-9999"
            keyboardType="phone-pad"
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
              style={[styles.switchButton, state.wantChangePassword && styles.switchButtonActive]}
              onPress={() => dispatch({ type: 'TOGGLE_CHANGE_PASSWORD', value: true })}
            >
              <Text style={[styles.switchText, state.wantChangePassword && styles.switchTextActive]}>Sim</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.switchButton, !state.wantChangePassword && styles.switchButtonActive]}
              onPress={() => dispatch({ type: 'TOGGLE_CHANGE_PASSWORD', value: false })}
            >
              <Text style={[styles.switchText, !state.wantChangePassword && styles.switchTextActive]}>Não</Text>
            </TouchableOpacity>
          </View>
        </View>

        {state.wantChangePassword ? (
          <View style={{ gap: 12 }}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha atual</Text>
              <TextInput
                style={styles.input}
                value={state.currentPassword}
                onChangeText={(value) => dispatch({ type: 'SET_CURRENT_PASSWORD', value })}
                placeholder="Digite a senha atual"
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nova senha</Text>
              <TextInput
                style={styles.input}
                value={state.formData.password}
                onChangeText={(value) => handleFieldChange("password", value)}
                placeholder="Digite uma nova senha"
                secureTextEntry
              />
            </View>

            {state.passwordError ? <Text style={styles.errorText}>{state.passwordError}</Text> : null}
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
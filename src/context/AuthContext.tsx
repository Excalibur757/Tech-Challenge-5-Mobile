import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  id: string;
  name: string;
  username: string;
  password: string;
  createdAt: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<boolean>;
  signUp: (name: string, username: string, password: string) => Promise<boolean>;
  updateProfile: (updates: Partial<Pick<User, "name" | "username" | "password">>) => Promise<boolean>;
  signOut: () => Promise<void>;
};

const USERS_STORAGE_KEY = "@senior-ease-users";
const CURRENT_USER_STORAGE_KEY = "@senior-ease-current-user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const savedUser = await AsyncStorage.getItem(CURRENT_USER_STORAGE_KEY);
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.warn("Erro ao carregar sessão do usuário", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  // ✅ Envolvendo com useCallback para evitar recriação desnecessária
  const signIn = useCallback(async (username: string, password: string) => {
    try {
      const storedUsers = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

      const foundUser = users.find(
        (item) =>
          item.username.toLowerCase() === username.trim().toLowerCase() &&
          item.password === password
      );

      if (!foundUser) {
        return false;
      }

      await AsyncStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(foundUser));
      setUser(foundUser);
      return true;
    } catch (error) {
      console.warn("Erro ao fazer login", error);
      return false;
    }
  }, []);

  // ✅ Envolvendo com useCallback para evitar recriação desnecessária
  const signUp = useCallback(async (name: string, username: string, password: string) => {
    if (!name.trim() || !username.trim() || !password.trim()) {
      return false;
    }

    try {
      const storedUsers = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

      const alreadyExists = users.some(
        (item) => item.username.toLowerCase() === username.trim().toLowerCase()
      );

      if (alreadyExists) {
        return false;
      }

      const newUser: User = {
        id: Date.now().toString(),
        name: name.trim(),
        username: username.trim().toLowerCase(),
        password,
        createdAt: new Date().toISOString(),
      };

      const nextUsers = [...users, newUser];
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(nextUsers));
      await AsyncStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);
      return true;
    } catch (error) {
      console.warn("Erro ao criar conta", error);
      return false;
    }
  }, []);

  // ✅ Envolvendo com useCallback para evitar recriação desnecessária
  const updateProfile = useCallback(async (updates: Partial<Pick<User, "name" | "username" | "password">>) => {
    if (!user) {
      return false;
    }

    try {
      const storedUsers = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

      const normalizedName = updates.name?.trim() ?? user.name;
      const normalizedUsername = (updates.username?.trim() ?? user.username).toLowerCase();
      const normalizedPassword = updates.password ?? user.password;

      if (!normalizedName || !normalizedUsername || !normalizedPassword) {
        return false;
      }

      const duplicate = users.some(
        (item) => item.id !== user.id && item.username.toLowerCase() === normalizedUsername
      );

      if (duplicate) {
        return false;
      }

      const updatedUser: User = {
        ...user,
        name: normalizedName,
        username: normalizedUsername,
        password: normalizedPassword,
      };

      const nextUsers = users.map((item) => (item.id === user.id ? updatedUser : item));
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(nextUsers));
      await AsyncStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.warn("Erro ao atualizar perfil", error);
      return false;
    }
  }, [user]); // ✅ Dependência: user

  // ✅ Envolvendo com useCallback para evitar recriação desnecessária
  const signOut = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.warn("Erro ao sair", error);
    }
  }, []);

  // ✅ Corrigindo o useMemo com todas as dependências
  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      signIn,
      signUp,
      updateProfile,
      signOut,
    }),
    [user, isLoading, signIn, signUp, updateProfile, signOut] // ✅ Todas as dependências incluídas
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
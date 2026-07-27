import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AccessibilityProvider } from "../context/AccessibilityContext";
import { AuthProvider } from "../context/AuthContext";
import Header from "../components/Header/Header";
import { View } from "react-native";

export default function RootLayout() {
  return (
    <AuthProvider>
      <AccessibilityProvider>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: "#F4F4F4" }}>
            <Header />
            <View style={{ flex: 1 }}>
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: "slide_from_right",
                }}
              />
            </View>
          </SafeAreaView>
        </SafeAreaProvider>
      </AccessibilityProvider>
    </AuthProvider>
  );
}
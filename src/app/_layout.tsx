import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AccessibilityProvider } from "../context/AccessibilityContext";
import { AuthProvider } from "../context/AuthContext";
import Header from "../components/Header/Header";
import BackgroundContainer from "../components/BackgroundContainer";
import { View } from "react-native";

// Fundo global para as telas principais.
const globalBackground = require("../imagens/capaLogin.png");

export default function RootLayout() {
  return (
    <AuthProvider>
      <AccessibilityProvider>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: "#F4F4F4" }}>
            <Header />
            <View style={{ flex: 1 }}>
              <BackgroundContainer image={globalBackground} style={{ flex: 1 }}>
                <Stack
                  screenOptions={{
                    headerShown: false,
                    animation: "slide_from_right",
                  }}
                />
              </BackgroundContainer>
            </View>
          </SafeAreaView>
        </SafeAreaProvider>
      </AccessibilityProvider>
    </AuthProvider>
  );
}
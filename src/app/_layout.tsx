// app/_layout.tsx
import { Stack } from "expo-router";
import { View, SafeAreaView } from "react-native";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import Header from "../components/Header/Header";

export default function RootLayout() {
  return (
    <AccessibilityProvider>
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
    </AccessibilityProvider>
  );
}
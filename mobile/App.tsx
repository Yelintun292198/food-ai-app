// App.tsx
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";

import AppNavigator from "./navigation/AppNavigator";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { TextSizeProvider } from "./context/TextSizeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { Colors } from "./constants/colors";

// ==============================
// Sync navigation theme with app theme
// ==============================
function ThemedNavigation() {
  const { isDark } = useTheme();
  const baseTheme = isDark ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer
      theme={{
        ...baseTheme,
        colors: {
          ...baseTheme.colors,
          background: isDark
            ? Colors.dark.background
            : Colors.light.background,
          card: isDark ? Colors.dark.card : Colors.light.card,
          text: isDark ? Colors.dark.text : Colors.light.text,
          border: isDark ? Colors.dark.border : Colors.light.border,
          primary: "#FF7043",
        },
      }}
    >
      <AppNavigator />
    </NavigationContainer>
  );
}

// ==============================
// App Root
// ==============================
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <TextSizeProvider>
          <LanguageProvider>
            <ThemedNavigation />
          </LanguageProvider>
        </TextSizeProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

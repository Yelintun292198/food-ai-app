// App.tsx
import React from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";

import AppNavigator from "./navigation/AppNavigator";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { TextSizeProvider } from "./context/TextSizeContext";
import { Colors } from "./constants/colors";

// Sync navigation theme with custom theme
function ThemedNavigation() {
  const { isDark } = useTheme();

  // Keep internal fonts (regular, medium, bold)
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

export default function App() {
  return (
    <ThemeProvider>
      <TextSizeProvider>
        <ThemedNavigation />
      </TextSizeProvider>
    </ThemeProvider>
  );
}

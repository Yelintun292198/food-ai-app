// components/GlobalWrapper.tsx
import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { Colors } from "../constants/colors";

export default function GlobalWrapper({ children }) {
  const { isDark } = useTheme();
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});

import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { theme } from "../constants/theme";

// 🧱 Global beige background wrapper for all screens
export default function GlobalWrapper({ children }) {
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
});

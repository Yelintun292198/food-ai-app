// 🧱 components/GlobalWrapper.tsx
import React from "react";
import { StyleSheet, View } from "react-native";

export default function GlobalWrapper({ children }) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA", // 🌿 soft global background
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});

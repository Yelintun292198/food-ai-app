import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../constants/theme";

// 🫧 Liquid Glassmorphism Card
export default function LiquidGlassCard({ children, height = 180 }) {
  return (
    <View style={[styles.cardContainer, { height }]}>
      {/* background blur */}
      <BlurView intensity={90} tint="light" style={StyleSheet.absoluteFill} />

      {/* gradient reflection overlay */}
      <LinearGradient
        colors={["#ffffff10", "#ffffff05", "#00000015"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 25,
    overflow: "hidden",
    backgroundColor: "#ffffff20",
    borderWidth: 1,
    borderColor: "#ffffff30",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    marginVertical: theme.spacing.md,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
    justifyContent: "center",
  },
});

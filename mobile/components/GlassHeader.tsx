import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../constants/theme";
import { useNavigation } from "@react-navigation/native";

// 🪟 Apple-style translucent header (fixed at top)
export default function GlassHeader({ showBack = false }) {
  const navigation = useNavigation();

  return (
    <BlurView intensity={60} tint="light" style={styles.header}>
      <View style={styles.row}>
        {showBack ? (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons
              name="chevron-back"
              size={26}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 32 }} /> // placeholder for layout balance
        )}

        <Text style={styles.title}>🍱 Food AI</Text>

        <View style={{ width: 32 }} /> {/* keep symmetry */}
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 70,
    paddingTop: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: theme.spacing.md,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: theme.fontSize.title,
    fontWeight: "bold",
    color: theme.colors.text,
  },
});

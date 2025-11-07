import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // 🆕 For consistent icon set

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      {/* 🧠 Header */}
      <Text style={styles.header}>🍱 Food AI アプリ</Text>
      <Text style={styles.subText}>AIが料理を認識してレシピを見つけます</Text>

      {/* 🖼️ App Logo */}
      <Image
        source={require("../assets/images/icon.png")}
        style={styles.logo}
      />

      {/* 🆕 Modern navigation buttons (same style as preview.tsx) */}
      <TouchableOpacity
        style={[styles.button, styles.blueBtn]}
        onPress={() => navigation.navigate("プレビュー画面")}
      >
        <Ionicons name="camera" size={22} color="#fff" />
        <Text style={styles.btnText}>画像を選択して分析</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.orangeBtn]}
        onPress={() => navigation.navigate("お気に入り画面")}
      >
        <Ionicons name="heart" size={22} color="#fff" />
        <Text style={styles.btnText}>お気に入り</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.greenBtn]}
        onPress={() => navigation.navigate("履歴画面")}
      >
        <Ionicons name="time" size={22} color="#fff" />
        <Text style={styles.btnText}>履歴</Text>
      </TouchableOpacity>

      {/* 🆕 Footer section for consistency */}
      <Text style={styles.footerText}>© 2025 SmartChef AI Project</Text>
    </View>
  );
}

// ===========================================================
// 🎨 Styles — unified with preview.tsx
// ===========================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 70,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 25,
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: "contain",
    marginBottom: 30,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    paddingVertical: 14,
    borderRadius: 30,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  blueBtn: {
    backgroundColor: "#007AFF",
  },
  orangeBtn: {
    backgroundColor: "#FF6347",
  },
  greenBtn: {
    backgroundColor: "#34C759",
  },
  footerText: {
    position: "absolute",
    bottom: 20,
    fontSize: 12,
    color: "#aaa",
  },
});

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App";

export default function HomeScreen() {
  // ✅ React Navigation hook
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ホーム画面</Text>

      {/* 撮影する */}
      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={() => navigation.navigate("プレビュー画面")}
      >
        <Text style={styles.primaryText}>撮影する</Text>
      </TouchableOpacity>

      {/* ギャラリーから選択 */}
      <TouchableOpacity
        style={styles.secondaryBtn}
        onPress={() => navigation.navigate("プレビュー画面")}
      >
        <Text style={styles.secondaryText}>ギャラリーから選択</Text>
      </TouchableOpacity>

      {/* 下のナビ */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => navigation.navigate("履歴画面")}
        >
          <Text style={styles.navText}>履歴</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => navigation.navigate("お気に入り画面")}
        >
          <Text style={styles.navText}>お気に入り</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 40 },
  primaryBtn: {
    backgroundColor: "#000",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginBottom: 20,
  },
  primaryText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  secondaryBtn: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginBottom: 40,
  },
  secondaryText: { color: "#000", fontSize: 16 },
  bottomNav: { position: "absolute", bottom: 30, flexDirection: "row", gap: 40 },
  navBtn: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  navText: { fontSize: 14 },
});

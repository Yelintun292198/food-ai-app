import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App"; // ✅ correct path for your structure

export default function ResultScreen() {
  // ✅ Use React Navigation instead of expo-router
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>結果画面</Text>
      <Text style={styles.subtitle}>推定された料理名: ○○</Text>

      <Text style={styles.listTitle}>Top-5候補:</Text>
      {["カレーライス", "ラーメン", "寿司", "天ぷら", "うどん"].map((item, i) => (
        <View key={i} style={styles.listItem}>
          <Text style={styles.num}>{i + 1}</Text>
          <Text style={styles.item}>{item}</Text>
        </View>
      ))}

      {/* ✅ Go to the recipe screen safely */}
      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={() => navigation.navigate("レシピ画面")}
      >
        <Text style={styles.primaryText}>レシピを見る</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 50,
    backgroundColor: "#fff",
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 20 },
  listTitle: { fontWeight: "bold", marginBottom: 10 },
  listItem: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  num: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#000",
    color: "#fff",
    textAlign: "center",
    lineHeight: 28,
    marginRight: 10,
  },
  item: { fontSize: 16 },
  primaryBtn: {
    marginTop: 20,
    backgroundColor: "#000",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 25,
  },
  primaryText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

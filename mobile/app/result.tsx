import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App";

// 👇 Type definition for this route
type ResultScreenRouteProp = RouteProp<RootStackParamList, "結果画面">;

export default function ResultScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ResultScreenRouteProp>();

  // ✅ Get result data safely (with defaults)
  const result = route.params?.result || {
    predicted_food: "不明",
    confidence: 0,
    top3: [],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍣 結果画面</Text>

      {/* ✅ Show predicted dish name */}
      <Text style={styles.subtitle}>
        推定された料理名: {result.predicted_food}
      </Text>

      {/* ✅ Show confidence percentage */}
      <Text style={styles.confidence}>
        確信度: {Math.round((result.confidence || 0) * 100)}%
      </Text>

      {/* ✅ Show Top-3 predictions dynamically */}
      {result.top3 && result.top3.length > 0 && (
        <>
          <Text style={styles.listTitle}>Top-3候補:</Text>
          {result.top3.map((item: any, i: number) => (
            <View key={i} style={styles.listItem}>
              <Text style={styles.num}>{i + 1}</Text>
              <Text style={styles.item}>
                {item.label} ({(item.score * 100).toFixed(2)}%)
              </Text>
            </View>
          ))}
        </>
      )}

      {/* ✅ Button: Go to recipe screen with correct food name */}
      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={() =>
          navigation.navigate("レシピ画面", {
            foodName: result.predicted_food, // ✅ send correct key
          })
        }
      >
        <Text style={styles.primaryText}>レシピを見る</Text>
      </TouchableOpacity>

      {/* ✅ Back to home */}
      <TouchableOpacity
        style={styles.secondaryBtn}
        onPress={() => navigation.navigate("ホーム画面")}
      >
        <Text style={styles.secondaryText}>ホームに戻る</Text>
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  confidence: {
    fontSize: 16,
    color: "gray",
    marginBottom: 20,
  },
  listTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
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
  item: {
    fontSize: 16,
  },
  primaryBtn: {
    marginTop: 30,
    backgroundColor: "#000",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 25,
  },
  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryBtn: {
    marginTop: 15,
  },
  secondaryText: {
    color: "#007AFF",
    fontSize: 15,
  },
});

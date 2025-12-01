import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App";

type ResultScreenRouteProp = RouteProp<RootStackParamList, "結果画面">;

export default function ResultScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ResultScreenRouteProp>();

  const result = route.params?.result;

  console.log("📌 RESULT FROM BACKEND =", result);

  if (!result) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>データがありません</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>🔍 AI分析結果</Text>
      <Text style={styles.subText}>AIが検出した料理の情報です</Text>

      <View style={styles.card}>
        <Ionicons name="restaurant" size={24} color="#FF6347" />
        <Text style={styles.mainFood}>
          {result.predicted_food_jp || result.predicted_food_en}
        </Text>
      </View>

      <View style={styles.confidenceBox}>
        <Ionicons name="speedometer" size={22} color="#007AFF" />
        <Text style={styles.confidenceText}>
          確信度：{Math.round((result.confidence || 0) * 100)}%
        </Text>
      </View>

      {/* BUTTON: GO TO RECIPE SCREEN */}
      <TouchableOpacity
        style={[styles.button, styles.orangeBtn]}
        onPress={() => {
          if (!result.recipe) {
            alert("レシピが見つかりませんでした。");
            return;
          }

          navigation.navigate("レシピ画面", {
            recipe: result.recipe,
            fallbackImage: result.image,
          });
        }}
      >
        <Ionicons name="book" size={20} color="#fff" />
        <Text style={styles.btnText}>レシピを見る</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.blueBtn]}
        onPress={() => navigation.navigate("ホーム画面")}
      >
        <Ionicons name="home" size={20} color="#fff" />
        <Text style={styles.btnText}>ホームに戻る</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>© 2025 SmartChef AI Project</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 6 },
  subText: { fontSize: 14, color: "#666", marginBottom: 20 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 20,
    padding: 16,
    width: "90%",
    marginBottom: 15,
  },
  mainFood: { fontSize: 20, fontWeight: "bold", marginLeft: 10 },

  confidenceBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eef6ff",
    borderRadius: 20,
    padding: 12,
    width: "85%",
    marginBottom: 20,
  },
  confidenceText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
    marginLeft: 8,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "85%",
    paddingVertical: 12,
    borderRadius: 30,
    marginVertical: 8,
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600", marginLeft: 8 },
  orangeBtn: { backgroundColor: "#FF6347" },
  blueBtn: { backgroundColor: "#007AFF" },

  footer: { position: "absolute", bottom: 15, fontSize: 12, color: "#aaa" },
  error: { fontSize: 18, color: "red" },
});

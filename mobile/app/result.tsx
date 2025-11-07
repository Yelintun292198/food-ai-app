import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // 🆕 For consistent icons
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App";

// 👇 Type definition (unchanged)
type ResultScreenRouteProp = RouteProp<RootStackParamList, "結果画面">;

export default function ResultScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ResultScreenRouteProp>();

  // ✅ Get result data safely
  const result = route.params?.result || {
    predicted_food: "不明",
    confidence: 0,
    top3: [],
  };

  // ===========================================================
  // 🧱 Modern Professional UI (same design system as other screens)
  // ===========================================================
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>🔍 AI分析結果</Text>
      <Text style={styles.subText}>AIが検出した料理の情報です</Text>

      {/* 🧠 Predicted Food Name */}
      <View style={styles.card}>
        <Ionicons name="restaurant" size={24} color="#FF6347" />
        <Text style={styles.mainFood}>{result.predicted_food}</Text>
      </View>

      {/* 🧮 Confidence */}
      <View style={styles.confidenceBox}>
        <Ionicons name="speedometer" size={22} color="#007AFF" />
        <Text style={styles.confidenceText}>
          確信度：{Math.round((result.confidence || 0) * 100)}%
        </Text>
      </View>

      {/* 🧩 Top-3 Predictions */}
      {result.top3 && result.top3.length > 0 && (
        <View style={styles.topBox}>
          <Text style={styles.topTitle}>Top-3 候補</Text>
          {result.top3.map((item: any, i: number) => (
            <View key={i} style={styles.topItem}>
              <View style={styles.rankCircle}>
                <Text style={styles.rankText}>{i + 1}</Text>
              </View>
              <Text style={styles.topLabel}>
                {item.label}（{(item.score * 100).toFixed(1)}%）
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* 🧭 Navigation Buttons */}
      <TouchableOpacity
        style={[styles.button, styles.orangeBtn]}
        onPress={() =>
          navigation.navigate("レシピ画面", {
            foodName: result.predicted_food,
          })
        }
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

      {/* 🆕 Footer */}
      <Text style={styles.footer}>© 2025 SmartChef AI Project</Text>
    </ScrollView>
  );
}

// ===========================================================
// 🎨 Styles — unified with home.tsx & preview.tsx
// ===========================================================
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 6,
  },
  subText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 20,
    padding: 16,
    width: "90%",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  mainFood: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
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
  topBox: {
    backgroundColor: "#fffaf3",
    width: "90%",
    padding: 16,
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  topTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#FF6347",
  },
  topItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  rankCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FF6347",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  rankText: { color: "#fff", fontWeight: "bold" },
  topLabel: { fontSize: 16 },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "85%",
    paddingVertical: 12,
    borderRadius: 30,
    marginVertical: 8,
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  orangeBtn: {
    backgroundColor: "#FF6347",
    shadowColor: "#FF6347",
  },
  blueBtn: {
    backgroundColor: "#007AFF",
    shadowColor: "#007AFF",
  },
  footer: {
    position: "absolute",
    bottom: 15,
    fontSize: 12,
    color: "#aaa",
  },
});

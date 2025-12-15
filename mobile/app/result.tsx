import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useTheme } from "../context/ThemeContext";
import { Colors } from "../constants/colors";
import { useTextSize } from "../context/TextSizeContext";

import type { RootStackParamList } from "../App";

type ResultScreenRouteProp = RouteProp<RootStackParamList, "Result">;

export default function ResultScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const route = useRoute<ResultScreenRouteProp>();
  const result = route.params?.result;

  const { isDark } = useTheme();
  const theme = isDark ? Colors.dark : Colors.light;
  const { fontSize } = useTextSize();

  console.log("📌 RESULT =", result);

  // -------------------------------------------
  // ❌ No data
  // -------------------------------------------
  if (!result) {
    return (
      <View
        style={[
          styles.errorContainer,
          { backgroundColor: theme.background },
        ]}
      >
        <Text style={[styles.error, { color: theme.text, fontSize }]}>
          データがありません
        </Text>
      </View>
    );
  }

  // -------------------------------------------
  // ✅ FIXED NAVIGATION
  // -------------------------------------------
  const openRecipe = () => {
    if (!result.recipe) {
      Alert.alert("エラー", "レシピが見つかりませんでした。");
      return;
    }

    console.log("➡️ Open Recipe:", result.recipe?.name_jp);

    navigation.navigate("Recipe", {
      recipe: result.recipe,       // ✅ always pass scanned recipe
      recipeName: undefined,        // 🔥 clear Home-based recipe
      _ts: Date.now(),              // 🔥 force screen refresh
    });
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      {/* HEADER */}
      <Text
        style={[
          styles.header,
          { color: theme.text, fontSize: fontSize + 6 },
        ]}
      >
        🔍 AI分析結果
      </Text>

      <Text
        style={[
          styles.subText,
          { color: isDark ? "#bbb" : "#666", fontSize: fontSize - 1 },
        ]}
      >
        AIが検出した料理の情報です
      </Text>

      {/* FOOD CARD */}
      <View
        style={[
          styles.card,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <Ionicons name="restaurant" size={24} color="#FF6347" />
        <Text
          style={[
            styles.mainFood,
            { color: theme.text, fontSize: fontSize + 4 },
          ]}
        >
          {result.predicted_food_jp || result.predicted_food_en}
        </Text>
      </View>

      {/* CONFIDENCE */}
      <View
        style={[
          styles.confidenceBox,
          {
            backgroundColor: isDark ? "#1a2530" : "#eef6ff",
            borderColor: isDark ? "#334" : "#cde2ff",
          },
        ]}
      >
        <Ionicons name="speedometer" size={22} color="#007AFF" />
        <Text
          style={[
            styles.confidenceText,
            { color: "#007AFF", fontSize: fontSize + 1 },
          ]}
        >
          確信度：{Math.round((result.confidence || 0) * 100)}%
        </Text>
      </View>

      {/* RECIPE BUTTON */}
      <TouchableOpacity
        style={[styles.button, styles.orangeBtn]}
        onPress={openRecipe}
      >
        <Ionicons name="book" size={20} color="#fff" />
        <Text style={[styles.btnText, { fontSize: fontSize + 1 }]}>
          レシピを見る
        </Text>
      </TouchableOpacity>

      {/* HOME BUTTON */}
      <TouchableOpacity
        style={[styles.button, styles.blueBtn]}
        onPress={() => navigation.navigate("Home")}
      >
        <Ionicons name="home" size={20} color="#fff" />
        <Text style={[styles.btnText, { fontSize: fontSize + 1 }]}>
          ホームに戻る
        </Text>
      </TouchableOpacity>

      {/* FOOTER */}
      <Text
        style={[
          styles.footer,
          { color: isDark ? "#777" : "#aaa", fontSize: fontSize - 2 },
        ]}
      >
        © 2025 SmartChef AI Project
      </Text>
    </ScrollView>
  );
}

// -------------------------------------------
// Styles
// -------------------------------------------
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },

  header: { fontWeight: "bold", marginBottom: 6 },
  subText: { marginBottom: 20 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    padding: 16,
    width: "90%",
    borderWidth: 1,
    marginBottom: 15,
  },

  mainFood: { fontWeight: "bold", marginLeft: 10 },

  confidenceBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    padding: 12,
    width: "85%",
    borderWidth: 1,
    marginBottom: 20,
  },

  confidenceText: {
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

  btnText: { color: "#fff", fontWeight: "600", marginLeft: 8 },

  orangeBtn: { backgroundColor: "#FF6347" },
  blueBtn: { backgroundColor: "#007AFF" },

  footer: { position: "absolute", bottom: 15 },

  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  error: { fontWeight: "bold" },
});

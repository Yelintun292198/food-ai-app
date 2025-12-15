import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import GlobalWrapper from "../components/GlobalWrapper";
import TypingText from "../components/TypingText";

import { useTheme } from "../context/ThemeContext";
import { Colors } from "../constants/colors";
import { useTextSize } from "../context/TextSizeContext";

const API_URL = "https://cautiously-mesocratic-albert.ngrok-free.dev";

export default function RecipeScreen({ route }) {
  const navigation = useNavigation<any>();

  const { isDark } = useTheme();
  const theme = isDark ? Colors.dark : Colors.light;
  const { fontSize } = useTextSize();

  const recipeFromResult = route?.params?.recipe;
  const recipeName = route?.params?.recipeName;

  // ----------------------------------
  // Normalize recipe
  // ----------------------------------
  const normalizeRecipe = (r: any) => {
    if (!r) return null;
    return {
      name_jp: r.name_jp || r.title_jp || r.name_en || "料理名不明",
      name_en: r.name_en || "",
      image: r.image || null,
      instructions_jp:
        r.instructions_jp ||
        r.instructions_en ||
        "作り方の情報がありません。",
      ingredients_jp: r.ingredients_jp || [],
      sourceUrl: r.sourceUrl || null,
    };
  };

  // ----------------------------------
  // State
  // ----------------------------------
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // ==================================================
  // 🔥 CRITICAL FIX #1
  // Reset state when navigation params change
  // ==================================================
  useEffect(() => {
    // Case: Scan → Result → Recipe
    if (recipeFromResult) {
      setRecipe(normalizeRecipe(recipeFromResult));
      setLoading(false);
      return;
    }

    // Case: Home → Recipe (API fetch needed)
    if (recipeName) {
      setRecipe(null);     // ❌ clear old recipe immediately
      setLoading(true);    // ⏳ show loader only
    }
  }, [recipeFromResult, recipeName]);

  // ==================================================
  // 🔥 CRITICAL FIX #2
  // Fetch recipe by name (Home → Recipe)
  // ==================================================
  useEffect(() => {
    if (!recipeName || recipeFromResult) return;

    const fetchRecipe = async () => {
      try {
        const res = await fetch(`${API_URL}/recipe/${recipeName}`);
        const data = await res.json();
        setRecipe(data.recipe ? normalizeRecipe(data.recipe) : null);
      } catch {
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeName]);

  // ----------------------------------
  // Favorite logic
  // ----------------------------------
  useEffect(() => {
    if (!recipe) return;

    const load = async () => {
      const stored = JSON.parse(await AsyncStorage.getItem("favorites")) || [];
      setIsFavorite(stored.some((r) => r.name_jp === recipe.name_jp));
    };

    load();
  }, [recipe]);

  const toggleFavorite = async () => {
    const stored = JSON.parse(await AsyncStorage.getItem("favorites")) || [];
    const updated = isFavorite
      ? stored.filter((r) => r.name_jp !== recipe.name_jp)
      : [...stored, recipe];

    await AsyncStorage.setItem("favorites", JSON.stringify(updated));
    setIsFavorite(!isFavorite);
  };

  // ----------------------------------
  // Clean HTML
  // ----------------------------------
  const clean = (text: string) =>
    text
      ?.replace(/<li>/g, "• ")
      .replace(/<\/li>/g, "\n")
      .replace(/<\/?[^>]+>/g, "")
      .replace(/\n{2,}/g, "\n")
      .trim() || "";

  // ==================================================
  // UI STATES
  // ==================================================

  // Case: opened tab directly
  if (!loading && !recipe && !recipeName) {
    return (
      <GlobalWrapper>
        <View style={[styles.center, { backgroundColor: theme.background }]}>
          <Text style={{ fontSize: fontSize + 2, color: theme.text }}>
            まだレシピがありません
          </Text>

          <Text style={{ fontSize, opacity: 0.7, marginVertical: 12 }}>
            まず料理をスキャンしてください 🍽️
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Scan")}
          >
            <Text style={styles.buttonText}>スキャンする</Text>
          </TouchableOpacity>
        </View>
      </GlobalWrapper>
    );
  }

  // Loading (NO OLD RECIPE SHOWN)
  if (loading) {
    return (
      <GlobalWrapper>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FF7043" />
        </View>
      </GlobalWrapper>
    );
  }

  // Not found
  if (!recipe) {
    return (
      <GlobalWrapper>
        <View style={styles.center}>
          <Text
            style={{
              fontSize: fontSize + 2,
              color: isDark ? "#ff6666" : "red",
            }}
          >
            ⚠️ レシピが見つかりません
          </Text>
        </View>
      </GlobalWrapper>
    );
  }

  // ==================================================
  // MAIN UI
  // ==================================================
  return (
    <GlobalWrapper>
      <ScrollView style={{ backgroundColor: theme.background }}>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Image
            source={{ uri: recipe.image || "https://via.placeholder.com/400" }}
            style={styles.image}
          />

          <View style={styles.titleRow}>
            <Text
              style={[
                styles.title,
                { color: theme.text, fontSize: fontSize + 6 },
              ]}
            >
              {recipe.name_jp}
            </Text>

            <TouchableOpacity onPress={toggleFavorite}>
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={28}
                color={isFavorite ? "red" : isDark ? "#bbb" : "gray"}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { fontSize: fontSize + 3 }]}>
          🍴 材料
        </Text>

        <View
          style={[
            styles.ingredientsBox,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          {recipe.ingredients_jp.map((i: string, idx: number) => (
            <Text key={idx} style={{ fontSize, color: theme.text }}>
              • {i}
            </Text>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { fontSize: fontSize + 3 }]}>
          🧑‍🍳 作り方
        </Text>

        <TypingText
          text={clean(recipe.instructions_jp)}
          textStyle={{ color: theme.text, fontSize }}
        />

        {!!recipe.sourceUrl && (
          <Text
            style={[styles.link, { fontSize: fontSize + 1 }]}
            onPress={() => Linking.openURL(recipe.sourceUrl)}
          >
            🔗 View Full Recipe
          </Text>
        )}
      </ScrollView>
    </GlobalWrapper>
  );
}

// ----------------------------------
// Styles
// ----------------------------------
const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    borderRadius: 14,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
  },
  image: { width: "100%", height: 250 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
  },
  title: { fontWeight: "bold", flex: 1 },
  sectionTitle: {
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 8,
    color: "#FF7043",
  },
  ingredientsBox: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  link: {
    marginTop: 20,
    textDecorationLine: "underline",
    marginBottom: 30,
    color: "#4285F4",
  },
  button: {
    backgroundColor: "#FF7043",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

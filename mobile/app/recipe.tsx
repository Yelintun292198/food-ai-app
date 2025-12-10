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
import GlobalWrapper from "../components/GlobalWrapper";
import TypingText from "../components/TypingText";

const API_URL = "https://cautiously-mesocratic-albert.ngrok-free.dev";

export default function RecipeScreen({ route }) {
  const recipeFromResult = route?.params?.recipe;   // From ResultScreen
  const recipeName = route?.params?.recipeName;     // From HomeScreen

  // ⭐ unify recipe object
  const [recipe, setRecipe] = useState(
    recipeFromResult ? normalizeRecipe(recipeFromResult) : null
  );

  const [loading, setLoading] = useState(!recipeFromResult);
  const [isFavorite, setIsFavorite] = useState(false);

  // -------------------------------------------------------------
  // ⭐ Normalize recipe object
  // -------------------------------------------------------------
  function normalizeRecipe(r) {
    if (!r) return null;

    return {
      name_jp: r.name_jp || r.title_jp || r.name_en || "料理名不明",
      name_en: r.name_en || "",
      image: r.image || null,
      instructions_jp: r.instructions_jp || r.instructions_en || "作り方の情報がありません。",
      ingredients_jp: r.ingredients_jp || [],
      sourceUrl: r.sourceUrl || null,
    };
  }

  // -------------------------------------------------------------
  // ⭐ If coming from Home → Fetch recipe details
  // -------------------------------------------------------------
  useEffect(() => {
    if (recipeFromResult) return; // already have full recipe

    const fetchRecipe = async () => {
      try {
        const res = await fetch(`${API_URL}/recipe/${recipeName}`);
        const data = await res.json();

        console.log("📌 Recipe fetched:", data);

        if (data.recipe) {
          setRecipe(normalizeRecipe(data.recipe));
        } else {
          setRecipe(null);
        }
      } catch (err) {
        console.log("ERROR:", err);
        setRecipe(null);
      }
      setLoading(false);
    };

    if (recipeName) fetchRecipe();
  }, [recipeName]);

  // -------------------------------------------------------------
  // ❤️ FAVORITE LOGIC
  // -------------------------------------------------------------
  useEffect(() => {
    const load = async () => {
      const stored = JSON.parse(await AsyncStorage.getItem("favorites")) || [];
      const found = stored.some((item) => item.name_jp === recipe?.name_jp);
      setIsFavorite(found);
    };

    if (recipe) load();
  }, [recipe]);

  const toggleFavorite = async () => {
    const stored = JSON.parse(await AsyncStorage.getItem("favorites")) || [];
    let updated;

    if (isFavorite) {
      updated = stored.filter((r) => r.name_jp !== recipe.name_jp);
    } else {
      updated = [...stored, recipe];
    }

    await AsyncStorage.setItem("favorites", JSON.stringify(updated));
    setIsFavorite(!isFavorite);
  };

  // -------------------------------------------------------------
  // 🧹 Clean HTML from instructions
  // -------------------------------------------------------------
  const clean = (text) => {
    if (!text) return "";
    return text
      .replace(/<li>/g, "• ")
      .replace(/<\/li>/g, "\n")
      .replace(/<\/?[^>]+>/g, "")
      .replace(/\n{2,}/g, "\n")
      .trim();
  };

  // -------------------------------------------------------------
  // Loading state
  // -------------------------------------------------------------
  if (loading) {
    return (
      <GlobalWrapper>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#FF6347" />
        </View>
      </GlobalWrapper>
    );
  }

  // -------------------------------------------------------------
  // No recipe found
  // -------------------------------------------------------------
  if (!recipe) {
    return (
      <GlobalWrapper>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 18, color: "red" }}>⚠️ レシピが見つかりません。</Text>
        </View>
      </GlobalWrapper>
    );
  }

  return (
    <GlobalWrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Image
            source={{ uri: recipe.image || "https://via.placeholder.com/400?text=No+Image" }}
            style={styles.image}
          />

          <View style={styles.titleRow}>
            <Text style={styles.title}>
              {recipe.name_jp || "料理名不明"}
            </Text>

            <TouchableOpacity onPress={toggleFavorite}>
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={28}
                color={isFavorite ? "red" : "gray"}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>🍴 材料</Text>
        <View style={styles.ingredientsBox}>
          {(recipe.ingredients_jp || []).map((i, idx) => (
            <Text key={idx} style={styles.ingredientItem}>
              • {i}
            </Text>
          ))}
        </View>

        <Text style={styles.sectionTitle}>🧑‍🍳 作り方</Text>
        <TypingText text={clean(recipe.instructions_jp)} />

        {!!recipe.sourceUrl && (
          <Text
            style={styles.link}
            onPress={() => Linking.openURL(recipe.sourceUrl)}
          >
            🔗 View Full Recipe
          </Text>
        )}
      </ScrollView>
    </GlobalWrapper>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#FFF", borderRadius: 14, marginBottom: 16, overflow: "hidden" },
  image: { width: "100%", height: 250 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", padding: 12 },
  title: { fontSize: 22, fontWeight: "bold", flex: 1 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginTop: 20, color: "#FF7043" },
  ingredientsBox: { backgroundColor: "#FFF", padding: 14, borderRadius: 12, marginBottom: 16 },
  ingredientItem: { fontSize: 16, marginVertical: 4 },
  link: { color: "#4285F4", fontSize: 18, marginTop: 20, textDecorationLine: "underline" },
});

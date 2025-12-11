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

import { useTheme } from "../context/ThemeContext";
import { Colors } from "../constants/colors";
import { useTextSize } from "../context/TextSizeContext";  // ← ADD

const API_URL = "https://cautiously-mesocratic-albert.ngrok-free.dev";

export default function RecipeScreen({ route }) {
  const { isDark } = useTheme();
  const theme = isDark ? Colors.dark : Colors.light;

  const { fontSize } = useTextSize();  // ← ADD

  const recipeFromResult = route?.params?.recipe;
  const recipeName = route?.params?.recipeName;

  const [recipe, setRecipe] = useState(
    recipeFromResult ? normalizeRecipe(recipeFromResult) : null
  );

  const [loading, setLoading] = useState(!recipeFromResult);
  const [isFavorite, setIsFavorite] = useState(false);

  // Normalize recipe object
  function normalizeRecipe(r) {
    if (!r) return null;

    return {
      name_jp: r.name_jp || r.title_jp || r.name_en || "料理名不明",
      name_en: r.name_en || "",
      image: r.image || null,
      instructions_jp:
        r.instructions_jp || r.instructions_en || "作り方の情報がありません。",
      ingredients_jp: r.ingredients_jp || [],
      sourceUrl: r.sourceUrl || null,
    };
  }

  // Fetch recipe when coming from Home
  useEffect(() => {
    if (recipeFromResult) return;

    const fetchRecipe = async () => {
      try {
        const res = await fetch(`${API_URL}/recipe/${recipeName}`);
        const data = await res.json();

        if (data.recipe) {
          setRecipe(normalizeRecipe(data.recipe));
        } else {
          setRecipe(null);
        }
      } catch (err) {
        setRecipe(null);
      }
      setLoading(false);
    };

    if (recipeName) fetchRecipe();
  }, [recipeName]);

  // Favorite logic
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

  // Clean HTML text
  const clean = (text) => {
    if (!text) return "";
    return text
      .replace(/<li>/g, "• ")
      .replace(/<\/li>/g, "\n")
      .replace(/<\/?[^>]+>/g, "")
      .replace(/\n{2,}/g, "\n")
      .trim();
  };

  // Loading
  if (loading) {
    return (
      <GlobalWrapper>
        <View
          style={{
            flex: 1,
            backgroundColor: theme.background,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#FF6347" />
        </View>
      </GlobalWrapper>
    );
  }

  // Not found
  if (!recipe) {
    return (
      <GlobalWrapper>
        <View
          style={{
            flex: 1,
            backgroundColor: theme.background,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: fontSize + 2,
              color: isDark ? "#ff6666" : "red",
            }}
          >
            ⚠️ レシピが見つかりません。
          </Text>
        </View>
      </GlobalWrapper>
    );
  }

  return (
    <GlobalWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: theme.background }}
      >
        {/* IMAGE + TITLE */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Image
            source={{
              uri:
                recipe.image ||
                "https://via.placeholder.com/400?text=No+Image",
            }}
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

        {/* INGREDIENTS */}
        <Text
          style={[
            styles.sectionTitle,
            { color: "#FF7043", fontSize: fontSize + 3 },
          ]}
        >
          🍴 材料
        </Text>

        <View
          style={[
            styles.ingredientsBox,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          {recipe.ingredients_jp.map((i, idx) => (
            <Text
              key={idx}
              style={[
                styles.ingredientItem,
                { color: theme.text, fontSize: fontSize },
              ]}
            >
              • {i}
            </Text>
          ))}
        </View>

        {/* INSTRUCTIONS */}
        <Text
          style={[
            styles.sectionTitle,
            { color: "#FF7043", fontSize: fontSize + 3 },
          ]}
        >
          🧑‍🍳 作り方
        </Text>

        <TypingText
          text={clean(recipe.instructions_jp)}
          textStyle={{ color: theme.text, fontSize: fontSize }}
        />

        {/* LINK */}
        {!!recipe.sourceUrl && (
          <Text
            style={[
              styles.link,
              {
                color: isDark ? "#4da3ff" : "#4285F4",
                fontSize: fontSize + 1,
              },
            ]}
            onPress={() => Linking.openURL(recipe.sourceUrl)}
          >
            🔗 View Full Recipe
          </Text>
        )}
      </ScrollView>
    </GlobalWrapper>
  );
}

//
// Styles
//
const styles = StyleSheet.create({
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
  },

  ingredientsBox: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },

  ingredientItem: { marginVertical: 4 },

  link: {
    marginTop: 20,
    textDecorationLine: "underline",
    marginBottom: 30,
  },
});

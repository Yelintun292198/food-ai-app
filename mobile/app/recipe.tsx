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
} from "react-native";
import GlobalWrapper from "../components/GlobalWrapper";
import TypingText from "../components/TypingText";

export default function RecipeScreen({ route }) {
  const recipe = route?.params?.recipe;

  const [isFavorite, setIsFavorite] = useState(false);

  // ❤️ Check favorite
  useEffect(() => {
    const load = async () => {
      const stored = JSON.parse(await AsyncStorage.getItem("favorites")) || [];
      const found = stored.some(
        (item) => item.name_jp === recipe?.name_jp
      );
      setIsFavorite(found);
    };

    if (recipe) load();
  }, [recipe]);

  // ❤️ Toggle favorite
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

  // 🧹 CLEAN HTML + MAKE BULLETS
  const clean = (text: string) => {
    if (!text) return "";

    let cleaned = text;

    // Convert <li> items to bullet points
    cleaned = cleaned.replace(/<li>/g, "• ");
    cleaned = cleaned.replace(/<\/li>/g, "\n");

    // Remove all other HTML tags
    cleaned = cleaned.replace(/<\/?[^>]+(>|$)/g, "");

    // Remove extra newlines
    cleaned = cleaned.replace(/\n{2,}/g, "\n");

    return cleaned.trim();
  };

  if (!recipe) {
    return (
      <GlobalWrapper>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ No recipe data found.</Text>
        </View>
      </GlobalWrapper>
    );
  }

  return (
    <GlobalWrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image + Title */}
        <View style={styles.card}>
          <Image source={{ uri: recipe.image }} style={styles.image} />

          <View style={styles.titleRow}>
            <Text style={styles.title}>
              {recipe.name_jp || recipe.name_en || "料理名不明"}
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

        {/* Ingredients */}
        <Text style={styles.sectionTitle}>🍴 材料</Text>

        <View style={styles.ingredientsBox}>
          {(recipe.ingredients_jp || []).map(
            (item: string, index: number) => (
              <Text key={index} style={styles.ingredientItem}>
                • {item}
              </Text>
            )
          )}
        </View>

        {/* Instructions */}
        <Text style={styles.sectionTitle}>🧑‍🍳 作り方</Text>

        <TypingText
          text={clean(recipe.instructions_jp || recipe.instructions_en)}
        />

        {/* Source URL */}
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

// Styles
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    marginBottom: 16,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 250,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    color: "#FF7043",
  },
  ingredientsBox: {
    backgroundColor: "#FFF",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  ingredientItem: {
    fontSize: 16,
    marginVertical: 4,
    lineHeight: 24,
  },
  link: {
    color: "#4285F4",
    fontSize: 18,
    marginTop: 20,
    textDecorationLine: "underline",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: { fontSize: 18, color: "red" },
});

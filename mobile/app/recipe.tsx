// 🍳 Final Clean Recipe Screen (no undefined text, elegant layout)
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

  // 🧩 Check favorite status
  useEffect(() => {
    const checkFavorite = async () => {
      const stored = JSON.parse(await AsyncStorage.getItem("favorites")) || [];
      const found = stored.some((item) => item.name === recipe.name);
      setIsFavorite(found);
    };
    if (recipe) checkFavorite();
  }, [recipe]);

  // ❤️ Toggle favorite
  const toggleFavorite = async () => {
    try {
      const stored = JSON.parse(await AsyncStorage.getItem("favorites")) || [];
      let updated;
      if (isFavorite) {
        updated = stored.filter((r) => r.name !== recipe.name);
      } else {
        updated = [...stored, recipe];
      }
      await AsyncStorage.setItem("favorites", JSON.stringify(updated));
      setIsFavorite(!isFavorite);
    } catch (e) {
      console.error(e);
    }
  };

  // 🧼 Clean unwanted "undefined" and fix formatting
  const cleanText = (text: string) => {
    if (!text) return "";
    return text
      .replace(/undefined/gi, " ") // remove all 'undefined'
      .replace(/\s{2,}/g, " ")     // collapse extra spaces
      .replace(/\.+/g, ".")        // fix multiple dots
      .replace(/\n+/g, "\n")       // normalize line breaks
      .trim();
  };

  // 🚨 No recipe case
  if (!recipe) {
    return (
      <GlobalWrapper>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ No recipe data found.</Text>
          <Text style={styles.errorText}>Please go back and try again.</Text>
        </View>
      </GlobalWrapper>
    );
  }

  return (
    <GlobalWrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 🧁 Food Image + Title */}
        <View style={styles.card}>
          <Image source={{ uri: recipe.image }} style={styles.image} />
          <View style={styles.titleRow}>
            <Text style={styles.title}>{recipe.name}</Text>
            <TouchableOpacity onPress={toggleFavorite}>
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={28}
                color={isFavorite ? "#FF7043" : "gray"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* 🍴 Ingredients Section */}
        <Text style={styles.sectionTitle}>🍴 Ingredients</Text>
        <View style={styles.ingredientsBox}>
          {recipe.ingredients
            .filter(
              (item) =>
                item.ingredient &&
                item.ingredient !== "undefined" &&
                item.measure !== "undefined"
            )
            .map((item, index) => (
              <Text key={index} style={styles.ingredientItem}>
                • {cleanText(item.ingredient)} ({cleanText(item.measure)})
              </Text>
            ))}
        </View>

        {/* 🧑‍🍳 Instructions Section */}
        <Text style={styles.sectionTitle}>🧑‍🍳 Instructions</Text>
        <TypingText text={cleanText(recipe.instructions)} />

        {/* 🔗 Source link */}
        {recipe.sourceUrl && (
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

// 🎨 Styles
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
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
    fontSize: 24,
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
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    marginBottom: 16,
  },
  ingredientItem: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginVertical: 2,
  },
  link: {
    fontSize: 18,
    color: "#4285F4",
    marginTop: 24,
    textDecorationLine: "underline",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: { fontSize: 18, color: "red", marginBottom: 10 },
});

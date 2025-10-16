import React from "react";
import { View, Text, Image, ScrollView, StyleSheet, Linking } from "react-native";

export default function RecipeScreen({ route }) {
  const recipe = route?.params?.recipe;

  if (!recipe) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>⚠️ No recipe data found.</Text>
        <Text style={styles.errorText}>Please go back and try again.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: recipe.image }} style={styles.image} />
      <Text style={styles.title}>{recipe.name}</Text>

      <Text style={styles.sectionTitle}>🍴 Ingredients</Text>
      {recipe.ingredients.map((item, index) => (
        <Text key={index} style={styles.ingredient}>
          • {item.ingredient} ({item.measure})
        </Text>
      ))}

      <Text style={styles.sectionTitle}>🧑‍🍳 Instructions</Text>
      <Text style={styles.instructions}>{recipe.instructions}</Text>

      {recipe.sourceUrl && (
        <Text
          style={styles.link}
          onPress={() => Linking.openURL(recipe.sourceUrl)}
        >
          🔗 View Full Recipe
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  image: { width: "100%", height: 250, borderRadius: 10 },
  title: { fontSize: 26, fontWeight: "bold", marginVertical: 10 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginTop: 20 },
  ingredient: { fontSize: 16, marginVertical: 2 },
  instructions: { fontSize: 16, lineHeight: 22, marginTop: 10 },
  link: {
    fontSize: 18,
    color: "blue",
    marginTop: 20,
    textDecorationLine: "underline",
  },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  errorText: { fontSize: 18, color: "red", marginBottom: 10 },
});

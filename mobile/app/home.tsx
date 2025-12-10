import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://cautiously-mesocratic-albert.ngrok-free.dev";

export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    loadRecommendations();
  }, []);

  // -------------------------------------------------------
  // ⭐ Load recommended foods based on user.favorite_foods
  // -------------------------------------------------------
  const loadRecommendations = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      console.log("🔵 STORED USER:", storedUser);

      if (!storedUser) {
        console.log("User not logged in");
        setLoading(false);
        return;
      }

      const user = JSON.parse(storedUser);

      if (!user.name) {
        console.log("⚠️ No user.name found");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/recommendations/name/${user.name}`);
      const data = await res.json();

      console.log("📌 RESULT FROM BACKEND =", data);

      if (data.items) {
        setFoods(data.items);
      }
    } catch (e) {
      console.log("ERROR loading recommendations:", e);
    }

    setLoading(false);
  };

  // -------------------------------------------------------
  // ⭐ FIXED: Navigation to Recipe screen
  // -------------------------------------------------------
  const openRecipe = (foodName) => {
    console.log("➡️ Navigating to Recipe:", foodName);

    if (!foodName) {
      console.log("❌ No foodName provided!");
      return;
    }

    navigation.navigate("Recipe", { recipeName: foodName });
  };

  // -------------------------------------------------------
  // Loading Screen
  // -------------------------------------------------------
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6347" />
      </View>
    );
  }

  // -------------------------------------------------------
  // Main UI
  // -------------------------------------------------------
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>あなたへのおすすめ</Text>

      {foods.length === 0 && (
        <Text style={styles.noResults}>おすすめの料理がありません。</Text>
      )}

      {foods.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() => openRecipe(item.name)} // ⭐ safe navigation
        >
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={{ color: "#aaa" }}>No Image</Text>
            </View>
          )}

          <Text style={styles.cardTitle}>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

// -------------------------------------------------------
// Styles
// -------------------------------------------------------
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  noResults: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#555",
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
  },
  image: { width: "100%", height: 150, borderRadius: 8 },
  placeholder: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: { fontSize: 18, marginTop: 10, fontWeight: "600" },
});

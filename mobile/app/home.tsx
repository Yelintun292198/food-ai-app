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

import { useTheme } from "../context/ThemeContext";
import { Colors } from "../constants/colors";
import { useTextSize } from "../context/TextSizeContext";

const API_URL = "https://cautiously-mesocratic-albert.ngrok-free.dev";

export default function HomeScreen({ navigation }) {
  const { fontSize } = useTextSize(); // ✔ dynamic text size
  const { isDark } = useTheme();
  const theme = isDark ? Colors.dark : Colors.light;

  const [loading, setLoading] = useState(true);
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    loadRecommendations();
  }, []);

  // Load recommended foods
  const loadRecommendations = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) {
        setLoading(false);
        return;
      }

      const user = JSON.parse(storedUser);

      if (!user.name) {
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/recommendations/name/${user.name}`);
      const data = await res.json();

      if (data.items) setFoods(data.items);
    } catch (e) {
      console.log("ERROR loading recommendations:", e);
    }

    setLoading(false);
  };

  const openRecipe = (foodName) => {
    if (!foodName) return;
    navigation.navigate("Recipe", { recipeName: foodName });
  };

  // Loading screen with theme
  if (loading) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: theme.background },
        ]}
      >
        <ActivityIndicator size="large" color="#FF6347" />
      </View>
    );
  }

  // Main UI
  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      {/* Main Title - Professional Scaling */}
      <Text style={[styles.title, { fontSize: fontSize + 6, color: theme.text }]}>
        あなたへのおすすめ
      </Text>

      {/* No results */}
      {foods.length === 0 && (
        <Text style={[styles.noResults, { fontSize, color: theme.text }]}>
          おすすめの料理がありません。
        </Text>
      )}

      {/* Cards */}
      {foods.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
          onPress={() => openRecipe(item.name)}
        >
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.image} />
          ) : (
            <View
              style={[
                styles.placeholder,
                { backgroundColor: isDark ? "#222" : "#f0f0f0" },
              ]}
            >
              <Text style={{ color: isDark ? "#aaa" : "#777", fontSize }}>
                No Image
              </Text>
            </View>
          )}

          {/* Card Title (fontSize +1 for hierarchy) */}
          <Text
            style={[
              styles.cardTitle,
              { color: theme.text, fontSize: fontSize + 1 },
            ]}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  title: {
    fontWeight: "bold",
    marginBottom: 20,
  },

  noResults: {
    textAlign: "center",
    marginTop: 20,
  },

  card: {
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    borderWidth: 1,
    elevation: 2,
  },

  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },

  placeholder: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  cardTitle: {
    marginTop: 10,
    fontWeight: "600",
  },
});

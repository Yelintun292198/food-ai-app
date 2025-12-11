import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../context/ThemeContext";
import { Colors } from "../constants/colors";
import { useTextSize } from "../context/TextSizeContext";

export default function FavoritesScreen() {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState([]);

  const { isDark } = useTheme();
  const theme = isDark ? Colors.dark : Colors.light;

  // TEXT SIZE CONTEXT
  const { fontSize } = useTextSize();

  const loadFavorites = async () => {
    const stored = JSON.parse(await AsyncStorage.getItem("favorites")) || [];
    setFavorites(stored);
  };

  const removeFavorite = async (name: string) => {
    const updated = favorites.filter((item) => item.name_jp !== name);
    await AsyncStorage.setItem("favorites", JSON.stringify(updated));
    setFavorites(updated);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadFavorites);
    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Title */}
      <Text style={[styles.title, { color: theme.text, fontSize: fontSize + 4 }]}>
        お気に入り
      </Text>

      {/* Empty Message */}
      {favorites.length === 0 ? (
        <Text style={[styles.empty, { color: isDark ? "#bbb" : "#777", fontSize }]}>
          お気に入りがまだありません
        </Text>
      ) : (
        favorites.map((item, idx) => (
          <View
            key={idx}
            style={[
              styles.card,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            {/* Image */}
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.image} />
            ) : (
              <View
                style={[
                  styles.image,
                  styles.placeholder,
                  { backgroundColor: isDark ? "#333" : "#eee" },
                ]}
              >
                <Text style={{ color: theme.text, fontSize }}>🍽️</Text>
              </View>
            )}

            {/* Recipe Name */}
            <Text
              style={[
                styles.name,
                { color: theme.text, fontSize: fontSize + 1 },
              ]}
            >
              {item.name_jp}
            </Text>

            <View style={styles.row}>
              {/* View Recipe */}
              <TouchableOpacity
                style={styles.recipeBtn}
                onPress={() => navigation.navigate("Recipe", { recipe: item })}
              >
                <Text style={[styles.recipeText, { fontSize }]}>
                  レシピを見る
                </Text>
              </TouchableOpacity>

              {/* Delete Button */}
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() =>
                  Alert.alert("削除しますか？", item.name_jp, [
                    { text: "キャンセル" },
                    {
                      text: "削除",
                      style: "destructive",
                      onPress: () => removeFavorite(item.name_jp),
                    },
                  ])
                }
              >
                <Ionicons name="trash" size={22} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

//
// Styles
//
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  title: {
    fontWeight: "bold",
    marginBottom: 20,
  },

  empty: {
    textAlign: "center",
    marginTop: 20,
  },

  card: {
    marginBottom: 20,
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 5,
  },

  image: {
    width: 140,
    height: 140,
    borderRadius: 14,
  },

  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },

  name: {
    fontWeight: "bold",
    marginVertical: 10,
  },

  row: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },

  recipeBtn: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginRight: 10,
  },

  recipeText: {
    color: "white",
    fontWeight: "bold",
  },

  deleteBtn: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 50,
  },
});

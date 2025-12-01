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

export default function FavoritesScreen() {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState([]);

  const loadFavorites = async () => {
    const stored = JSON.parse(await AsyncStorage.getItem("favorites")) || [];
    setFavorites(stored);
  };

  const removeFavorite = async (name: string) => {
    const updated = favorites.filter((item) => item.name !== name);
    await AsyncStorage.setItem("favorites", JSON.stringify(updated));
    setFavorites(updated);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadFavorites);
    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>お気に入り</Text>

      {favorites.length === 0 ? (
        <Text style={styles.empty}>お気に入りがまだありません</Text>
      ) : (
        favorites.map((item, idx) => (
          <View key={idx} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>

            <View style={styles.row}>
              <TouchableOpacity
                style={styles.recipeBtn}
                onPress={() =>
                  navigation.navigate("レシピ画面", { recipe: item })
                }
              >
                <Text style={styles.recipeText}>レシピを見る</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() =>
                  Alert.alert("削除しますか？", item.name, [
                    { text: "キャンセル" },
                    { text: "削除", style: "destructive", onPress: () => removeFavorite(item.name) },
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

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20 },
  empty: { textAlign: "center", color: "#777", marginTop: 20 },

  card: {
    backgroundColor: "#fafafa",
    marginBottom: 20,
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 5,
  },
  image: { width: 140, height: 140, borderRadius: 14 },
  name: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },

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
  recipeText: { color: "white", fontWeight: "bold" },

  deleteBtn: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 50,
  },
});

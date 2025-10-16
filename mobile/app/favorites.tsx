import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App";

const favorites = [
  { name: "カレーライス", image: "https://picsum.photos/150/150?1" },
  { name: "ラーメン", image: "https://picsum.photos/150/150?2" },
  { name: "寿司", image: "https://picsum.photos/150/150?3" },
  { name: "天ぷら", image: "" },
];

export default function FavoritesScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>お気に入り画面</Text>

      <View style={styles.grid}>
        {favorites.map((item, idx) => (
          <View key={idx} style={styles.card}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.image} />
            ) : (
              <View style={[styles.image, styles.placeholder]}>
                <Text>🖼</Text>
              </View>
            )}
            <Text style={styles.name}>{item.name}</Text>

            <TouchableOpacity
              style={styles.recipeBtn}
              onPress={() => navigation.navigate("レシピ画面")}
            >
              <Text style={styles.recipeText}>レシピを見る</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.homeBtn}
        onPress={() => navigation.navigate("ホーム画面")}
      >
        <Text style={styles.homeText}>ホームに戻る</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: "#eee",
  },
  placeholder: { justifyContent: "center", alignItems: "center" },
  name: { fontSize: 14, fontWeight: "bold", marginBottom: 6 },
  recipeBtn: {
    backgroundColor: "#000",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  recipeText: { color: "#fff", fontSize: 12 },
  homeBtn: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    width: "90%",
  },
  homeText: { fontSize: 14, fontWeight: "bold" },
});

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const FOOD_MAP: any = {
  Japanese: ["Ramen", "Sushi", "Tempura", "Udon", "Gyoza", "Curry Rice"],
  Western: ["Pizza", "Pasta", "Burger", "Steak", "Sandwich"],
  Chinese: ["Fried Rice", "Dumplings", "Mapo Tofu", "Sweet and Sour Pork"],
  Korean: ["Kimchi Stew", "Bibimbap", "Tteokbokki", "Korean BBQ"],
  Spicy: ["Spicy Ramen", "Curry", "Kimchi", "Tteokbokki"],
  Healthy: ["Salad", "Smoothie", "Tofu Bowl", "Grilled Chicken"],
  Desserts: ["Cake", "Ice Cream", "Pudding", "Fruit Parfait"],
};

const API_URL =
  (process.env.EXPO_PUBLIC_API_URL ||
    "https://cautiously-mesocratic-albert.ngrok-free.dev").replace(/\/$/, "");

export default function SignupFoodScreen({ route }: any) {
  const navigation = useNavigation<any>();
  const { category, userId } = route.params;

  const foods = FOOD_MAP[category] || [];
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (item: string) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((i) => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  const savePreferences = async () => {
    if (selected.length === 0) {
      Alert.alert("選択してください", "1つ以上の料理を選んでください");
      return;
    }

    try {
      await fetch(`${API_URL}/users/${userId}/preferences`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foods: selected }),
      });

      Alert.alert("登録完了", "ログイン画面に戻ります");
      navigation.navigate("Login");
    } catch (err) {
      Alert.alert("エラー", "保存に失敗しました");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>好きな {category} の料理を選択</Text>

      {foods.map((item: string) => (
        <TouchableOpacity
          key={item}
          style={[
            styles.foodButton,
            selected.includes(item) && styles.foodSelected,
          ]}
          onPress={() => toggle(item)}
        >
          <Text style={styles.foodText}>{item}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.saveBtn} onPress={savePreferences}>
        <Text style={styles.saveText}>保存して完了</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    paddingBottom: 80,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  foodButton: {
    padding: 16,
    backgroundColor: "#f2f2f7",
    borderRadius: 10,
    marginBottom: 10,
  },
  foodSelected: {
    backgroundColor: "#ffcc80",
  },
  foodText: {
    fontSize: 18,
  },
  saveBtn: {
    marginTop: 25,
    backgroundColor: "#ff9500",
    padding: 16,
    borderRadius: 10,
  },
  saveText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 18,
  },
});

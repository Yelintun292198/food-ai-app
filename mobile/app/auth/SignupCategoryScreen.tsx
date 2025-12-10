import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

const CATEGORIES = [
  "Japanese",
  "Western",
  "Chinese",
  "Korean",
  "Spicy",
  "Healthy",
  "Desserts",
];

export default function SignupCategoryScreen({ route }: any) {
  const navigation = useNavigation<any>();
  const { userId } = route.params;  // from signup.tsx

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>お好みのカテゴリを選んでください</Text>

      {CATEGORIES.map((cat) => (
        <TouchableOpacity
          key={cat}
          style={styles.categoryButton}
          onPress={() =>
            navigation.navigate("SignupFoodScreen", {
              userId,
              category: cat,
            })
          }
        >
          <Text style={styles.categoryText}>{cat}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    paddingBottom: 60,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  categoryButton: {
    padding: 18,
    backgroundColor: "#f2f2f7",
    borderRadius: 10,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: "500",
  },
});

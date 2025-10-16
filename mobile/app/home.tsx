import React from "react";
import { View, Text, Button, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      {/* 🧠 App title */}
      <Text style={styles.title}>🍱 Food AI App</Text>
      <Text style={styles.subtitle}>食べ物を撮ってAIで分析しよう！</Text>

      {/* 🖼️ Optional logo image */}
      <Image
        source={require("../assets/images/icon.png")}
        style={styles.logo}
      />

      {/* 🚀 Navigation buttons */}
      <View style={styles.buttonGroup}>
        <Button
          title="画像を選択して分析する"
          onPress={() => navigation.navigate("プレビュー画面")}
          color="#007AFF"
        />
      </View>

      <View style={styles.buttonGroup}>
        <Button
          title="お気に入り"
          onPress={() => navigation.navigate("お気に入り画面")}
          color="#FF9500"
        />
      </View>

      <View style={styles.buttonGroup}>
        <Button
          title="履歴"
          onPress={() => navigation.navigate("履歴画面")}
          color="#34C759"
        />
      </View>
    </View>
  );
}

// 🎨 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: "contain",
    marginBottom: 30,
  },
  buttonGroup: {
    marginVertical: 10,
    width: "80%",
  },
});

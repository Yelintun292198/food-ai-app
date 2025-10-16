import React, { useState } from "react";
import {
  Button,
  Image,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App";

export default function PreviewScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const API_URL =
    process.env.EXPO_PUBLIC_API_URL ||
    "https://cautiously-mesocratic-albert.ngrok-free.dev";

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Please allow photo access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const analyzeImage = async () => {
    if (!imageUri) return;
    setLoading(true);

    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("file", blob, "photo.jpg");

      const res = await axios.post(`${API_URL}/predict`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000,
      });

      const data = res.data;
      console.log("✅ Backend response:", data);

      if (data.recipe_found) {
        console.log("📦 Passing recipe data:", data.recipe);
        navigation.navigate("レシピ画面", { recipe: data.recipe });
      } else {
        navigation.navigate("結果画面", { result: data });
      }
    } catch (error: any) {
      console.error("❌ Error analyzing image:", error.message);
      Alert.alert(
        "Error",
        "Could not connect to backend.\n\nPlease check your backend or ngrok URL."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍱 Food Recognition</Text>
      <Button title="Pick an Image" onPress={pickImage} />

      {imageUri && (
        <>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <Button title="Analyze Image" onPress={analyzeImage} />
        </>
      )}

      {loading && (
        <ActivityIndicator
          size="large"
          color="#FF6347"
          style={{ marginTop: 10 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  image: { width: 250, height: 250, borderRadius: 10, marginVertical: 15 },
});

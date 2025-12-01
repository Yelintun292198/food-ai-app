import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PreviewScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const API_URL =
    (process.env.EXPO_PUBLIC_API_URL ||
      "https://cautiously-mesocratic-albert.ngrok-free.dev").replace(/\/$/, "");

  // 📸 PICK IMAGE
  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("許可が必要です", "写真へのアクセスを許可してください。");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  // 📷 TAKE PHOTO
  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("許可が必要です", "カメラへのアクセスを許可してください。");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      cameraType: ImagePicker.CameraType.back,
    });

    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  // 🔍 ANALYZE IMAGE
  const analyzeImage = async () => {
    if (!imageUri) return;

    setLoading(true);

    try {
      const filename = imageUri.split("/").pop() || "photo.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        name: filename,
        type,
      } as any);

      const res = await axios({
        method: "post",
        url: `${API_URL}/predict`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
        transformRequest: (data) => data,
        timeout: 60000,
      });

      const data = res.data;
      console.log("📥 Backend returned:", data);

      // Normalize
      const normalized = {
        predicted_food_jp: data.predicted_food_jp || "不明",
        predicted_food_en: data.predicted_food_en || "",
        confidence: data.confidence || 0,
        top3: data.top3 || [],
        image: imageUri,
        recipe: data.recipe || null,
      };

      console.log("📦 Normalized:", normalized);

      // Save history
      const newItem = {
        date: new Date().toISOString().split("T")[0],
        name: normalized.predicted_food_jp,
        image: normalized.image,
        confidence: normalized.confidence,
      };

      const oldHistory =
        JSON.parse(await AsyncStorage.getItem("history")) || [];
      await AsyncStorage.setItem(
        "history",
        JSON.stringify([newItem, ...oldHistory])
      );

      // ⛔ DO NOT navigate directly to レシピ画面

      // ✔ ALWAYS go to ResultScreen
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "結果画面",
            params: {
              result: normalized,
            },
          },
        ],
      });
    } catch (error) {
      console.error("❌ Error analyzing:", error);
      Alert.alert(
        "Error",
        "AI分析に失敗しました。サーバーまたはネットワークを確認してください。"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📸 食べ物を分析しよう</Text>
      <Text style={styles.subText}>AIが料理を認識してレシピを表示します</Text>

      <View style={styles.previewBox}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Ionicons name="image-outline" size={80} color="#ccc" />
        )}
      </View>

      <TouchableOpacity style={styles.pickBtn} onPress={pickImage}>
        <Ionicons name="images" size={22} color="#fff" />
        <Text style={styles.btnText}>画像を選択</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cameraBtn} onPress={takePhoto}>
        <Ionicons name="camera" size={22} color="#fff" />
        <Text style={styles.btnText}>カメラで撮影</Text>
      </TouchableOpacity>

      {imageUri && (
        <TouchableOpacity style={styles.analyzeBtn} onPress={analyzeImage}>
          <Ionicons name="search" size={22} color="#fff" />
          <Text style={styles.btnText}>AIで分析する</Text>
        </TouchableOpacity>
      )}

      {loading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#FF6347" />
          <Text style={styles.loadingText}>分析中...</Text>
        </View>
      )}
    </View>
  );
}

// styles unchanged...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center", paddingHorizontal: 20, paddingTop: 70 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 6 },
  subText: { fontSize: 14, color: "#666", marginBottom: 20 },
  previewBox: {
    width: 280, height: 280, backgroundColor: "#fafafa", borderRadius: 20,
    justifyContent: "center", alignItems: "center", borderWidth: 1,
    borderColor: "#eee", marginBottom: 25,
  },
  image: { width: "100%", height: "100%", borderRadius: 20 },
  pickBtn: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#007AFF",
    paddingVertical: 12, paddingHorizontal: 30, borderRadius: 30, marginBottom: 10,
  },
  cameraBtn: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#ffaa00",
    paddingVertical: 12, paddingHorizontal: 30, borderRadius: 30, marginBottom: 10,
  },
  analyzeBtn: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#FF6347",
    paddingVertical: 12, paddingHorizontal: 30, borderRadius: 30,
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600", marginLeft: 8 },
  loadingBox: { flexDirection: "row", alignItems: "center", marginTop: 20 },
  loadingText: { fontSize: 16, marginLeft: 10, color: "#FF6347" },
});

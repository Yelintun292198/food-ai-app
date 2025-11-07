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
import { Ionicons } from "@expo/vector-icons"; // 🆕 Added icon pack for UI

export default function PreviewScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const API_URL =
    (process.env.EXPO_PUBLIC_API_URL ||
      "https://cautiously-mesocratic-albert.ngrok-free.dev").replace(/\/$/, "");

  // 🧠 Image Picker (unchanged logic)
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Please allow photo access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // 🧠 Analyze Image (unchanged logic)
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

      console.log("🚀 Sending image to backend:", `${API_URL}/predict`);

      const res = await axios({
        method: "post",
        url: `${API_URL}/predict`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
        transformRequest: (data) => data,
        timeout: 60000,
      });

      const data = res.data;
      console.log("✅ Backend response:", data);

      if (data.recipe_found) {
        navigation.navigate("レシピ画面", { recipe: data.recipe });
      } else {
        navigation.navigate("結果画面", { result: data });
      }
    } catch (error: any) {
      console.error("❌ Error analyzing image:", error.message);
      Alert.alert(
        "Error",
        "Could not connect to backend.\nPlease check your backend or ngrok URL."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===========================================================
  // 🧱 Modern Professional UI
  // ===========================================================
  return (
    <View style={styles.container}>
      <Text style={styles.header}>📸 食べ物を分析しよう</Text>
      <Text style={styles.subText}>AIが料理を認識してレシピを表示します</Text>

      {/* 🆕 Stylish image preview box */}
      <View style={styles.previewBox}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Ionicons name="image-outline" size={80} color="#ccc" />
        )}
      </View>

      {/* 🆕 Replaced old buttons with modern TouchableOpacity */}
      <TouchableOpacity style={styles.pickBtn} onPress={pickImage}>
        <Ionicons name="images" size={22} color="#fff" />
        <Text style={styles.btnText}>画像を選択</Text>
      </TouchableOpacity>

      {imageUri && (
        <TouchableOpacity style={styles.analyzeBtn} onPress={analyzeImage}>
          <Ionicons name="search" size={22} color="#fff" />
          <Text style={styles.btnText}>AIで分析する</Text>
        </TouchableOpacity>
      )}

      {/* 🆕 Modern loading indicator */}
      {loading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#FF6347" />
          <Text style={styles.loadingText}>分析中...</Text>
        </View>
      )}
    </View>
  );
}

// ===========================================================
// 🎨 Styles (Only visual updates — backend untouched)
// ===========================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 70,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 6,
  },
  subText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  previewBox: {
    width: 280,
    height: 280,
    backgroundColor: "#fafafa",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  pickBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 10,
    shadowColor: "#007AFF",
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  analyzeBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6347",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: "#FF6347",
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  loadingBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  loadingText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#FF6347",
  },
});

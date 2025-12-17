import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import GlobalWrapper from "../components/GlobalWrapper";
import TypingText from "../components/TypingText";

import { useTheme } from "../context/ThemeContext";
import { Colors } from "../constants/colors";
import { useTextSize } from "../context/TextSizeContext";

const API_URL = "https://cautiously-mesocratic-albert.ngrok-free.dev";

export default function RecipeScreen({ route }) {
  const navigation = useNavigation<any>();

  const { isDark } = useTheme();
  const theme = isDark ? Colors.dark : Colors.light;
  const { fontSize } = useTextSize();

  const recipeFromResult = route?.params?.recipe;
  const recipeName = route?.params?.recipeName;

  // ----------------------------------
  // Normalize recipe
  // ----------------------------------
  const normalizeRecipe = (r: any) => {
    if (!r) return null;
    return {
      name_jp: r.name_jp || r.title_jp || r.name_en || "料理名不明",
      name_en: r.name_en || r.name_jp || "",
      image: r.image || null,
      instructions_jp:
        r.instructions_jp ||
        r.instructions_en ||
        "作り方の情報がありません。",
      ingredients_jp: r.ingredients_jp || [],
      sourceUrl: r.sourceUrl || null,
    };
  };

  // ----------------------------------
  // State
  // ----------------------------------
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Share modal
  const [shareVisible, setShareVisible] = useState(false);
  const [opinion, setOpinion] = useState("");
  const [sharing, setSharing] = useState(false);

  // ----------------------------------
  // Reset when params change
  // ----------------------------------
  useEffect(() => {
    if (recipeFromResult) {
      setRecipe(normalizeRecipe(recipeFromResult));
      setLoading(false);
      return;
    }

    if (recipeName) {
      setRecipe(null);
      setLoading(true);
    }
  }, [recipeFromResult, recipeName]);

  // ----------------------------------
  // Fetch recipe by name
  // ----------------------------------
  useEffect(() => {
    if (!recipeName || recipeFromResult) return;

    const fetchRecipe = async () => {
      try {
        const res = await fetch(`${API_URL}/recipe/${recipeName}`);
        const data = await res.json();
        setRecipe(data.recipe ? normalizeRecipe(data.recipe) : null);
      } catch {
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeName]);

  // ----------------------------------
  // Favorite logic
  // ----------------------------------
  useEffect(() => {
    if (!recipe) return;

    const load = async () => {
      const stored = JSON.parse(await AsyncStorage.getItem("favorites")) || [];
      setIsFavorite(stored.some((r) => r.name_jp === recipe.name_jp));
    };

    load();
  }, [recipe]);

  const toggleFavorite = async () => {
    const stored = JSON.parse(await AsyncStorage.getItem("favorites")) || [];
    const updated = isFavorite
      ? stored.filter((r) => r.name_jp !== recipe.name_jp)
      : [...stored, recipe];

    await AsyncStorage.setItem("favorites", JSON.stringify(updated));
    setIsFavorite(!isFavorite);
  };

  // ----------------------------------
  // Share to Community
  // ----------------------------------
  const submitShare = async () => {
  try {
    setSharing(true);

    const storedUser = await AsyncStorage.getItem("user");
    if (!storedUser) {
      Alert.alert("エラー", "ログインが必要です");
      return;
    }

    const user = JSON.parse(storedUser);

    const res = await fetch(`${API_URL}/api/community/post`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        dish_name: recipe.name_jp,
        dish_image: recipe.image || "https://via.placeholder.com/300",
        opinion,
      }),
    });

    if (!res.ok) {
      throw new Error("Post failed");
    }

    Alert.alert("成功", "コミュニティに投稿しました！");
    setOpinion("");
    setShareVisible(false);
  } catch (e) {
    Alert.alert("エラー", "投稿に失敗しました");
  } finally {
    setSharing(false);
  }
};


  // ----------------------------------
  // Clean HTML
  // ----------------------------------
  const clean = (text: string) =>
    text
      ?.replace(/<li>/g, "• ")
      .replace(/<\/li>/g, "\n")
      .replace(/<\/?[^>]+>/g, "")
      .replace(/\n{2,}/g, "\n")
      .trim() || "";

  // ----------------------------------
  // UI STATES
  // ----------------------------------
  if (loading) {
    return (
      <GlobalWrapper>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FF7043" />
        </View>
      </GlobalWrapper>
    );
  }

  if (!recipe) {
    return (
      <GlobalWrapper>
        <View style={styles.center}>
          <Text style={{ fontSize: fontSize + 2, color: theme.text }}>
            レシピが見つかりません
          </Text>
        </View>
      </GlobalWrapper>
    );
  }

  // ----------------------------------
  // MAIN UI
  // ----------------------------------
  return (
    <GlobalWrapper>
      <ScrollView style={{ backgroundColor: theme.background }}>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Image
            source={{ uri: recipe.image || "https://via.placeholder.com/400" }}
            style={styles.image}
          />

          <View style={styles.titleRow}>
            <Text
              style={[
                styles.title,
                { color: theme.text, fontSize: fontSize + 6 },
              ]}
            >
              {recipe.name_jp}
            </Text>

            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{ marginRight: 12 }}
                onPress={() => setShareVisible(true)}
              >
                <Ionicons
                  name="share-social-outline"
                  size={26}
                  color={theme.text}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={toggleFavorite}>
                <Ionicons
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={26}
                  color={isFavorite ? "red" : theme.text}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { fontSize: fontSize + 3 }]}>
          🍴 材料
        </Text>

        <View
          style={[
            styles.ingredientsBox,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          {recipe.ingredients_jp.map((i: string, idx: number) => (
            <Text key={idx} style={{ fontSize, color: theme.text }}>
              • {i}
            </Text>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { fontSize: fontSize + 3 }]}>
          🧑‍🍳 作り方
        </Text>

        <TypingText
          text={clean(recipe.instructions_jp)}
          textStyle={{ color: theme.text, fontSize }}
        />

        {!!recipe.sourceUrl && (
          <Text
            style={[styles.link, { fontSize: fontSize + 1 }]}
            onPress={() => Linking.openURL(recipe.sourceUrl)}
          >
            🔗 View Full Recipe
          </Text>
        )}
      </ScrollView>

      {/* ======================
          Share Modal
      ====================== */}
      <Modal visible={shareVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.card },
            ]}
          >
            <Text style={{ fontSize: fontSize + 2, marginBottom: 12 }}>
              コミュニティに投稿
            </Text>

            <TextInput
              placeholder="感想を書いてください（任意）"
              placeholderTextColor="#999"
              value={opinion}
              onChangeText={setOpinion}
              style={[
                styles.input,
                { color: theme.text, borderColor: theme.border },
              ]}
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setShareVisible(false)}>
                <Text style={{ color: "gray" }}>キャンセル</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={submitShare} disabled={sharing}>
                <Text style={{ color: "#FF7043", fontWeight: "bold" }}>
                  {sharing ? "投稿中..." : "投稿"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </GlobalWrapper>
  );
}

// ----------------------------------
// Styles
// ----------------------------------
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    borderRadius: 14,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
  },
  image: { width: "100%", height: 250 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
  },
  title: { fontWeight: "bold", flex: 1 },
  sectionTitle: {
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 8,
    color: "#FF7043",
  },
  ingredientsBox: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  link: {
    marginTop: 20,
    textDecorationLine: "underline",
    marginBottom: 30,
    color: "#4285F4",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    borderRadius: 12,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

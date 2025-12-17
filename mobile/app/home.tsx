import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useTheme } from "../context/ThemeContext";
import { Colors } from "../constants/colors";
import { useTextSize } from "../context/TextSizeContext";

const API_URL = "https://cautiously-mesocratic-albert.ngrok-free.dev";

export default function HomeScreen({ navigation }) {
  const { fontSize } = useTextSize();
  const { isDark } = useTheme();
  const theme = isDark ? Colors.dark : Colors.light;

  const [loading, setLoading] = useState(true);
  const [foods, setFoods] = useState([]);

  const [communityPosts, setCommunityPosts] = useState([]);
  const [loadingCommunity, setLoadingCommunity] = useState(true);

  // Comment modal
  const [commentVisible, setCommentVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    loadRecommendations();
    loadCommunityFeed();
  }, []);

  // =========================
  // Load recommended foods
  // =========================
  const loadRecommendations = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) {
        setLoading(false);
        return;
      }

      const user = JSON.parse(storedUser);
      if (!user.name) {
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/recommendations/name/${user.name}`);
      const data = await res.json();

      if (data.items) setFoods(data.items);
    } catch (e) {
      console.log("ERROR loading recommendations:", e);
    }
    setLoading(false);
  };

  // =========================
  // Load community feed
  // =========================
  const loadCommunityFeed = async () => {
    try {
      const res = await fetch(`${API_URL}/api/community/posts`);
      const data = await res.json();
      setCommunityPosts(data);
    } catch (e) {
      console.log("ERROR loading community feed:", e);
    }
    setLoadingCommunity(false);
  };

  // =========================
  // Navigation
  // =========================
  const openRecipe = (foodName: string) => {
    if (!foodName) return;
    navigation.navigate("Recipe", { recipeName: foodName });
  };

  // =========================
  // Like post
  // =========================
  const likePost = async (postId: number) => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) return;

      const user = JSON.parse(storedUser);

      await fetch(
        `${API_URL}/api/community/post/${postId}/like?user_id=${user.id}`,
        { method: "POST" }
      );

      loadCommunityFeed();
    } catch {
      Alert.alert("エラー", "いいねに失敗しました");
    }
  };

  // =========================
  // Submit comment
  // =========================
  const submitComment = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser || !selectedPostId) return;

      const user = JSON.parse(storedUser);

      await fetch(
        `${API_URL}/api/community/post/${selectedPostId}/comment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            comment: commentText,
          }),
        }
      );

      setCommentText("");
      setSelectedPostId(null);
      setCommentVisible(false);
      loadCommunityFeed();
    } catch {
      Alert.alert("エラー", "コメント送信に失敗しました");
    }
  };

  // =========================
  // Loading screen
  // =========================
  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#FF6347" />
      </View>
    );
  }

  // =========================
  // MAIN UI
  // =========================
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* ========= Recommended ========= */}
      <Text style={[styles.title, { fontSize: fontSize + 6, color: theme.text }]}>
        あなたへのおすすめ
      </Text>

      {foods.length === 0 && (
        <Text style={[styles.noResults, { fontSize, color: theme.text }]}>
          おすすめの料理がありません。
        </Text>
      )}

      {foods.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
          onPress={() => openRecipe(item.name)}
        >
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.image} />
          ) : (
            <View
              style={[
                styles.placeholder,
                { backgroundColor: isDark ? "#222" : "#f0f0f0" },
              ]}
            >
              <Text style={{ color: isDark ? "#aaa" : "#777", fontSize }}>
                No Image
              </Text>
            </View>
          )}

          <Text
            style={[
              styles.cardTitle,
              { color: theme.text, fontSize: fontSize + 1 },
            ]}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      ))}

      {/* ========= Community Feed ========= */}
      <Text
        style={[
          styles.sectionTitle,
          { fontSize: fontSize + 4, color: theme.text },
        ]}
      >
        🌍 Community Feed
      </Text>

      {loadingCommunity && <ActivityIndicator color="#FF6347" />}

      {!loadingCommunity && communityPosts.length === 0 && (
        <Text style={[styles.noResults, { fontSize, color: theme.text }]}>
          まだ投稿がありません。
        </Text>
      )}

      {communityPosts.map((post) => (
        <TouchableOpacity
          key={post.id}
          style={[
            styles.communityCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
          onPress={() => openRecipe(post.dish_name)}
        >
          <Image source={{ uri: post.dish_image }} style={styles.communityImage} />

          <View style={styles.communityContent}>
            <Text
              style={[
                styles.communityTitle,
                { color: theme.text, fontSize: fontSize + 1 },
              ]}
            >
              {post.dish_name}
            </Text>

            {post.opinion && (
              <Text style={{ color: theme.text, fontSize }}>
                {post.opinion}
              </Text>
            )}

            <View style={styles.communityActions}>
              <TouchableOpacity onPress={() => likePost(post.id)}>
                <Text style={{ color: theme.text }}>❤️ {post.likes}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setSelectedPostId(post.id);
                  setCommentVisible(true);
                }}
              >
                <Text style={{ color: theme.text }}>💬 {post.comments}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      ))}

      {/* ========= Comment Modal ========= */}
      <Modal visible={commentVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={{ fontSize: fontSize + 2, marginBottom: 10 }}>
              コメントを書く
            </Text>

            <TextInput
              value={commentText}
              onChangeText={setCommentText}
              placeholder="コメント..."
              placeholderTextColor="#999"
              style={[
                styles.input,
                { color: theme.text, borderColor: theme.border },
              ]}
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setCommentVisible(false)}>
                <Text style={{ color: "gray" }}>キャンセル</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={submitComment}>
                <Text style={{ color: "#FF6347", fontWeight: "bold" }}>
                  送信
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

// =========================
// Styles
// =========================
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  title: { fontWeight: "bold", marginBottom: 20 },
  sectionTitle: { fontWeight: "bold", marginTop: 30, marginBottom: 12 },

  noResults: { textAlign: "center", marginVertical: 20 },

  card: {
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    borderWidth: 1,
    elevation: 2,
  },

  image: { width: "100%", height: 150, borderRadius: 8 },
  placeholder: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: { marginTop: 10, fontWeight: "600" },

  communityCard: {
    flexDirection: "row",
    padding: 10,
    marginBottom: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  communityImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 10,
  },
  communityContent: { flex: 1 },
  communityTitle: { fontWeight: "600" },
  communityActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: { borderRadius: 12, padding: 16 },
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

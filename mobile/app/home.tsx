import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { getFeed } from "./api/posts";

import FeedPost from "./community/FeedPost";

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [feed, setFeed] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadFeed = async () => {
    try {
      const res = await getFeed();

      const updated = res.data.map((p: any) => ({
        ...p,
        image_url_full: `https://cautiously-mesocratic-albert.ngrok-free.dev${p.image_url}`,
      }));

      setFeed(updated);
    } catch (error) {
      console.log("Feed load error:", error);
    }
  };

  // Refresh when pulling
  const onRefresh = async () => {
    setRefreshing(true);
    await loadFeed();
    setRefreshing(false);
  };

  // Auto refresh when returning from AddPost or Comments
  useFocusEffect(
    useCallback(() => {
      loadFeed();
    }, [])
  );

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🍱 Food AI アプリ</Text>

        {/* Top-right Add Post Button */}
        <TouchableOpacity onPress={() => navigation.navigate("AddPost")}>
          <Ionicons name="add-circle-outline" size={32} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

        {/* AI RECOMMENDATIONS */}
        <Text style={styles.sectionTitle}>🤖 今日のおすすめ</Text>

        <View style={styles.recommendBox}>
          <Text style={{ color: "#666", fontSize: 13 }}>
            ※ AI おすすめ機能は現在準備中です
          </Text>
        </View>

        {/* COMMUNITY FEED */}
        <Text style={styles.sectionTitle}>🔥 コミュニティ投稿</Text>

        {feed.length === 0 ? (
          <Text style={styles.emptyText}>投稿がありません</Text>
        ) : (
          feed.map((post: any) => (
            <FeedPost key={post.id} post={post} navigation={navigation} />
          ))
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    marginTop: 60, // Safe area
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 25,
    marginLeft: 20,
  },

  recommendBox: {
    marginTop: 10,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f2f2f7",
  },

  emptyText: {
    textAlign: "center",
    color: "#777",
    marginTop: 15,
    fontSize: 14,
  },
});

import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Share,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { likePost } from "../api/posts";

export default function FeedPost({ post, navigation }: any) {
  const sharePost = async () => {
    await Share.share({
      message: `${post.caption}\n画像: ${post.image_url}`,
    });
  };

  return (
    <View style={styles.card}>
      {/* Image */}
      <Image
        source={{ uri: post.image_url_full }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Caption */}
      <Text style={styles.caption}>{post.caption}</Text>

      {/* Buttons */}
      <View style={styles.row}>
        <TouchableOpacity onPress={() => likePost(post.id)}>
          <Ionicons name="heart-outline" size={26} color="#FF3B30" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Comments", { post })}
        >
          <Ionicons name="chatbubble-outline" size={26} color="#007AFF" />
        </TouchableOpacity>

        <TouchableOpacity onPress={sharePost}>
          <Ionicons name="share-outline" size={26} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    marginBottom: 20,
    borderRadius: 12,
    elevation: 3,
    overflow: "hidden",
  },
  image: { width: "100%", height: 280 },
  caption: { padding: 12, fontSize: 15, color: "#222" },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 12,
    paddingTop: 6,
  },
});

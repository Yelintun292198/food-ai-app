import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadPost } from "../api/posts";

export default function AddPost({ navigation }: any) {
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState("");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const submitPost = async () => {
    if (!image) return alert("画像を選択してください");

    await uploadPost(image, caption);
    alert("投稿されました！");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage} style={styles.pickButton}>
        <Text style={styles.pickText}>画像を選択</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.preview} />}

      <TextInput
        style={styles.captionInput}
        placeholder="キャプションを書く..."
        value={caption}
        onChangeText={setCaption}
      />

      <TouchableOpacity onPress={submitPost} style={styles.uploadButton}>
        <Text style={styles.uploadText}>投稿する</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  pickButton: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  pickText: { color: "white", fontSize: 16, fontWeight: "bold" },
  preview: { width: "100%", height: 300, marginVertical: 20, borderRadius: 12 },
  captionInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: "#34C759",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  uploadText: { color: "white", fontWeight: "bold", fontSize: 16 },
});

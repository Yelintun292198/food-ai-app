import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { getComments, addComment } from "../api/posts";

export default function Comments({ route }: any) {
  const post = route.params.post;

  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const loadComments = async () => {
    const res = await getComments(post.id);
    setComments(res.data);
  };

  const sendComment = async () => {
    if (!text) return;
    await addComment(post.id, text);
    setText("");
    loadComments();
  };

  useEffect(() => {
    loadComments();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <ScrollView>
        {comments.map((c: any) => (
          <Text key={c.id} style={styles.comment}>
            {c.comment}
          </Text>
        ))}
      </ScrollView>

      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          placeholder="コメントを書く..."
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity onPress={sendComment} style={styles.sendBtn}>
          <Text style={{ color: "white" }}>送信</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  comment: { fontSize: 15, marginBottom: 10 },
  inputBox: { flexDirection: "row", marginTop: 20 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  sendBtn: {
    backgroundColor: "#007AFF",
    marginLeft: 10,
    padding: 12,
    borderRadius: 8,
  },
});

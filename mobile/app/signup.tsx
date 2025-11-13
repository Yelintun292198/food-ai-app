import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// 🧭 Dynamic API URL (works with .env or fallback)
const API_URL =
  (process.env.EXPO_PUBLIC_API_URL ||
    "https://cautiously-mesocratic-albert.ngrok-free.dev").replace(/\/$/, "");

export default function SignUpScreen() {
  const navigation = useNavigation<any>();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignUp = async () => {
    if (!username || !email || !password) {
      Alert.alert("入力エラー", "すべての項目を入力してください");
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert("メール形式エラー", "正しいメールアドレスを入力してください");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (res.ok) {
        Alert.alert("登録完了", "ログイン画面に戻ります");
        navigation.navigate("ログイン画面");
      } else {
        const data = await res.json();
        Alert.alert("登録失敗", data.detail || "登録に失敗しました");
      }
    } catch (err) {
      Alert.alert("エラー", "通信に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>🎉 新規登録</Text>

          <Text style={styles.label}>ユーザー名</Text>
          <TextInput
            style={styles.input}
            placeholder="例: daisho123"
            value={username}
            onChangeText={setUsername}
          />

          <Text style={styles.label}>メールアドレス</Text>
          <TextInput
            style={styles.input}
            placeholder="例: example@mail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Text style={styles.label}>パスワード</Text>
          <TextInput
            style={styles.input}
            placeholder="●●●●●●"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View style={styles.buttonWrapper}>
            <Button
              title={loading ? "登録中..." : "登録する"}
              onPress={handleSignUp}
              disabled={loading}
              color="#007AFF"
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <Button
              title="ログイン画面に戻る"
              onPress={() => navigation.navigate("ログイン画面")}
              color="#888"
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    marginTop: 12,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  buttonWrapper: {
    marginTop: 20,
  },
});

import React, { useState, useEffect } from "react";
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
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
WebBrowser.maybeCompleteAuthSession();

// ⭐ Your backend URL
const API_URL = "https://cautiously-mesocratic-albert.ngrok-free.dev";

export default function LoginScreen() {
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ⭐ Google OAuth configuration
  const [request, response, promptAsync] = Google.useAuthRequest(
    {
      iosClientId:
        "182333209636-n2h0rqca8ve59qqfadegf0o63qacki40.apps.googleusercontent.com",
      androidClientId:
        "182333209636-rb90shigli8gkarn9l5hn3rgb0njl9rr.apps.googleusercontent.com",
      expoClientId:
        "182333209636-qfto1k7ijvea0bvcnq9r527v8mf3lahu.apps.googleusercontent.com",
    },
    {
      useProxy: true,
      redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    }
  );

  // Debug redirect URL
  useEffect(() => {
    console.log(
      "🔥 Redirect URI from Expo:",
      AuthSession.makeRedirectUri({ useProxy: true })
    );
  }, []);

  // Handle Google login
  useEffect(() => {
    if (response?.type === "success") {
      const accessToken = response.authentication?.accessToken;
      if (accessToken) {
        handleGoogleLogin(accessToken);
      }
    }
  }, [response]);

  // ⭐ Send Google OAuth token to backend
  const handleGoogleLogin = async (accessToken: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: accessToken }),
      });

      const data = await res.json();

      if (res.ok) {
        // ⭐ Save user object in AsyncStorage
        await AsyncStorage.setItem(
          "user",
          JSON.stringify({
            name: data.name,
            access_token: data.access_token,
            email: data.email || null,
          })
        );

        Alert.alert("ログイン成功", `${data.name} さんようこそ！`);

        navigation.reset({
        index: 0,
        routes: [{ name: "Tabs" }],
          });

      } else {
        Alert.alert("ログイン失敗", data.detail || "Google ログインに失敗しました");
      }
    } catch (err) {
      Alert.alert("エラー", "Google ログイン通信エラー");
    }
  };

  // ⭐ Email login method
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("入力エラー", "メールアドレスとパスワードを入力してください");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // ⭐ Backend returns: { access_token, name }
        await AsyncStorage.setItem(
          "user",
          JSON.stringify({
            name: data.name,
            access_token: data.access_token,
            email: email,
          })
        );

        Alert.alert("ログイン成功", `${data.name} さんようこそ！`);

        navigation.reset({
          index: 0,
          routes: [{ name: "Tabs" }],
        });
      } else {
        Alert.alert("ログイン失敗", data.detail || "ログインに失敗しました");
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
          <Text style={styles.title}>ログイン</Text>

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
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Button
            title={loading ? "ログイン中..." : "ログイン"}
            onPress={handleLogin}
            disabled={loading}
          />

          <TouchableOpacity
            style={styles.googleButton}
            onPress={() => promptAsync()}
          >
            <Text style={styles.googleText}>Google でログイン</Text>
          </TouchableOpacity>

          <View style={{ marginTop: 20 }}>
            <Button
              title="新規登録はこちら"
              onPress={() => navigation.navigate("Signup")}
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
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
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
  googleButton: {
    marginTop: 20,
    backgroundColor: "#4285F4",
    paddingVertical: 14,
    borderRadius: 8,
  },
  googleText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});

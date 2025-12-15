import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Slider from "@react-native-community/slider";
import { useTextSize } from "../context/TextSizeContext";
import { useTheme } from "../context/ThemeContext";
import { Colors } from "../constants/colors";

export default function SettingsScreen() {
  const navigation = useNavigation<any>();

  // Theme (Dark / Light)
  const { isDark, toggleTheme } = useTheme();
  const theme = isDark ? Colors.dark : Colors.light;

  // Text Size (Dynamic scaling)
  const { fontSize, setFontSize } = useTextSize();

  // =========================
  // 🔐 LOGOUT FUNCTION
  // =========================
  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        "access_token",
        "user",
      ]);

      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      Alert.alert("エラー", "ログアウトに失敗しました");
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Header */}
      <Text
        style={[
          styles.header,
          { color: theme.text, fontSize: fontSize + 4 },
        ]}
      >
        アカウント設定
      </Text>

      {/* Profile Section */}
      <View
        style={[
          styles.card,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <Text
          style={[
            styles.cardTitle,
            { color: theme.text, fontSize: fontSize + 2 },
          ]}
        >
          プロフィール
        </Text>

        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate("Profile")}
        >
          <Ionicons name="person-circle-outline" size={28} color="#007AFF" />
          <Text style={[styles.rowText, { color: theme.text, fontSize }]}>
            プロフィールを編集
          </Text>
        </TouchableOpacity>
      </View>

      {/* APP SETTINGS */}
      <View
        style={[
          styles.card,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <Text
          style={[
            styles.cardTitle,
            { color: theme.text, fontSize: fontSize + 2 },
          ]}
        >
          アプリ設定
        </Text>

        {/* Language */}
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate("Language")}
        >
          <Ionicons name="language-outline" size={26} color="#007AFF" />
          <Text style={[styles.rowText, { color: theme.text, fontSize }]}>
            言語設定 (日本語 / English)
          </Text>
        </TouchableOpacity>

        {/* TEXT SIZE */}
        <View style={styles.row}>
          <Ionicons name="text-outline" size={26} color="#007AFF" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.rowText, { color: theme.text, fontSize }]}>
              文字サイズ調整
            </Text>

            <Slider
              style={{ width: "100%", height: 40 }}
              minimumValue={12}
              maximumValue={28}
              step={1}
              value={fontSize}
              onValueChange={(val) => setFontSize(val)}
              minimumTrackTintColor="#007AFF"
              maximumTrackTintColor="#ccc"
            />

            <Text style={[styles.rowText, { color: theme.text, fontSize }]}>
              現在のサイズ: {fontSize}
            </Text>
          </View>
        </View>

        {/* DARK MODE */}
        <View style={styles.row}>
          <Ionicons
            name={isDark ? "moon" : "sunny"}
            size={26}
            color={isDark ? "#FFD700" : "#FF9500"}
          />

          <Text style={[styles.rowText, { color: theme.text, fontSize }]}>
            ダークモード
          </Text>

          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            thumbColor={isDark ? "#FFD700" : "#f4f3f4"}
            trackColor={{ false: "#ccc", true: "#666" }}
            style={{ marginLeft: "auto" }}
          />
        </View>
      </View>

      {/* DATA */}
      <View
        style={[
          styles.card,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <Text
          style={[
            styles.cardTitle,
            { color: theme.text, fontSize: fontSize + 2 },
          ]}
        >
          データ管理
        </Text>

        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate("Favorites")}
        >
          <Ionicons name="heart-outline" size={26} color="#FF3B30" />
          <Text style={[styles.rowText, { color: theme.text, fontSize }]}>
            お気に入りを開く
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate("History")}
        >
          <Ionicons name="time-outline" size={26} color="#FF9500" />
          <Text style={[styles.rowText, { color: theme.text, fontSize }]}>
            履歴を見る
          </Text>
        </TouchableOpacity>
      </View>

      {/* LOGOUT */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>ログアウト</Text>
      </TouchableOpacity>

      {/* Version */}
      <Text style={[styles.version, { color: theme.text, fontSize }]}>
        SmartChef AI App v1.0.0
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { fontWeight: "bold", padding: 20, paddingTop: 40 },

  card: {
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 12,
    borderWidth: 1,
  },

  cardTitle: {
    fontWeight: "600",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  rowText: {
    marginLeft: 12,
  },

  logoutBtn: {
    marginTop: 30,
    marginBottom: 60,
    backgroundColor: "#FF3B30",
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
  },

  logoutText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },

  version: {
    textAlign: "center",
    marginBottom: 40,
    opacity: 0.6,
  },
});

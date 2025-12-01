import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function SettingsScreen() {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const bg = { backgroundColor: isDark ? "#000" : "#fff" };
  const text = { color: isDark ? "#fff" : "#000" };
  const card = {
    backgroundColor: isDark ? "#111" : "#f7f7f7",
    borderColor: isDark ? "#222" : "#ddd",
  };

  return (
    <ScrollView style={[styles.container, bg]}>
      <Text style={[styles.header, text]}>アカウント設定</Text>

      {/* Profile Section */}
      <View style={[styles.card, card]}>
        <Text style={[styles.cardTitle, text]}>プロフィール</Text>

        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate("Profile")}
        >
          <Ionicons name="person-circle-outline" size={28} color="#007AFF" />
          <Text style={[styles.rowText, text]}>プロフィールを編集</Text>
        </TouchableOpacity>
      </View>

      {/* Preferences */}
      <View style={[styles.card, card]}>
        <Text style={[styles.cardTitle, text]}>アプリ設定</Text>

        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate("Language")}
        >
          <Ionicons name="language-outline" size={26} color="#007AFF" />
          <Text style={[styles.rowText, text]}>言語設定 (日本語 / English)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <Ionicons name="text-outline" size={26} color="#007AFF" />
          <Text style={[styles.rowText, text]}>
            ユニバーサルデザイン (大きい文字)
          </Text>
        </TouchableOpacity>
      </View>

      {/* App Features */}
      <View style={[styles.card, card]}>
        <Text style={[styles.cardTitle, text]}>データ管理</Text>

        {/* ❤️ FAVORITES */}
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate("Favorites")}
        >
          <Ionicons name="heart-outline" size={26} color="#FF3B30" />
          <Text style={[styles.rowText, text]}>お気に入りを開く</Text>
        </TouchableOpacity>

        {/* 🕒 HISTORY */}
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate("History")}
        >
          <Ionicons name="time-outline" size={26} color="#FF9500" />
          <Text style={[styles.rowText, text]}>履歴を見る</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <Ionicons name="trash-outline" size={26} color="#FF3B30" />
          <Text style={[styles.rowText, text]}>履歴を削除</Text>
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn}>
        <Text style={styles.logoutText}>ログアウト</Text>
      </TouchableOpacity>

      <Text style={[styles.version, text]}>SmartChef AI App v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { fontSize: 26, fontWeight: "bold", padding: 20, paddingTop: 40 },
  card: {
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 12,
    borderWidth: 1,
  },
  cardTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  rowText: { marginLeft: 12, fontSize: 16 },
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
  version: { textAlign: "center", marginBottom: 40, opacity: 0.5 },
});

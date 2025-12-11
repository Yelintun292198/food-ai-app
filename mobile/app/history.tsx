import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Swipeable } from "react-native-gesture-handler";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

import { useTheme } from "../context/ThemeContext";
import { Colors } from "../constants/colors";
import { useTextSize } from "../context/TextSizeContext";

export default function HistoryScreen() {
  const navigation = useNavigation();
  const [history, setHistory] = useState([]);

  const { isDark } = useTheme();
  const theme = isDark ? Colors.dark : Colors.light;

  const { fontSize } = useTextSize(); // ← TEXT SIZE

  const loadHistory = async () => {
    const stored = JSON.parse(await AsyncStorage.getItem("history")) || [];
    setHistory(stored);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadHistory);
    return unsubscribe;
  }, [navigation]);

  const removeItem = async (name: string) => {
    const updated = history.filter((item) => item.name !== name);
    await AsyncStorage.setItem("history", JSON.stringify(updated));
    setHistory(updated);
  };

  const clearHistory = () => {
    Alert.alert("履歴を削除", "全ての履歴を削除しますか？", [
      { text: "キャンセル", style: "cancel" },
      {
        text: "削除",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("history");
          setHistory([]);
        },
      },
    ]);
  };

  const renderRightActions = (name: string) => (
    <TouchableOpacity
      style={styles.deleteSwipe}
      onPress={() => removeItem(name)}
    >
      <Ionicons name="trash" size={30} color="#fff" />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: theme.text, fontSize: fontSize + 4 }]}>
          履歴
        </Text>

        {history.length > 0 && (
          <TouchableOpacity onPress={clearHistory}>
            <Ionicons name="trash-outline" size={28} color="red" />
          </TouchableOpacity>
        )}
      </View>

      {/* EMPTY STATE */}
      {history.length === 0 ? (
        <View style={styles.emptyBox}>
          <LottieView
            autoPlay
            loop
            style={{ width: 180, height: 180 }}
            source={require("../assets/empty.json")}
          />
          <Text style={[styles.empty, { color: isDark ? "#bbb" : "#777", fontSize }]}>
            まだ履歴がありません
          </Text>
        </View>
      ) : (
        <ScrollView>
          {history.map((item, idx) => (
            <Swipeable
              key={idx}
              renderRightActions={() => renderRightActions(item.name)}
            >
              <View
                style={[
                  styles.card,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                {/* Thumbnail */}
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.thumb} />
                ) : (
                  <View
                    style={[
                      styles.thumb,
                      styles.placeholder,
                      { backgroundColor: isDark ? "#333" : "#eee" },
                    ]}
                  >
                    <Text style={{ color: theme.text, fontSize }}>🍽️</Text>
                  </View>
                )}

                {/* Info */}
                <View style={styles.info}>
                  <Text
                    style={[
                      styles.date,
                      { color: isDark ? "#aaa" : "#777", fontSize: fontSize - 2 },
                    ]}
                  >
                    {item.date}
                  </Text>
                  <Text
                    style={[
                      styles.name,
                      { color: theme.text, fontSize: fontSize + 1 },
                    ]}
                  >
                    {item.name}
                  </Text>
                </View>

                {/* Detail Button */}
                <LinearGradient
                  colors={["#FF7F50", "#FF6347"]}
                  style={styles.detailBtn}
                >
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Recipe", {
                        recipeName: item.name,
                      })
                    }
                  >
                    <Ionicons name="arrow-forward" size={22} color="#fff" />
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </Swipeable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

//
// Styles
//
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    alignItems: "center",
  },

  title: { fontWeight: "bold" },

  emptyBox: { justifyContent: "center", alignItems: "center", marginTop: 40 },
  empty: {},

  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },

  thumb: { width: 70, height: 70, borderRadius: 14 },
  placeholder: { justifyContent: "center", alignItems: "center" },

  info: { flex: 1, marginLeft: 12 },

  date: {},
  name: { fontWeight: "bold" },

  deleteSwipe: {
    width: 80,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 16,
  },

  detailBtn: {
    padding: 10,
    borderRadius: 12,
  },
});

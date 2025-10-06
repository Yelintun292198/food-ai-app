import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App";

const historyData = [
  { date: "2025-09-30", name: "カレーライス", image: "https://picsum.photos/100/100?1" },
  { date: "2025-09-29", name: "ラーメン", image: "https://picsum.photos/100/100?2" },
  { date: "2025-09-28", name: "寿司", image: "https://picsum.photos/100/100?3" },
  { date: "2025-09-27", name: "天ぷら", image: "" },
  { date: "2025-09-26", name: "うどん", image: "https://picsum.photos/100/100?5" },
];

export default function HistoryScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>履歴画面</Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {historyData.map((item, idx) => (
          <View key={idx} style={styles.card}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.thumb} />
            ) : (
              <View style={[styles.thumb, styles.placeholder]}>
                <Text>🖼</Text>
              </View>
            )}
            <View style={styles.info}>
              <Text style={styles.date}>日付: {item.date}</Text>
              <Text style={styles.name}>料理名: {item.name}</Text>
            </View>

            <TouchableOpacity
              style={styles.detailBtn}
              onPress={() => navigation.navigate("レシピ画面")}
            >
              <Text style={styles.detailText}>詳細</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.homeBtn}
        onPress={() => navigation.navigate("ホーム画面")}
      >
        <Text style={styles.homeText}>ホームに戻る</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
  },
  thumb: { width: 60, height: 60, borderRadius: 8, backgroundColor: "#eee" },
  placeholder: { justifyContent: "center", alignItems: "center" },
  info: { flex: 1, marginLeft: 10 },
  date: { fontSize: 12, color: "#555" },
  name: { fontSize: 14, fontWeight: "bold" },
  detailBtn: {
    backgroundColor: "#f1f1f1",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  detailText: { fontSize: 12 },
  homeBtn: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    width: "90%",
  },
  homeText: { fontSize: 14, fontWeight: "bold" },
});

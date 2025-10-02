import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ホーム画面</Text>

      <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push("/preview")}>
        <Text style={styles.primaryText}>撮影する</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push("/preview")}>
        <Text style={styles.secondaryText}>ギャラリーから選択</Text>
      </TouchableOpacity>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navBtn} onPress={() => router.push("/history")}>
          <Text style={styles.navText}>履歴</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={() => router.push("/favorites")}>
          <Text style={styles.navText}>お気に入り</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 40 },
  primaryBtn: {
    backgroundColor: "#000",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginBottom: 20,
  },
  primaryText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  secondaryBtn: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginBottom: 40,
  },
  secondaryText: { color: "#000", fontSize: 16 },
  bottomNav: {
    position: "absolute",
    bottom: 30,
    flexDirection: "row",
    gap: 40,
  },
  navBtn: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  navText: { fontSize: 14 },
});

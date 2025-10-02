import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function PreviewScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>プレビュー画面</Text>

      <Image
        source={{ uri: "https://picsum.photos/400/300" }}
        style={styles.image}
      />

      <View style={styles.bottom}>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.back()}>
          <Text style={styles.secondaryText}>再撮影</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push("/result")}>
          <Text style={styles.primaryText}>使用する</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", paddingTop: 50, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  image: { width: 300, height: 250, borderRadius: 10, marginBottom: 20 },
  bottom: { flexDirection: "row", gap: 20, position: "absolute", bottom: 40 },
  primaryBtn: { backgroundColor: "#000", paddingVertical: 12, paddingHorizontal: 40, borderRadius: 25 },
  primaryText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  secondaryBtn: { backgroundColor: "#f5f5f5", paddingVertical: 12, paddingHorizontal: 40, borderRadius: 25 },
  secondaryText: { color: "#000", fontSize: 16 },
});

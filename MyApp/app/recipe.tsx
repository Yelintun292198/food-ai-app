import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function RecipeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>レシピ画面</Text>

      <View style={styles.infoBox}>
        <Text>料理名: ○○</Text>
        <Text>材料: ●●, △△ …</Text>
        <Text>手順: 1 → 2 → 3</Text>
        <Text>調理時間: 30分</Text>
      </View>

      <View style={styles.steps}>
        <View style={styles.stepCard}>
          <Text style={styles.stepTitle}>手順 1</Text>
          <Text>材料を準備する</Text>
        </View>
        <View style={styles.stepCard}>
          <Text style={styles.stepTitle}>手順 2</Text>
          <Text>調理する</Text>
        </View>
        <View style={styles.stepCard}>
          <Text style={styles.stepTitle}>手順 3</Text>
          <Text>盛り付ける</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.homeBtn} onPress={() => router.push("/")}>
        <Text style={styles.homeText}>ホームに戻る</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 50 },
  title: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  infoBox: { backgroundColor: "#f5f5f5", padding: 15, borderRadius: 10, marginBottom: 20 },
  steps: { gap: 10 },
  stepCard: { backgroundColor: "#fff", borderRadius: 10, padding: 15, elevation: 2, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4 },
  stepTitle: { fontWeight: "bold", marginBottom: 5 },
  homeBtn: { marginTop: 20, backgroundColor: "#f5f5f5", padding: 12, borderRadius: 25, alignItems: "center" },
  homeText: { fontWeight: "bold" }
});

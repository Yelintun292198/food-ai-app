import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

// 📱 Screen Imports
import FavoritesScreen from "./app/favorites";
import HistoryScreen from "./app/history";
import HomeScreen from "./app/home";
import PreviewScreen from "./app/preview";
import RecipeScreen from "./app/recipe";
import ResultScreen from "./app/result";
import LoginScreen from "./app/login";
import SignupScreen from "./app/signup";

// 🧭 Type definitions
export type RootStackParamList = {
  "ログイン画面": undefined;
  "新規登録画面": undefined;
  DrawerApp: undefined;
};

export type DrawerParamList = {
  "ホーム画面": undefined;
  "プレビュー画面": undefined;
  "結果画面": { result: any };
  "レシピ画面": { recipe: any };
  "履歴画面": undefined;
  "お気に入り画面": undefined;
};

// ==============================================
// 🍔 Drawer Navigation (with Icons)
// ==============================================
const Drawer = createDrawerNavigator<DrawerParamList>();

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        drawerActiveTintColor: "#e67e22",
        drawerInactiveTintColor: "#555",
        drawerLabelStyle: { fontSize: 15 },
      }}
    >
      <Drawer.Screen
        name="ホーム画面"
        component={HomeScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          title: "ホーム",
        }}
      />
      <Drawer.Screen
        name="プレビュー画面"
        component={PreviewScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="camera-outline" size={size} color={color} />
          ),
          title: "プレビュー",
        }}
      />
      <Drawer.Screen
        name="結果画面"
        component={ResultScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" size={size} color={color} />
          ),
          title: "結果",
        }}
      />
      <Drawer.Screen
        name="レシピ画面"
        component={RecipeScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <FontAwesome5 name="utensils" size={size} color={color} />
          ),
          title: "レシピ",
        }}
      />
      <Drawer.Screen
        name="履歴画面"
        component={HistoryScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
          title: "履歴",
        }}
      />
      <Drawer.Screen
        name="お気に入り画面"
        component={FavoritesScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
          title: "お気に入り",
        }}
      />
    </Drawer.Navigator>
  );
}

// ==============================================
// 🧭 Stack Navigation (Login → Drawer)
// ==============================================
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  console.log("✅ React Navigation active — App.tsx is entry point");

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ログイン画面"
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* 👇 Auth Screens */}
        <Stack.Screen name="ログイン画面" component={LoginScreen} />
        <Stack.Screen name="新規登録画面" component={SignupScreen} />

        {/* 👇 Main Drawer Navigation after login */}
        <Stack.Screen
          name="DrawerApp"
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

// Tabs (with bottom bar)
import HomeScreen from "../app/home";
import PreviewScreen from "../app/preview";
import ResultScreen from "../app/result";
import RecipeScreen from "../app/recipe";
import SettingsScreen from "../app/settings";

const Tab = createBottomTabNavigator();

export default function TabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#ff9500",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
          let icon = "ellipse";

          switch (route.name) {
            case "Home":
              icon = "home";
              break;
            case "プレビュー画面":
              icon = "camera";
              break;
            case "結果画面":
              icon = "analytics";
              break;
            case "レシピ画面":
              icon = "book";
              break;
            case "Settings":
              icon = "settings";
              break;
          }

          return <Ionicons name={icon} size={22} color={color} />;
        },
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="プレビュー画面" component={PreviewScreen} />
      <Tab.Screen name="結果画面" component={ResultScreen} />
      <Tab.Screen name="レシピ画面" component={RecipeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

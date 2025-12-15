import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../app/home";
import PreviewScreen from "../app/preview";
import ResultScreen from "../app/result";
import RecipeScreen from "../app/recipe";
import SettingsScreen from "../app/settings";

import { useTheme } from "../context/ThemeContext";
import { Colors } from "../constants/colors";

const Tab = createBottomTabNavigator();

export default function TabsNavigator() {
  const { isDark } = useTheme();
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        // Tab Bar Colors
        tabBarActiveTintColor: "#FF7043",
        tabBarInactiveTintColor: isDark ? "#bbbbbb" : "#777777",

        // Tab Bar Background
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          height: 60,
          paddingBottom: 5,
        },

        // Icons
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          if (route.name === "Home") iconName = "home";
          else if (route.name === "Scan") iconName = "camera";
          else if (route.name === "Result") iconName = "analytics";
          else if (route.name === "Recipe") iconName = "restaurant";
          else if (route.name === "Settings") iconName = "settings";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: "ホーム" }}
      />

      <Tab.Screen
        name="Scan"
        component={PreviewScreen}
        options={{ tabBarLabel: "スキャン" }}
      />

      <Tab.Screen
        name="Result"
        component={ResultScreen}
        options={{ tabBarLabel: "結果" }}
      />

      <Tab.Screen
        name="Recipe"
        component={RecipeScreen}
        options={{ tabBarLabel: "レシピ" }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarLabel: "設定" }}
      />
    </Tab.Navigator>
  );
}

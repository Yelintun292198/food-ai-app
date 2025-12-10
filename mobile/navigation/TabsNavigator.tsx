import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../app/home";
import PreviewScreen from "../app/preview";
import SettingsScreen from "../app/settings";

const Tab = createBottomTabNavigator();

export default function TabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#FF7043",
        tabBarInactiveTintColor: "#999",
        headerShown: false,

        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") iconName = "home";
          else if (route.name === "Scan") iconName = "camera";
          else if (route.name === "Settings") iconName = "settings";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: "ホーム" }} />
      <Tab.Screen name="Scan" component={PreviewScreen} options={{ tabBarLabel: "スキャン" }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: "設定" }} />
    </Tab.Navigator>
  );
}

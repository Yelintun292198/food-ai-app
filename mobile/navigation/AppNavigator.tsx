import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

/* AUTH */
import LoginScreen from "../app/login";
import SignupScreen from "../app/signup";

/* SIGNUP FLOW */
import SignupCategoryScreen from "../app/auth/SignupCategoryScreen";
import SignupFoodScreen from "../app/auth/SignupFoodScreen";

/* MAIN */
import TabsNavigator from "./TabsNavigator";

/* DATA SCREENS */
import FavoritesScreen from "../app/favorites";
import HistoryScreen from "../app/history";

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;

  SignupCategoryScreen: { userId: number };
  SignupFoodScreen: { userId: number; category: string };

  Tabs: undefined;

  // ✅ ADD ONLY THESE TWO
  Favorites: undefined;
  History: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      {/* AUTH */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />

      {/* SIGNUP FLOW */}
      <Stack.Screen
        name="SignupCategoryScreen"
        component={SignupCategoryScreen}
      />
      <Stack.Screen
        name="SignupFoodScreen"
        component={SignupFoodScreen}
      />

      {/* MAIN TABS */}
      <Stack.Screen name="Tabs" component={TabsNavigator} />

      {/* ✅ DATA SCREENS */}
      <Stack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ headerShown: true, title: "お気に入り" }}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{ headerShown: true, title: "履歴" }}
      />
    </Stack.Navigator>
  );
}

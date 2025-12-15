import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../app/login";
import SignupScreen from "../app/signup";
import TabsNavigator from "./TabsNavigator";

// ⭐ Signup onboarding screens
import SignupCategoryScreen from "../app/auth/SignupCategoryScreen";
import SignupFoodScreen from "../app/auth/SignupFoodScreen";

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  SignupCategoryScreen: { userId: number };
  SignupFoodScreen: { userId: number; category: string };
  Tabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      {/* AUTH SCREENS */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />

      {/* SIGNUP ONBOARDING FLOW */}
      <Stack.Screen
        name="SignupCategoryScreen"
        component={SignupCategoryScreen}
      />
      <Stack.Screen
        name="SignupFoodScreen"
        component={SignupFoodScreen}
      />

      {/* MAIN APP (BOTTOM TABS) */}
      <Stack.Screen name="Tabs" component={TabsNavigator} />
    </Stack.Navigator>
  );
}

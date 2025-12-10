// AppNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../app/login";
import SignupScreen from "../app/signup";
import TabsNavigator from "./TabsNavigator";

import ResultScreen from "../app/result";
import RecipeScreen from "../app/recipe";

// ⭐ Add your onboarding screens
import SignupCategoryScreen from "../app/auth/SignupCategoryScreen";
import SignupFoodScreen from "../app/auth/SignupFoodScreen";

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  SignupCategoryScreen: { userId: number };
  SignupFoodScreen: { userId: number; category: string };
  Tabs: undefined;
  Result: { result: any; fallbackImage?: string };
  Recipe: { recipe?: any; recipeName?: string };
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
      <Stack.Screen name="SignupFoodScreen" component={SignupFoodScreen} />

      {/* MAIN APP */}
      <Stack.Screen name="Tabs" component={TabsNavigator} />

      {/* EXTRA SCREENS */}
      <Stack.Screen name="Result" component={ResultScreen} />
      <Stack.Screen name="Recipe" component={RecipeScreen} />
    </Stack.Navigator>
  );
}

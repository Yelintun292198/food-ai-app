import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Tabs
import TabsNavigator from "./navigation/TabsNavigator";

// Auth
import LoginScreen from "./app/login";
import SignupScreen from "./app/signup";

// Non-tab screens
import Favorites from "./app/favorites";
import History from "./app/history";
import AddPost from "./app/community/AddPost";
import Comments from "./app/community/Comments";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          {/* Auth */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />

          {/* Main app with bottom tabs */}
          <Stack.Screen name="MainTabs" component={TabsNavigator} />

          {/* Screens WITHOUT bottom tab bar */}
          <Stack.Screen name="Favorites" component={Favorites} />
          <Stack.Screen name="History" component={History} />
          <Stack.Screen name="AddPost" component={AddPost} />
          <Stack.Screen name="Comments" component={Comments} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

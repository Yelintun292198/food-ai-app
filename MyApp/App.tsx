import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './app/HomeScreen';
import PreviewScreen from './app/preview';
import ResultScreen from './app/result';
import RecipeScreen from './app/recipe';
import HistoryScreen from './app/history';
import FavoritesScreen from './app/favorites';


export type RootStackParamList = {
  "ホーム画面": undefined;
  "プレビュー画面": undefined;
  "結果画面": undefined;
  "レシピ画面": undefined;
  "履歴画面": undefined;
  "お気に入り画面": undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ホーム画面">
        <Stack.Screen name="ホーム画面" component={HomeScreen} />
        <Stack.Screen name="プレビュー画面" component={PreviewScreen} />
        <Stack.Screen name="結果画面" component={ResultScreen} />
        <Stack.Screen name="レシピ画面" component={RecipeScreen} />
        <Stack.Screen name="履歴画面" component={HistoryScreen} />
        <Stack.Screen name="お気に入り画面" component={FavoritesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

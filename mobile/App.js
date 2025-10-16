import React, { useState } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';

export default function App() {
  const [message, setMessage] = useState("Hello Expo 🚀");

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
      <Button
        title="Change Text"
        onPress={() => setMessage("You tapped the button! 🎉")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});

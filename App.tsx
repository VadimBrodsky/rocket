import { StatusBar } from 'expo-status-bar';
import { Provider, useDispatch } from 'react-redux';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import store from './store';
import Authentication from './screens/Authentication';

export default function App() {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <Text>Open up App.tsx to start working on your app!</Text>
        <StatusBar style="auto" />
        <Authentication />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

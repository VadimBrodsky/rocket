import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useDispatch } from 'react-redux';
import { actions as authActions } from '../store/slices/auth';

export default function Authentication() {
  const dispatch = useDispatch();

  const setData = () => {
  };

  const handleAuth = () => {
    dispatch(authActions.fetchToken());
  };

  const handleRefresh = () => {
    dispatch(authActions.fetchRefreshToken());
  };

  return (
    <View>
      <Button title="Set Auth Data" onPress={setData} />
      <Button title="Authenticate" onPress={handleAuth} />
      <Button title="Refresh" onPress={handleRefresh} />
    </View>
  );
}

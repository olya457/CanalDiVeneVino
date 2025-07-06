import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { SurpriseStackParamList } from './types';

import SurpriseMeScreen from '../screens/SurpriseMeScreen';
import SurpriseWebViewScreen from '../screens/SurpriseWebViewScreen';
import FinalResultScreen from '../screens/FinalResultScreen';

const Stack = createNativeStackNavigator<SurpriseStackParamList>();

export default function SurpriseStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SurpriseMeMain" component={SurpriseMeScreen} />
      <Stack.Screen name="SurpriseWebView" component={SurpriseWebViewScreen} />
      <Stack.Screen name="FinalResult" component={FinalResultScreen} />
    </Stack.Navigator>
  );
}

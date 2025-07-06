import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoaderScreen from './src/screens/LoaderScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import MainTabs from './src/navigation/MainTabs';
import VineBarMapScreen from './src/screens/VineBarMapScreen';

import type { RootStackParamList } from './src/navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const MyDarkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#000', 
  },
};

export default function App() {
  return (
    <NavigationContainer theme={MyDarkTheme}>
      <Stack.Navigator
        initialRouteName="Loader"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#000' }, 
          animation: 'fade', 
        }}
      >
        <Stack.Screen name="Loader" component={LoaderScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="VineBarMapScreen" component={VineBarMapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

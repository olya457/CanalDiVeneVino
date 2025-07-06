
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import FindVineBarScreen from '../screens/FindVineBarScreen';
import LoadingScreen from '../screens/LoadingScreen';
import RandomChoiceScreen from '../screens/RandomChoiceScreen'; 

import type { FindVineBarStackParamList } from './types';

const Stack = createNativeStackNavigator<FindVineBarStackParamList>();

const FindVineBarStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="FindVineBarMain" component={FindVineBarScreen} />
    <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
    <Stack.Screen name="RandomChoice" component={RandomChoiceScreen} />
  </Stack.Navigator>
);

export default FindVineBarStack;
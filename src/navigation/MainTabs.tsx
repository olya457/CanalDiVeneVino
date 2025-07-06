import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { TabParamList, RootStackParamList } from './types';

import FindVineBarStack from './FindVineBarStack';
import SurpriseStackNavigator from './SurpriseStackNavigator';
import VineBarMapScreen from '../screens/VineBarMapScreen';
import SavedBarsScreen from '../screens/SavedBarsScreen';

const Tab = createBottomTabNavigator<TabParamList>();
const screenWidth = Dimensions.get('window').width;

const MainTabs = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={{ flex: 1 }}>
      <TopGradientBorder />

      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: 'absolute',
            backgroundColor: 'black',
            borderTopWidth: 0,
            height: 100,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            overflow: 'hidden',
            paddingTop: 32, 
          },
        }}
      >
        {}
        <Tab.Screen
          name="FindVineBar"
          component={FindVineBarStack}
          options={{
            tabBarIcon: ({ focused }) =>
              focused
                ? glowIcon(require('../assets/mingcute_compass-fill.png'))
                : inactiveIcon(require('../assets/mingcute_compass-fill.png')),
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate('FindVineBar', { screen: 'FindVineBarMain' });
            },
          })}
        />

        {}
        <Tab.Screen
          name="SurpriseMe"
          component={SurpriseStackNavigator}
          options={{
            tabBarIcon: ({ focused }) =>
              focused
                ? glowIcon(require('../assets/streamline-plump_wine-remix.png'))
                : inactiveIcon(require('../assets/streamline-plump_wine-remix.png')),
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate('SurpriseMe', { screen: 'SurpriseMeMain' });
            },
          })}
        />

        {}
        <Tab.Screen
          name="DummyHomeTab"
          component={() => null}
          options={{
            tabBarIcon: ({ focused }) => (
              <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                {focused
                  ? glowIcon(require('../assets/material-symbols_home-rounded.png'))
                  : inactiveIcon(require('../assets/material-symbols_home-rounded.png'))}
              </TouchableOpacity>
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate('Home');
            },
          }}
        />

        {}
<Tab.Screen
  name="VineBarMap"
  component={VineBarMapScreen}
  options={{
    tabBarIcon: ({ focused }) =>
      focused
        ? glowIcon(require('../assets/mingcute_map-fill.png'))
        : inactiveIcon(require('../assets/mingcute_map-fill.png')),
  }}
/>


        {}
        <Tab.Screen
          name="SavedBars"
          component={SavedBarsScreen}
          options={{
            tabBarIcon: ({ focused }) =>
              focused
                ? glowIcon(require('../assets/material-symbols_bookmark-rounded.png'))
                : inactiveIcon(require('../assets/material-symbols_bookmark-rounded.png')),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default MainTabs;


const TopGradientBorder = () => (
  <LinearGradient
    colors={['#FFDB98', '#654200']}
    style={{
      height: 1,
      width: '100%',
      position: 'absolute',
      bottom: 100,
      zIndex: 100,
    }}
  />
);


const glowIcon = (source: any) => (
  <View style={styles.glowWrapper}>
    <LinearGradient colors={['#FFDB98', '#654200']} style={styles.activeButton}>
      <Image source={source} style={styles.activeIcon} />
    </LinearGradient>
  </View>
);


const inactiveIcon = (source: any) => (
  <LinearGradient colors={['#FFDB98', '#654200']} style={styles.iconWrapper}>
    <View style={styles.innerSquare}>
      <Image source={source} style={styles.inactiveIcon} />
    </View>
  </LinearGradient>
);


const styles = StyleSheet.create({
  glowWrapper: {
    width: 60,
    height: 60,
    borderRadius: 14,
    shadowColor: '#FFDB98',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 10,
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 14,
    padding: 3,
  },
  innerSquare: {
    flex: 1,
    backgroundColor: 'black',
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    width: 60,
    height: 60,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIcon: {
    width: 32,
    height: 32,
    tintColor: 'black',
  },
  inactiveIcon: {
    width: 32,
    height: 32,
    tintColor: 'white',
  },
});

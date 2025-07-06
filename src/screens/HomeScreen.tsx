import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Platform,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, TabParamList } from '../navigation/types';

const { height } = Dimensions.get('window');
const isSmallDevice = height < 700;

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const buttons: { label: string; screen: keyof TabParamList }[] = [
  { label: 'Find the VineBar', screen: 'FindVineBar' },
  { label: 'Surprise me!', screen: 'SurpriseMe' },
  { label: 'VineBar map', screen: 'VineBarMap' },
  { label: 'Saved bars', screen: 'SavedBars' },
];

const HomeScreen = () => {
  const [selected, setSelected] = useState(buttons[0].label);
  const navigation = useNavigation<NavigationProp>();

  const buttonHeight = isSmallDevice ? 52 : 60;
  const buttonWidth = isSmallDevice ? 240 : 268;
  const fontSize = isSmallDevice ? 15 : 18;
  const bottomPadding = isSmallDevice ? 30 : 60;

  const animations = useRef(buttons.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animationsSequence = buttons.map((_, i) =>
      Animated.timing(animations[i], {
        toValue: 1,
        duration: 400,
        delay: i * 150,
        useNativeDriver: true,
      })
    );
    Animated.stagger(100, animationsSequence).start();
  }, []);

  return (
    <ImageBackground
      source={require('../assets/home_background.png')}
      style={styles.background}
    >
      <View style={[styles.buttonContainer, { paddingBottom: bottomPadding }]}>
        {buttons.map(({ label, screen }, i) => {
          const isActive = selected === label;

          return (
            <Animated.View
              key={label}
              style={{
                opacity: animations[i],
                transform: [
                  {
                    translateY: animations[i].interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setSelected(label);
                  navigation.navigate('Main', {
                    screen: screen as keyof TabParamList,
                  } as NavigatorScreenParams<TabParamList>);
                }}
                style={styles.buttonWrapper}
                activeOpacity={0.9}
              >
                {isActive ? (
                  <LinearGradient
                    colors={['#FFDB98', '#654200']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                      styles.fullButton,
                      { width: buttonWidth, height: buttonHeight },
                    ]}
                  >
                    <Text style={[styles.activeText, { fontSize }]}>{label}</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.outlinedButton}>
                    <LinearGradient
                      colors={['#FFDB98', '#654200']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[
                        styles.borderGradient,
                        { width: buttonWidth, height: buttonHeight },
                      ]}
                    >
                      <View style={styles.innerBlackBackground}>
                        <Text style={[styles.inactiveText, { fontSize }]}>{label}</Text>
                      </View>
                    </LinearGradient>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </ImageBackground>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  buttonWrapper: {
    marginVertical: 6,
  },
  fullButton: {
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeText: {
    color: '#000',
    fontWeight: '700',
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
    }),
  },
  outlinedButton: {
    borderRadius: 30,
  },
  borderGradient: {
    padding: 2,
    borderRadius: 30,
  },
  innerBlackBackground: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveText: {
    color: '#fff',
    fontWeight: '700',
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
    }),
  },
});

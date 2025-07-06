import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Animated,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { TabParamList, SurpriseStackParamList } from '../navigation/types';

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'SurpriseMe'>,
  NativeStackNavigationProp<SurpriseStackParamList>
>;

const SurpriseMeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { width } = useWindowDimensions();

  const imageWidth = Math.min(width * 0.85, 330);
  const imageHeight = imageWidth * 1.5;
  const headerRatio = 163 / 393;
  const headerHeight = width * headerRatio;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 600,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handlePress = () => {
    navigation.navigate('SurpriseMe', {
      screen: 'SurpriseWebView',
    });
  };

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Image
        source={require('../assets/surprise_header.png')}
        style={{ width, height: headerHeight }}
        resizeMode="cover"
      />

      <View style={styles.mainContent}>
        <Animated.View
          style={[
            styles.imageWrapper,
            {
              width: imageWidth,
              height: imageHeight,
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Image
            source={require('../assets/surprise_main.png')}
            style={[styles.mainImage, { width: imageWidth, height: imageHeight }]}
            resizeMode="contain"
          />

          <Animated.View
            style={{
              transform: [{ scale: pulseAnim }],
              position: 'absolute',
              bottom: -30,
            }}
          >
            <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
              <LinearGradient
                colors={['#FFDB98', '#654200']}
                style={[styles.button, { width: imageWidth + 25 }]}
              >
                <Text style={styles.buttonText}>Surprise me</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

export default SurpriseMeScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 160,
  },
  mainContent: {
    marginTop: 30,
    alignItems: 'center',
    width: '100%',
  },
  imageWrapper: {
    position: 'relative',
    alignItems: 'center',
  },
  mainImage: {
    borderRadius: 12,
  },
  button: {
    height: 60,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

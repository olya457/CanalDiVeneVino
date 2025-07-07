import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Loader'>;

const LoaderScreen = () => {
  const [step, setStep] = useState<'web' | 'image'>('web');
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep('image'), 3000),
      setTimeout(() => navigation.replace('Onboarding'), 6000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (step === 'image') {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [step]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      {step === 'web' ? (
        <WebView
          originWhitelist={['*']}
          source={{ html: hourglassHTML }}
          style={styles.webview}
        />
      ) : (
        <View style={styles.imageWrapper}>
          <Animated.Image
            source={require('../assets/placeholder.png')} 
            style={[
              styles.image,
              {
                transform: [{ scale: scaleAnim }],
                opacity: fadeAnim,
              },
            ]}
            resizeMode="contain"
          />
        </View>
      )}
    </View>
  );
};

export default LoaderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  webview: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
  },
  imageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    maxWidth: 320,
    maxHeight: 320,
  },
});

  const hourglassHTML = `<!DOCTYPE html><html><head><meta charset="UTF-8" />
  <style>
    body { margin: 0; background-color: black; }
    .hourglassBackground {
      position: absolute;
      background-color: rgb(71, 60, 60);
      height: 260px;
      width: 260px;
      border-radius: 50%;
      top: 50vh;
      left: 50vw;
      transform: translate(-50%, -50%);
    }
    .hourglassContainer {
      position: absolute;
      top: 60px;
      left: 80px;
      width: 100px;
      height: 140px;
      animation: hourglassRotate 2s ease-in 0s infinite;
      transform-style: preserve-3d;
      perspective: 1000px;
    }
    .hourglassContainer div,
    .hourglassContainer div:before,
    .hourglassContainer div:after {
      transform-style: preserve-3d;
    }
    @keyframes hourglassRotate {
      0% { transform: rotateX(0deg); }
      50% { transform: rotateX(180deg); }
      100% { transform: rotateX(180deg); }
    }
    .hourglassGlassTop {
      transform: rotateX(90deg);
      position: absolute;
      top: -32px;
      left: 6px;
      border-radius: 50%;
      width: 88px;
      height: 88px;
      background-color: #999999;
    }
    .hourglassGlass {
      perspective: 100px;
      position: absolute;
      top: 64px;
      left: 40px;
      width: 20px;
      height: 12px;
      background-color: #999999;
      opacity: 0.5;
    }
    .hourglassGlass:before,
    .hourglassGlass:after {
      content: "";
      display: block;
      position: absolute;
      background-color: #017268;
      left: -34px;
      width: 88px;
      height: 56px;
    }
    .hourglassGlass:before {
      top: -54px;
      border-radius: 0 0 50px 50px;
    }
    .hourglassGlass:after {
      bottom: -54px;
      border-radius: 50px 50px 0 0;
    }
    .hourglassCurves:before,
    .hourglassCurves:after {
      content: "";
      display: block;
      position: absolute;
      top: 64px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: #333;
      animation: hideCurves 2s ease-in 0s infinite;
    }
    .hourglassCurves:before { left: 30px; }
    .hourglassCurves:after { left: 58px; }
    @keyframes hideCurves {
      0%, 40%, 100% { opacity: 1; }
      25%, 30% { opacity: 0; }
    }
    .hourglassSandStream:before {
      content: "";
      display: block;
      position: absolute;
      left: 48px;
      width: 6px;
      background-color: white;
      animation: sandStream1 2s ease-in 0s infinite;
    }
    .hourglassSandStream:after {
      content: "";
      display: block;
      position: absolute;
      top: 72px;
      left: 38px;
      border-left: 12px solid transparent;
      border-right: 12px solid transparent;
      border-bottom: 12px solid #fff;
      animation: sandStream2 2s ease-in 0s infinite;
    }
    @keyframes sandStream1 {
      0% { height: 0; top: 70px; }
      50% { height: 0; top: 90px; }
      60%, 85% { height: 70px; top: 16px; }
      100% { height: 0; top: 16px; }
    }
    @keyframes sandStream2 {
      0%, 50%, 91%, 100% { opacity: 0; }
      51%, 90% { opacity: 1; }
    }
    .hourglassSand:before,
    .hourglassSand:after {
      content: "";
      display: block;
      position: absolute;
      left: 12px;
      background-color: white;
    }
    .hourglassSand:before {
      top: 16px;
      width: 78px;
      border-radius: 6px 6px 60px 60px;
      animation: sandFillup 2s ease-in 0s infinite;
    }
    .hourglassSand:after {
      border-radius: 60px 60px 6px 6px;
      animation: sandDeplete 2s ease-in 0s infinite;
    }
    @keyframes sandFillup {
      0% { opacity: 0; height: 0; }
      60% { opacity: 1; height: 0; }
      100% { opacity: 1; height: 34px; }
    }
    @keyframes sandDeplete {
      0%, 1%, 24% {
        opacity: 1;
        top: 90px;
        height: 34px;
        width: 76px;
        left: 12px;
      }
      25%, 50% { top: 82px; }
      90% {
        height: 0;
        width: 20px;
        left: 40px;
      }
    }
  </style>
</head>
<body>
  <div class="hourglassBackground">
    <div class="hourglassContainer">
      <div class="hourglassCurves"></div>
      <div class="hourglassGlassTop"></div>
      <div class="hourglassSand"></div>
      <div class="hourglassSandStream"></div>
      <div class="hourglassGlass"></div>
    </div>
  </div>
</body>
</html>`;
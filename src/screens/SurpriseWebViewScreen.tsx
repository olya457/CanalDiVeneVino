import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Animated,
  useWindowDimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { TabParamList, SurpriseStackParamList } from '../navigation/types';

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'SurpriseMe'>,
  NativeStackNavigationProp<SurpriseStackParamList>
>;

const SurpriseWebViewScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { width } = useWindowDimensions();
  const containerWidth = Math.min(width * 0.88, 340);

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const webviewOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(webviewOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.navigate('SurpriseMe', {
        screen: 'FinalResult',
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);

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

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
      <Animated.View style={{ opacity: headerOpacity, width }}>
        <Image
          source={require('../assets/surprise_header.png')}
          style={{ width: width * 0.95, aspectRatio: 393 / 163 }}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View style={{ opacity: textOpacity, marginTop: 32 }}>
        <Text style={styles.title}>Please wait...</Text>
      </Animated.View>

      <Animated.View style={{ opacity: webviewOpacity }}>
        <WebView
          originWhitelist={['*']}
          source={{ html: hourglassHTML }}
          style={{
            width: containerWidth,
            height: containerWidth * 1.5,
            borderRadius: 12,
            overflow: 'hidden',
            marginTop: -180,
            backgroundColor: 'transparent',
          }}
          scrollEnabled={false}
        />
      </Animated.View>

      <Animated.View style={{ opacity: buttonOpacity, marginTop: 40 }}>
        <LinearGradient
          colors={['#FFDB98', '#654200']}
          style={[styles.button, { width: containerWidth }]}
        >
          <Text style={styles.buttonText}>Loading...</Text>
        </LinearGradient>
      </Animated.View>
    </ScrollView>
  );
};

export default SurpriseWebViewScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingBottom: 120,
  },
  title: {
    fontSize: 18,
    color: '#fff',
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

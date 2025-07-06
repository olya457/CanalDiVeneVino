import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { FindVineBarStackParamList } from '../navigation/types';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 360;

type LoadingScreenRouteProp = RouteProp<FindVineBarStackParamList, 'LoadingScreen'>;
type NavigationProp = NativeStackNavigationProp<FindVineBarStackParamList>;

const categories = [
  { id: 'romantic', image: require('../assets/romantic.png') },
  { id: 'authentic', image: require('../assets/local.png') },
  { id: 'elegant', image: require('../assets/elegant.png') },
  { id: 'hidden', image: require('../assets/hidden.png') },
];

const htmlString = `<!DOCTYPE html><html><head><meta charset="UTF-8" />
<style>
body { margin: 0; background-color: black; }
.hourglassBackground { position: absolute; background-color: rgb(71, 60, 60); height: 260px; width: 260px; border-radius: 50%; top: 50vh; left: 50vw; transform: translate(-50%, -50%); }
.hourglassContainer { position: absolute; top: 60px; left: 80px; width: 100px; height: 140px; animation: hourglassRotate 2s ease-in 0s infinite; transform-style: preserve-3d; perspective: 1000px; }
.hourglassContainer div, .hourglassContainer div:before, .hourglassContainer div:after { transform-style: preserve-3d; }
@keyframes hourglassRotate { 0% { transform: rotateX(0deg); } 50% { transform: rotateX(180deg); } 100% { transform: rotateX(180deg); } }
.hourglassGlassTop { transform: rotateX(90deg); position: absolute; top: -32px; left: 6px; border-radius: 50%; width: 88px; height: 88px; background-color: #999999; }
.hourglassGlass { perspective: 100px; position: absolute; top: 64px; left: 40px; width: 20px; height: 12px; background-color: #999999; opacity: 0.5; }
.hourglassGlass:before, .hourglassGlass:after { content: ""; display: block; position: absolute; background-color: #017268; left: -34px; width: 88px; height: 56px; }
.hourglassGlass:before { top: -54px; border-radius: 0 0 50px 50px; }
.hourglassGlass:after { bottom: -54px; border-radius: 50px 50px 0 0; }
.hourglassCurves:before, .hourglassCurves:after { content: ""; display: block; position: absolute; top: 64px; width: 12px; height: 12px; border-radius: 50%; background-color: #333; animation: hideCurves 2s ease-in 0s infinite; }
.hourglassCurves:before { left: 30px; } .hourglassCurves:after { left: 58px; }
@keyframes hideCurves { 0%, 40%, 100% { opacity: 1; } 25%, 30% { opacity: 0; } }
.hourglassSandStream:before { content: ""; display: block; position: absolute; left: 48px; width: 6px; background-color: white; animation: sandStream1 2s ease-in 0s infinite; }
.hourglassSandStream:after { content: ""; display: block; position: absolute; top: 72px; left: 38px; border-left: 12px solid transparent; border-right: 12px solid transparent; border-bottom: 12px solid #fff; animation: sandStream2 2s ease-in 0s infinite; }
@keyframes sandStream1 { 0% { height: 0; top: 70px; } 50% { height: 0; top: 90px; } 60%, 85% { height: 70px; top: 16px; } 100% { height: 0; top: 16px; } }
@keyframes sandStream2 { 0%, 50%, 91%, 100% { opacity: 0; } 51%, 90% { opacity: 1; } }
.hourglassSand:before, .hourglassSand:after { content: ""; display: block; position: absolute; left: 12px; background-color: white; perspective: 500px; }
.hourglassSand:before { top: 16px; width: 78px; border-radius: 6px 6px 60px 60px; animation: sandFillup 2s ease-in 0s infinite; }
.hourglassSand:after { border-radius: 60px 60px 6px 6px; animation: sandDeplete 2s ease-in 0s infinite; }
@keyframes sandFillup { 0% { opacity: 0; height: 0; } 60% { opacity: 1; height: 0; } 100% { opacity: 1; height: 34px; } }
@keyframes sandDeplete { 0%, 1%, 24% { opacity: 1; top: 90px; height: 34px; width: 76px; left: 12px; } 25%, 50% { top: 82px; } 90% { height: 0; width: 20px; left: 40px; } }
</style></head><body><div class="hourglassBackground"><div class="hourglassContainer">
<div class="hourglassCurves"></div><div class="hourglassCapTop"></div><div class="hourglassGlassTop"></div>
<div class="hourglassSand"></div><div class="hourglassSandStream"></div><div class="hourglassCapBottom"></div><div class="hourglassGlass"></div>
</div></div></body></html>`;


const LoadingScreen = () => {
  const route = useRoute<LoadingScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { categoryId } = route.params || {};
  const category = categories.find(cat => cat.id === categoryId) ?? categories[0];

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('RandomChoice', { categoryId });
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigation, categoryId]);

  const fadeText = useRef(new Animated.Value(0)).current;
  const fadeWeb = useRef(new Animated.Value(0)).current;
  const fadeCard = useRef(new Animated.Value(0)).current;
  const fadeButton = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeText, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeWeb, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeCard, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeButton, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.background}>
      <StatusBar hidden />
      <ScrollView
        contentContainerStyle={styles.overlay}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require('../assets/finder_im.png')}
          style={{
            width: '100%',
            height: 160,
            maxHeight: isSmallDevice ? 100 : 160,
            marginTop: 0,
            alignSelf: 'flex-start',
          }}
          resizeMode="contain"
        />

        <Animated.Text style={[styles.waitText, { opacity: fadeText, marginTop: 30 }]}>
          Please wait...
        </Animated.Text>

        <Animated.View style={[styles.hourglassContainer, { opacity: fadeWeb }]}>
          <WebView
            originWhitelist={['*']}
            source={{ html: htmlString }}
            style={styles.hourglassWebView}
            javaScriptEnabled
            domStorageEnabled
            scrollEnabled={false}
          />
        </Animated.View>

        <Animated.View style={[styles.cardWrapper, { opacity: fadeCard }]}>
          <LinearGradient
            colors={['#FFDB98', '#654200']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBorder}
          >
            <Image source={category.image} style={styles.image} />
          </LinearGradient>
        </Animated.View>

        <Animated.View style={{ opacity: fadeButton }}>
          <TouchableOpacity style={styles.buttonWrapper} activeOpacity={1} disabled>
            <LinearGradient
              colors={['#FFDB98', '#654200']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Loading...</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'black',
  },
  overlay: {
    paddingTop: 40,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingBottom: 60,
    flexGrow: 1,
  },
  waitText: {
    color: '#fff',
    fontSize: 16,
  },
  hourglassContainer: {
  width: 260,
  height: 260,
  marginTop: 20,
  overflow: 'hidden', 
  borderRadius: 130, 
},
hourglassWebView: {
  width: '100%',
  height: '100%',
  backgroundColor: 'transparent',
},

  cardWrapper: {
    marginTop: 10,
  },
  gradientBorder: {
    width: 162,
    height: 162,
    padding: 2,
    borderRadius: 14,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 158,
    height: 158,
    resizeMode: 'cover',
    borderRadius: 12,
  },
  buttonWrapper: {
    marginTop: 10,
    width: 334,
    height: 60,
  },
  button: {
    flex: 1,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
});

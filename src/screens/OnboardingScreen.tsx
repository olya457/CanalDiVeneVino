import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

const { width, height } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

const onboardingData = [
  {
    image: require('../assets/onboarding1.png'),
    buttonLabel: "Let’s Go!",
  },
  {
    image: require('../assets/onboarding2.png'),
    buttonLabel: "Next",
  },
  {
    image: require('../assets/onboarding3.png'),
    buttonLabel: "Next",
  },
  {
    image: require('../assets/onboarding4.png'),
    buttonLabel: "Start",
  },
];

const OnboardingScreen = () => {
  const [index, setIndex] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];
  const translateXAnim = useState(new Animated.Value(0))[0];
  const navigation = useNavigation<NavigationProp>();

  const handleNext = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateXAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (index < onboardingData.length - 1) {
       // setIndex(index + 1);
        translateXAnim.setValue(width); 
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateXAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
       
        navigation.replace('Home');
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.blackBackground} />

      <Animated.Image
        source={onboardingData[index].image}
        style={[
          styles.image,
          {
            opacity: fadeAnim,
            transform: [{ translateX: translateXAnim }],
          },
        ]}
        resizeMode="cover"
      />

      <TouchableOpacity onPress={handleNext} activeOpacity={0.9} style={styles.buttonWrapper}>
        <LinearGradient
          colors={['#FFDB98', '#654200']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>{onboardingData[index].buttonLabel}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blackBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  image: {
    width,
    height,
    position: 'absolute',
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
  },
  button: {
    width: 268,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Georgia',
  },
});

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { SurpriseStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<SurpriseStackParamList, 'SurpriseWebView'>;

const questions = [
  {
    question: 'What kind of atmosphere are you in the mood for?',
    options: ['Romantic', 'Local', 'Elegant', 'Hidden'],
  },
  {
    question: 'Who are you with?',
    options: ['Solo', 'Date', 'Friends', 'Exploring'],
  },
  {
    question: 'What do you want from the evening?',
    options: ['Scenic view', 'Authentic vibe', 'Luxury', 'Secret location'],
  },
  {
    question: 'Preferred wine style?',
    options: ['Sparkling', 'Natural', 'Fine reds', 'Surprise me'],
  },
  {
    question: 'What type of place attracts you?',
    options: ['Terrace', 'Family-run', 'Stylish interior', 'Hidden corners'],
  },
  {
    question: 'How do you feel tonight?',
    options: ['Romantic', 'Curious', 'Classy', 'Adventurous'],
  },
  {
    question: 'Pick one word:',
    options: ['Sunset', 'Local', 'Refined', 'Mystery'],
  },
];

const SurpriseWebViewScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { width } = useWindowDimensions();
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState<string[]>([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const startFadeAnimation = () => {
    fadeAnim.setValue(0);
    translateY.setValue(20);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const startPulseAnimation = () => {
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
  };

  useEffect(() => {
    startFadeAnimation();
    if (step >= 0 && step < questions.length) {
      startPulseAnimation();
    }
  }, [step]);

  const handleStart = () => setStep(0);

  const handleSelect = (option: string) => {
    const updated = [...answers, option];
    setAnswers(updated);

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      if (step < questions.length - 1) {
        setStep(step + 1);
      } else {
        setStep(questions.length);
      }
    });
  };

  const getCategoryFromAnswers = (): string => {
    const all = answers.join(' ').toLowerCase();
    if (all.includes('romantic') || all.includes('sunset') || all.includes('date')) return 'romantic';
    if (all.includes('local') || all.includes('family') || all.includes('authentic')) return 'local';
    if (all.includes('elegant') || all.includes('refined') || all.includes('luxury')) return 'elegant';
    return 'hidden';
  };

  const handleFinal = () => {
    const category = getCategoryFromAnswers();
    navigation.navigate('FinalResult', { categoryId: category });
  };

  const buttonWidth = Math.min(width * 0.85, 330);
  const headerRatio = 163 / 393;
  const headerHeight = width * headerRatio;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Image
          source={require('../assets/surprise_header.png')}
          style={{ width, height: headerHeight }}
          resizeMode="cover"
        />

        <SafeAreaView style={styles.innerContent}>
          <Animated.View
            style={[
              styles.animatedBox,
              {
                opacity: fadeAnim,
                transform: [{ translateY }],
              },
            ]}
          >
            {step === -1 && (
              <View style={styles.centerScreen}>
                <Text style={styles.welcomeTitle}>
                  Answer 7 quick questions to get your perfect wine spot!
                </Text>
                <TouchableOpacity onPress={handleStart} style={[styles.btnWrapper, { width: buttonWidth }]}>
                  <LinearGradient colors={['#FFDB98', '#654200']} style={styles.gradientBtn}>
                    <Text style={styles.btnText}>Start Quiz</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}

            {step >= 0 && step < questions.length && (
              <View style={styles.questionBox}>
                <Text style={styles.question}>{questions[step].question}</Text>
                {questions[step].options.map((opt, idx) => (
                  <Animated.View key={idx} style={{ transform: [{ scale: pulseAnim }] }}>
                    <TouchableOpacity
                      onPress={() => handleSelect(opt)}
                      style={[styles.btnWrapper, { width: buttonWidth }]}>
                      <LinearGradient colors={['#FFDB98', '#654200']} style={styles.gradientBtn}>
                        <Text style={styles.btnText}>{opt}</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            )}

            {step === questions.length && (
              <View style={styles.centerScreen}>
                <Text style={styles.finalTitle}>Ready?</Text>
                <Text style={styles.finalSubtitle}>Tap below to reveal your surprise destination</Text>
                <TouchableOpacity onPress={handleFinal} style={[styles.btnWrapper, { width: buttonWidth }]}>
                  <LinearGradient colors={['#FFDB98', '#654200']} style={styles.gradientBtn}>
                    <Text style={styles.btnText}>Get My Surprise</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
};

export default SurpriseWebViewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  innerContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  animatedBox: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerScreen: {
    height: 480,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  questionBox: {
    marginTop: 30,
    alignItems: 'center',
    gap: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    color: '#FFDB98',
    fontWeight: '800',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  question: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  btnWrapper: {
    height: 60,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
  },
  gradientBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  btnText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '700',
  },
  finalTitle: {
    fontSize: 28,
    color: '#FFDB98',
    fontWeight: '700',
    marginBottom: 10,
  },
  finalSubtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 30,
  },
});

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  ScrollView,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { FindVineBarStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<FindVineBarStackParamList, 'FindVineBarMain'>;

const categories = [
  { id: 'romantic', image: require('../assets/romantic.png') },
  { id: 'authentic', image: require('../assets/local.png') },
  { id: 'elegant', image: require('../assets/elegant.png') },
  { id: 'hidden', image: require('../assets/hidden.png') },
];

const FindVineBarScreen = ({ navigation }: Props) => {
  const [selected, setSelected] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const itemSize = (width - 60) / 2;

  const handleSelect = (id: string) => {
    setSelected(id);
  };

  const handleFind = () => {
    if (selected) {
      navigation.navigate('LoadingScreen', {
        categoryId: selected,
      });
    }
  };

  const animatedValues = useRef(categories.map(() => new Animated.Value(0))).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
 
    const animations = animatedValues.map((val, i) =>
      Animated.timing(val, {
        toValue: 1,
        duration: 400,
        delay: i * 100,
        useNativeDriver: true,
      })
    );

    const buttonAnimation = Animated.timing(buttonAnim, {
      toValue: 1,
      duration: 500,
      delay: 500,
      useNativeDriver: true,
    });

    Animated.stagger(80, animations).start(() => {
      buttonAnimation.start();
    });
  }, []);

  return (
    <View style={styles.background}>
      <ScrollView
        contentContainerStyle={[styles.scrollContainer, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Image
          source={require('../assets/finder_im.png')}
          style={[styles.topImage, { width, height: width * 0.4 }]}
        />

        <View style={styles.grid}>
          {categories.map((cat, i) => (
            <Animated.View
              key={cat.id}
              style={{
                width: itemSize,
                height: itemSize,
                marginBottom: 20,
                opacity: animatedValues[i],
                transform: [
                  {
                    translateY: animatedValues[i].interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              }}
            >
              <TouchableOpacity
                onPress={() => handleSelect(cat.id)}
                activeOpacity={0.8}
                style={{ flex: 1 }}
              >
                {selected === cat.id ? (
                  <LinearGradient
                    colors={['#FFDB98', '#654200']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.gradientBorder, { width: '100%', height: '100%' }]}
                  >
                    <Image source={cat.image} style={styles.image} />
                  </LinearGradient>
                ) : (
                  <View style={styles.imageContainer}>
                    <Image source={cat.image} style={styles.image} />
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <View style={{ height: 20 }} />

        <Animated.View
          style={{
            opacity: buttonAnim,
            transform: [
              {
                translateY: buttonAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          }}
        >
          <TouchableOpacity
            style={[styles.buttonWrapper, !selected && styles.buttonDisabled]}
            activeOpacity={0.8}
            onPress={handleFind}
            disabled={!selected}
          >
            <LinearGradient
              colors={['#FFDB98', '#654200']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Find the VineBar</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default FindVineBarScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#000',
  },
  topImage: {
    marginTop: 0,
    resizeMode: 'contain',
  },
  scrollContainer: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 60,
    alignItems: 'center',
  },
  grid: {
    width: '100%',
    marginTop: 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientBorder: {
    padding: 2,
    borderRadius: 14,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 12,
  },
  buttonWrapper: {
    width: 334,
    height: 60,
  },
  button: {
    flex: 1,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '600',
  },
});

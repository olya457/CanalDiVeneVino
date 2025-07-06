import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  Image,
  Share,
  useWindowDimensions,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import type {
  RootStackParamList,
  TabParamList,
  FindVineBarStackParamList,
} from '../navigation/types';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

interface Entry {
  title: string;
  description: string;
  coordinates: string;
  address: string;
  imageName: string;
}

const getImageSource = (imageName: string) => {
  switch (imageName) {
    case 'image_romantic.png': return require('../assets/image_romantic.png');
    case 'image_romantic2.png': return require('../assets/image_romantic2.png');
    case 'image_romantic3.png': return require('../assets/image_romantic3.png');
    case 'image_romantic4.png': return require('../assets/image_romantic4.png');
    case 'image_romantic5.png': return require('../assets/image_romantic5.png');
    case 'image_local1.png': return require('../assets/image_local1.png');
    case 'image_local2.png': return require('../assets/image_local2.png');
    case 'image_local3.png': return require('../assets/image_local3.png');
    case 'image_local4.png': return require('../assets/image_local4.png');
    case 'image_local5.png': return require('../assets/image_local5.png');
    case 'image_elegant1.png': return require('../assets/image_elegant1.png');
    case 'image_elegant2.png': return require('../assets/image_elegant2.png');
    case 'image_elegant3.png': return require('../assets/image_elegant3.png');
    case 'image_elegant4.png': return require('../assets/image_elegant4.png');
    case 'image_elegant5.png': return require('../assets/image_elegant5.png');
    case 'image_hidden.png': return require('../assets/image_hidden.png');
    case 'image_hidden2.png': return require('../assets/image_hidden2.png');
    case 'image_hidden3.png': return require('../assets/image_hidden3.png');
    case 'image_hidden4.png': return require('../assets/image_hidden4.png');
    case 'image_hidden5.png': return require('../assets/image_hidden5.png');
    default: return require('../assets/placeholder.png');
  }
};

const data: Record<string, Entry[]> = {
  romantic: [
    {
      title: 'Bar Canale',
      description: 'A romantic terrace overlooking the Grand Canal, perfect for sunset wine moments.',
      coordinates: '45.4360, 12.3290',
      address: 'Calle degli Albanesi, Sestiere San Marco, Venice',
      imageName: 'image_romantic.png',
    },
    {
      title: 'Wine Bar 5000',
      description: 'Stylish setting near San Marco with an extensive wine and appetizer selection.',
      coordinates: '45.4345, 12.3400',
      address: 'Sestiere Castello 5018, 30122 Venice',
      imageName: 'image_romantic2.png',
    },
    {
      title: 'Cantine del Vino già Schiavi',
      description: 'Canal-side traditional bar in Dorsoduro, intimate and picturesque.',
      coordinates: '45.4290, 12.3265',
      address: 'Fondamenta Nani, Dorsoduro, Venice',
      imageName: 'image_romantic3.png',
    },
    {
      title: 'Alla Vedova',
      description: 'Classic bacaro with a cozy ambiance, ideal for couples.',
      coordinates: '45.5080, 12.3360',
      address: 'Ramo Cadro, Cannaregio, Venice',
      imageName: 'image_romantic4.png',
    },
    {
      title: "Bar All'Angolo",
      description: 'Rustic and romantic with a local-friendly vibe and authentic wines.',
      coordinates: '45.4295, 12.3270',
      address: 'Dorsoduro, Venice',
      imageName: 'image_romantic5.png',
    },
  ],
  local: [
    {
      title: 'Vino Vero',
      description: 'Intimate wine bar in Cannaregio offering natural wines and a peaceful setting.',
      coordinates: '45.5020, 12.3370',
      address: 'Fondamenta Gasparo Contarini, Cannaregio, Venice',
      imageName: 'image_local1.png',
    },
    {
      title: 'Bacaro al Ravano',
      description: 'Local cicchetti and wines near Rialto with traditional Venetian flavors.',
      coordinates: '45.4375, 12.3360',
      address: 'Rughetta del Ravano, Rialto, Venice',
      imageName: 'image_local2.png',
    },
    {
      title: 'Do Mori',
      description: "One of Venice's oldest bacari, known for its charm and history.",
      coordinates: '45.4380, 12.3355',
      address: 'Calle Do Mori, San Polo, Venice',
      imageName: 'image_local3.png',
    },
    {
      title: 'Osteria al Portego',
      description: 'Small but vibrant spot with homemade pasta and hearty cicchetti.',
      coordinates: '45.4382, 12.3357',
      address: 'Calle Malvasia, Castello, Venice',
      imageName: 'image_local4.png',
    },
    {
      title: 'Cantina Do Mori',
      description: 'Traditional-style bacaro near San Marco, authentic and inviting.',
      coordinates: '45.4380, 12.3355',
      address: 'San Marco area, Venice',
      imageName: 'image_local5.png',
    },
  ],
  elegant: [
    {
      title: "Vineria all'Amarone",
      description: 'Premium wine bar focusing on Amarone della Valpolicella and fine experiences.',
      coordinates: '45.4378, 12.3350',
      address: 'San Polo area, Venice',
      imageName: 'image_elegant1.png',
    },
    {
      title: "Harry’s Bar",
      description: 'Historic and refined, birthplace of the Bellini cocktail.',
      coordinates: '45.4347, 12.3380',
      address: 'Calle Vallaresso 1323, San Marco, Venice',
      imageName: 'image_elegant2.png',
    },
    {
      title: 'Bar Canale',
      description: 'Refined wine bar with Grand Canal views and high-end service.',
      coordinates: '45.4360, 12.3290',
      address: 'Calle degli Albanesi, San Marco, Venice',
      imageName: 'image_elegant3.png',
    },
    {
      title: 'Caffè Florian',
      description: 'Historic 18th-century café-bar with elegant decor and premium wines.',
      coordinates: '45.4345, 12.3390',
      address: 'Piazza San Marco, 57, Venice',
      imageName: 'image_elegant4.png',
    },
    {
      title: 'Bar at Hotel Danieli',
      description: 'Sophisticated bar inside a luxury hotel, perfect for formal wine tastings.',
      coordinates: '45.4335, 12.3376',
      address: 'Riva degli Schiavoni, Venice',
      imageName: 'image_elegant5.png',
    },
  ],
  hidden: [
    {
      title: "Bar All'Angolo",
      description: 'Charming bar with rustic touches and minimal crowds.',
      coordinates: '45.4295, 12.3270',
      address: 'Dorsoduro, Venice',
      imageName: 'image_hidden.png',
    },
    {
      title: 'Cantine del Vino già Schiavi',
      description: 'Hidden in plain sight, offers local wines and a canal-side setting.',
      coordinates: '45.4290, 12.3265',
      address: 'Fondamenta Nani, Dorsoduro, Venice',
      imageName: 'image_hidden2.png',
    },
    {
      title: 'Vino Vero',
      description: 'Off the tourist path, specializing in natural and organic wines.',
      coordinates: '45.5020, 12.3370',
      address: 'Cannaregio, Venice',
      imageName: 'image_hidden3.png',
    },
    {
      title: 'Bacaro de Bischeri',
      description: 'Lively atmosphere near Rialto with a young, fun vibe.',
      coordinates: '45.4376, 12.3362',
      address: 'Ruga dei Oresi, Rialto, Venice',
      imageName: 'image_hidden4.png',
    },
    {
      title: 'Osteria Al Bacco',
      description: 'Quiet and unassuming bar with great prosecco and a view.',
      coordinates: '45.4300, 12.3275',
      address: 'Dorsoduro, Venice',
      imageName: 'image_hidden5.png',
    },
  ],
};

const SAVED_KEY = 'saved_places';

const getRandomEntry = (category: keyof typeof data, exclude?: Entry): Entry => {
  const categoryEntries = data[category];
  if (!categoryEntries || categoryEntries.length === 0) {
    console.warn(`Category "${category}" is empty. Returning a default entry from 'romantic'.`);
    return data.romantic[0];
  }

  const filtered = categoryEntries.filter((p: Entry) => p.title !== exclude?.title);
  const options = filtered.length > 0 ? filtered : categoryEntries;
  return options[Math.floor(Math.random() * options.length)];
};

type RandomChoiceScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<FindVineBarStackParamList, 'RandomChoice'>,
  CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList>,
    NativeStackNavigationProp<RootStackParamList>
  >
>;

type RandomChoiceScreenRouteProp = RouteProp<FindVineBarStackParamList, 'RandomChoice'>;

const categoryMap: Record<string, keyof typeof data> = {
  'Romantic View': 'romantic',
  'Local & Authentic': 'local',
  'Elegant Tastings': 'elegant',
  'Hidden Gems': 'hidden',
};

const RandomChoiceScreen = () => {
  const navigation = useNavigation<RandomChoiceScreenNavigationProp>();
  const route = useRoute<RandomChoiceScreenRouteProp>();
  const { width } = useWindowDimensions();

  const { categoryId } = route.params;

  const actualCategoryKey = categoryMap[categoryId] || 'romantic'; 

  const [current, setCurrent] = useState<Entry>(() =>
    getRandomEntry(actualCategoryKey) 
  );
  const [saved, setSaved] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.6)).current;

  const pulseAnim = useRef(new Animated.Value(1)).current;

  const animateCard = () => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.6);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        speed: 8,
        bounciness: 14,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animatePulse = () => {
    pulseAnim.setValue(1);
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.4,
        duration: 150,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 150,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    animateCard();
  }, [current]);

  useEffect(() => {
   
    setCurrent(getRandomEntry(actualCategoryKey)); 
  }, [categoryId]);

  useEffect(() => {
    checkIfSaved();
  }, [current]);

  const checkIfSaved = async () => {
    const json = await AsyncStorage.getItem(SAVED_KEY);
    const arr: Entry[] = json ? JSON.parse(json) : [];
    const exists = arr.some((e) => e.title === current.title);
    setSaved(exists);
  };

  const handleSave = async () => {
    animatePulse();
    const json = await AsyncStorage.getItem(SAVED_KEY);
    const arr: Entry[] = json ? JSON.parse(json) : [];
    const exists = arr.some((e) => e.title === current.title);

    const updated = exists
      ? arr.filter((e) => e.title !== current.title)
      : [...arr, current];

    await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(updated));
    setSaved(!exists);
  };

  const handleShare = async () => {
    animatePulse();
    try {
      await Share.share({
        message: `${current.title}\n${current.description}\nCoordinates: ${current.coordinates}\nAddress: ${current.address}`,
      });
    } catch (error) {
      console.error('Share canceled', error);
    }
  };

const handleRoute = () => {
  navigation.navigate('Main', {
    screen: 'VineBarMap',
    params: {
      title: current.title,
      coordinates: current.coordinates,
      autoFocus: true,
      selectedId: current.title,
    },
  });
};

  const handleSearchNew = () => {
    setCurrent(getRandomEntry(actualCategoryKey, current)); 
  };

  const isSmallDevice = width < 360;

  const cardWidth = isSmallDevice ? width * 0.9 : 334;
  const cardHeight = isSmallDevice ? 400 : 444;
  const cardImageHeight = isSmallDevice ? 150 : 180;
  const buttonWidth = isSmallDevice ? width * 0.9 : 334;
  const buttonHeight = isSmallDevice ? 50 : 60;
  const cardPadding = isSmallDevice ? 12 : 16;
  const iconButtonSize = isSmallDevice ? 40 : 48;
  const routeButtonHeight = isSmallDevice ? 40 : 48;
  const routeButtonMargin = isSmallDevice ? 8 : 12;
  const iconSize = isSmallDevice ? 18 : 20;


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={require('../assets/background_finder.png')}
          style={[styles.backgroundInsideScroll, { paddingTop: isSmallDevice ? 60 : 140 }]}
          resizeMode="cover"
        >
          {}
          <Animated.View
            style={[
              styles.card,
              { width: cardWidth, height: cardHeight },
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Image
              source={getImageSource(current.imageName)}
              style={[styles.cardImage, { height: cardImageHeight }]}
            />
            <View style={[styles.cardBody, { padding: cardPadding }]}>
              <Text style={styles.cardTitle}>{current.title}</Text>
              <Text style={styles.cardDescription}>{current.description}</Text>
              <Text style={styles.cardCoords}>Coordinates: {current.coordinates}</Text>
              <View style={styles.addressRow}>
                <Image source={require('../assets/map-pin.png')} style={styles.icon} />
                <Text style={styles.cardAddress}>{current.address}</Text>
              </View>
            </View>
            <View style={styles.cardButtons}>
              {}
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <TouchableOpacity onPress={() => { animatePulse(); handleShare(); }}>
                  <LinearGradient colors={['#FFDB98', '#654200']} style={[styles.iconButtonBorder, { width: iconButtonSize, height: iconButtonSize }]}>
                    <View style={styles.shareAndUnsavedInner}>
                      <Image
                        source={require('../assets/fa-solid_share.png')}
                        style={[styles.iconImageWhite, { width: iconSize, height: iconSize }]}
                      />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              {}
              <TouchableOpacity onPress={handleRoute} style={[styles.routeButton, { height: routeButtonHeight, marginHorizontal: routeButtonMargin }]}>
                <LinearGradient colors={['#FFDB98', '#654200']} style={styles.routeButtonInner}>
                  <Text style={styles.routeText}>Set route</Text>
                </LinearGradient>
              </TouchableOpacity>

              {}
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <TouchableOpacity onPress={() => { animatePulse(); handleSave(); }}>
                  <LinearGradient
                    colors={['#FFDB98', '#654200']}
                    style={[styles.iconButtonBorder, { width: iconButtonSize, height: iconButtonSize }]}
                  >
                    <View
                      style={[
                        styles.shareAndUnsavedInner,
                        saved && styles.savedButtonInner,
                      ]}
                    >
                      <Image
                        source={require('../assets/material-symbols_bookmark-rounded.png')}
                        style={saved ? [styles.iconImageBlack, { width: iconSize, height: iconSize }] : [styles.iconImageWhite, { width: iconSize, height: iconSize }]}
                      />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Animated.View>
          <TouchableOpacity
            style={[styles.buttonWrapper, { width: buttonWidth, height: buttonHeight }]}
            activeOpacity={0.8}
            onPress={handleSearchNew}
          >
            <LinearGradient colors={['#FFDB98', '#654200']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.button}>
              <Text style={styles.buttonText}>Search new</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RandomChoiceScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  backgroundInsideScroll: {
    flexGrow: 1,
    width: '100%',
    minHeight: '100%',
    alignItems: 'center',
    paddingBottom: 130,
  },
  card: {
    backgroundColor: '#111',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FFDB98',
    overflow: 'hidden',
    marginBottom: 20,
    marginTop: 40,
    justifyContent: 'space-between',
  },
  cardImage: {
    width: '100%',
  },
  cardBody: {

  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 4,
  },
  cardCoords: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 4,
  },
  cardAddress: {
    fontSize: 14,
    color: '#ccc',
    flex: 1,
    flexWrap: 'wrap',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    flexWrap: 'wrap',
  },
  icon: {
    width: 16,
    height: 16,
    tintColor: '#FFDB98',
    marginRight: 6,
  },
  cardButtons: {
    margin: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButtonBorder: {
    borderRadius: 12,
    padding: 2,
  },

  shareAndUnsavedInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#000',
  },
  savedButtonInner: {
    backgroundColor: '#FFDB98',
  },
  iconImageWhite: {
    tintColor: '#fff',
  },
  iconImageBlack: {
    tintColor: '#000',
  },

  routeButton: {
    flex: 1,
  },
  routeButtonInner: {
    flex: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonWrapper: {
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
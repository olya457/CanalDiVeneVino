import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Share,
  useWindowDimensions,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native'; 
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native'; 
import type { RootStackParamList, SurpriseStackParamList } from '../navigation/types'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

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

type Entry = {
  title: string;
  description: string;
  coordinates: string;
  address: string;
  imageName: string;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'VineBarMapScreen'>;

const FinalResultScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<SurpriseStackParamList, 'FinalResult'>>(); 
  const { categoryId } = route.params; 

  const { width } = useWindowDimensions();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [saved, setSaved] = useState(false);


  const [fadeAnim] = useState(new Animated.Value(0));
  const [translateYAnim] = useState(new Animated.Value(30));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  const containerWidth = Math.min(width * 0.9, 360);

  const allEntries: Entry[] = data[categoryId] || [];

  const getRandom = () => {

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 30,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {

      const randomIndex = Math.floor(Math.random() * allEntries.length);
      const randomEntry = allEntries[randomIndex];
      setEntry(randomEntry);
      setSaved(false);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  useEffect(() => {
    getRandom();
  }, [categoryId]); 

  useEffect(() => {
    if (entry) {
      loadSavedState();
    }
  }, [entry]);

  const loadSavedState = async () => {
    try {
      const SAVED_KEY = 'saved_places';
      const savedRaw = await AsyncStorage.getItem(SAVED_KEY);
      const savedList: Entry[] = savedRaw ? JSON.parse(savedRaw) : [];
      const isSaved = savedList.some((bar) => bar.title === entry?.title);
      setSaved(isSaved);
    } catch (e) {
      console.error('Error loading saved state:', e);
    }
  };

  const handleShare = async () => {
    if (entry) {
      await Share.share({
        message: `${entry.title} — ${entry.description}`,
      });
    }
  };

  const handleSave = async () => {
    try {
      const SAVED_KEY = 'saved_places';
      const savedRaw = await AsyncStorage.getItem(SAVED_KEY);
      let savedList: Entry[] = savedRaw ? JSON.parse(savedRaw) : [];

      if (entry) {
        if (saved) {
          savedList = savedList.filter((bar) => bar.title !== entry.title);
        } else {
          const exists = savedList.some((bar) => bar.title === entry.title);
          if (!exists) {
            savedList.push(entry);
          }
        }
        await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(savedList));
        setSaved(!saved);
      }
    } catch (e) {
      console.error('Error saving bar:', e);
    }
  };

  const handleRoute = () => {
    if (entry) {
      navigation.navigate('Main', {
        screen: 'VineBarMap',
        params: {
          coordinates: entry.coordinates,
          title: entry.title,
          selectedId: entry.title,
          autoFocus: true,
        },
      });
    }
  };


  const getImage = (name: string) => {
    try {
      const imageMap: { [key: string]: any } = {
        'image_romantic.png': require('../assets/image_romantic.png'),
        'image_romantic2.png': require('../assets/image_romantic2.png'),
        'image_romantic3.png': require('../assets/image_romantic3.png'),
        'image_romantic4.png': require('../assets/image_romantic4.png'),
        'image_romantic5.png': require('../assets/image_romantic5.png'),
        'image_local1.png': require('../assets/image_local1.png'),
        'image_local2.png': require('../assets/image_local2.png'),
        'image_local3.png': require('../assets/image_local3.png'),
        'image_local4.png': require('../assets/image_local4.png'),
        'image_local5.png': require('../assets/image_local5.png'),
        'image_elegant1.png': require('../assets/image_elegant1.png'),
        'image_elegant2.png': require('../assets/image_elegant2.png'),
        'image_elegant3.png': require('../assets/image_elegant3.png'),
        'image_elegant4.png': require('../assets/image_elegant4.png'),
        'image_elegant5.png': require('../assets/image_elegant5.png'),
        'image_hidden.png': require('../assets/image_hidden.png'),
        'image_hidden2.png': require('../assets/image_hidden2.png'),
        'image_hidden3.png': require('../assets/image_hidden3.png'),
        'image_hidden4.png': require('../assets/image_hidden4.png'),
        'image_hidden5.png': require('../assets/image_hidden5.png'), 
      };
      return imageMap[name] || require('../assets/default.png');
    } catch (error) {
      console.error(`Could not load image ${name}:`, error);
      return require('../assets/default.png');
    }
  };

  if (!entry) {
    return null;
  }

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
    >
      {}
      <Animated.Image
        source={require('../assets/surprise_header.png')}
        style={[
          styles.headerImage,
          {
            width: containerWidth,
            height: containerWidth * (163 / 393),
            transform: [{ scale: scaleAnim }],
          },
        ]}
      />

      {}
      <Animated.View
        style={[
          styles.card,
          { width: containerWidth },
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }],
          },
        ]}
      >
        <Image
          source={getImage(entry.imageName)}
          style={[styles.cardImage, { height: containerWidth * 0.54 }]}
        />
        <View style={styles.cardContent}>
          <Text style={styles.title}>{entry.title}</Text>
          <Text style={styles.text}>{entry.description}</Text>
          <Text style={styles.text}>📍 {entry.coordinates}</Text>
          <Text style={styles.text}>🏠 {entry.address}</Text>

          <View style={styles.buttonRow}>
            <LinearGradient colors={['#FFDB98', '#654200']} style={styles.iconButton}>
              <TouchableOpacity onPress={handleShare}>
                <Image source={require('../assets/fa-solid_share.png')} style={styles.icon} />
              </TouchableOpacity>
            </LinearGradient>

            <LinearGradient colors={['#FFDB98', '#654200']} style={styles.fullButton}>
              <TouchableOpacity onPress={handleRoute}>
                <Text style={styles.routeText}>Set Route</Text>
              </TouchableOpacity>
            </LinearGradient>

            <LinearGradient colors={['#FFDB98', '#654200']} style={styles.iconButton}>
              <TouchableOpacity onPress={handleSave}>
                <Image
                  source={require('../assets/material-symbols_bookmark-rounded.png')}
                  style={[styles.icon, { tintColor: saved ? '#000' : '#fff' }]}
                />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </Animated.View>

      {}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 120,
    paddingTop: 20,
  },
  headerImage: {
    resizeMode: 'cover',
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
    backgroundColor: '#1a1a1a',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 16,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  text: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  iconButton: {
    width: 52,
    height: 52,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullButton: {
    flex: 1,
    marginHorizontal: 8,
    height: 52,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '600',
  },
  newButton: {
    height: 60,
    marginTop: 28,
  },
  newButtonGradient: {
    flex: 1,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newButtonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '600',
  },
});

export default FinalResultScreen;
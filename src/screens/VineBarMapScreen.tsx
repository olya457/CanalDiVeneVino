import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Share,
  useWindowDimensions,
  Platform,
  Animated,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Provider, MapViewProps } from 'react-native-maps';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import LinearGradient from 'react-native-linear-gradient';
import type { Region } from 'react-native-maps';

export const darkMapStyle: any[] = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#3a3a3a' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#ffffff' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#2a2a2a' }],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{ color: '#6e6e6e' }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#4c4c4c' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#2f4f2f' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#a5d6a7' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#6a6a6a' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{ color: '#909090' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#b0b0b0' }],
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry',
    stylers: [{ color: '#c7c7c7' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#4a4a4a' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#2a3d4e' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#b3e5fc' }],
  },
];

type Entry = {
  id: string;
  title: string;
  description: string;
  coordinates: string;
  address: string;
  imageName: string;
};

const allBars: Entry[] = [
  {
    id: 'romantic1',
    title: 'Bar Canale',
    description: 'A romantic terrace overlooking the Grand Canal, perfect for sunset wine moments.',
    coordinates: '45.4360, 12.3290',
    address: 'Calle degli Albanesi, Sestiere San Marco, Venice',
    imageName: 'image_romantic.png',
  },
  {
    id: 'romantic2',
    title: 'Wine Bar 5000',
    description: 'Stylish setting near San Marco with an extensive wine and appetizer selection.',
    coordinates: '45.4345, 12.3400',
    address: 'Sestiere Castello 5018, 30122 Venice',
    imageName: 'image_romantic2.png',
  },
  {
    id: 'romantic3',
    title: 'Cantine del Vino già Schiavi',
    description: 'Canal-side traditional bar in Dorsoduro, intimate and picturesque.',
    coordinates: '45.4290, 12.3265',
    address: 'Fondamenta Nani, Dorsoduro, Venice',
    imageName: 'image_romantic3.png',
  },
  {
    id: 'romantic4',
    title: 'Alla Vedova',
    description: 'Classic bacaro with a cozy ambiance, ideal for couples.',
    coordinates: '45.5080, 12.3360',
    address: 'Ramo Cadro, Cannaregio, Venice',
    imageName: 'image_romantic4.png',
  },
  {
    id: 'romantic5',
    title: "Bar All'Angolo",
    description: 'Rustic and romantic with a local-friendly vibe and authentic wines.',
    coordinates: '45.4295, 12.3270',
    address: 'Dorsoduro, Venice',
    imageName: 'image_romantic5.png',
  },
  {
    id: 'local1',
    title: 'Vino Vero',
    description: 'Intimate wine bar in Cannaregio offering natural wines and a peaceful setting.',
    coordinates: '45.5020, 12.3370',
    address: 'Fondamenta Gasparo Contarini, Cannaregio, Venice',
    imageName: 'image_local1.png',
  },
  {
    id: 'local2',
    title: 'Bacaro al Ravano',
    description: 'Local cicchetti and wines near Rialto with traditional Venetian flavors.',
    coordinates: '45.4375, 12.3360',
    address: 'Rughetta del Ravano, Rialto, Venice',
    imageName: 'image_local2.png',
  },
  {
    id: 'local3',
    title: 'Do Mori',
    description: "One of Venice's oldest bacari, known for its charm and history.",
    coordinates: '45.4380, 12.3355',
    address: 'Calle Do Mori, San Polo, Venice',
    imageName: 'image_local3.png',
  },
  {
    id: 'local4',
    title: 'Osteria al Portego',
    description: 'Small but vibrant spot with homemade pasta and hearty cicchetti.',
    coordinates: '45.4382, 12.3357',
    address: 'Calle Malvasia, Castello, Venice',
    imageName: 'image_local4.png',
  },
  {
    id: 'local5',
    title: 'Cantina Do Mori',
    description: 'Traditional-style bacaro near San Marco, authentic and inviting.',
    coordinates: '45.4380, 12.3355',
    address: 'San Marco area, Venice',
    imageName: 'image_local5.png',
  },
  {
    id: 'elegant1',
    title: "Vineria all'Amarone",
    description: 'Premium wine bar focusing on Amarone della Valpolicella and fine experiences.',
    coordinates: '45.4378, 12.3350',
    address: 'San Polo area, Venice',
    imageName: 'image_elegant1.png',
  },
  {
    id: 'elegant2',
    title: "Harry’s Bar",
    description: 'Historic and refined, birthplace of the Bellini cocktail.',
    coordinates: '45.4347, 12.3380',
    address: 'Calle Vallaresso 1323, San Marco, Venice',
    imageName: 'image_elegant2.png',
  },
  {
    id: 'elegant3',
    title: 'Bar Canale',
    description: 'Refined wine bar with Grand Canal views and high-end service.',
    coordinates: '45.4360, 12.3290',
    address: 'Calle degli Albanesi, San Marco, Venice',
    imageName: 'image_elegant3.png',
  },
  {
    id: 'elegant4',
    title: 'Caffè Florian',
    description: 'Historic 18th-century café-bar with elegant decor and premium wines.',
    coordinates: '45.4345, 12.3390',
    address: 'Piazza San Marco, 57, Venice',
    imageName: 'image_elegant4.png',
  },
  {
    id: 'elegant5',
    title: 'Bar at Hotel Danieli',
    description: 'Sophisticated bar inside a luxury hotel, perfect for formal wine tastings.',
    coordinates: '45.4335, 12.3376',
    address: 'Riva degli Schiavoni, Venice',
    imageName: 'image_elegant5.png',
  },
  {
    id: 'hidden1',
    title: "Bar All'Angolo",
    description: 'Charming bar with rustic touches and minimal crowds.',
    coordinates: '45.4295, 12.3270',
    address: 'Dorsoduro, Venice',
    imageName: 'image_hidden.png',
  },
  {
    id: 'hidden2',
    title: 'Cantine del Vino già Schiavi',
    description: 'Hidden in plain sight, offers local wines and a canal-side setting.',
    coordinates: '45.4290, 12.3265',
    address: 'Fondamenta Nani, Dorsoduro, Venice',
    imageName: 'image_hidden2.png',
  },
  {
    id: 'hidden3',
    title: 'Vino Vero',
    description: 'Off the tourist path, specializing in natural and organic wines.',
    coordinates: '45.5020, 12.3370',
    address: 'Cannaregio, Venice',
    imageName: 'image_hidden3.png',
  },
  {
    id: 'hidden4',
    title: 'Bacaro de Bischeri',
    description: 'Lively atmosphere near Rialto with a young, fun vibe.',
    coordinates: '45.4376, 12.3362',
    address: 'Ruga dei Oresi, Rialto, Venice',
    imageName: 'image_hidden4.png',
  },
  {
    id: 'hidden5',
    title: 'Osteria Al Bacco',
    description: 'Quiet and unassuming bar with great prosecco and a view.',
    coordinates: '45.4300, 12.3275',
    address: 'Dorsoduro, Venice',
    imageName: 'image_hidden5.png',
  },
];

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

const parseCoordinates = (str: string): { latitude: number; longitude: number } => {
  const parts = str.split(',').map(s => parseFloat(s.trim()));
  return {
    latitude: isNaN(parts[0]) ? 0 : parts[0],
    longitude: isNaN(parts[1]) ? 0 : parts[1],
  };
};

const SAVED_KEY = 'saved_places';
const LAST_REGION_KEY = 'lastMapRegion';

const VineBarMapScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'VineBarMapScreen'>>();
  const navigation = useNavigation();
  const { title, coordinates, autoFocus } = route.params ?? { title: '', coordinates: '', autoFocus: false };

  const { width, height } = useWindowDimensions();
  const [selectedPlace, setSelectedPlace] = useState<Entry | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cardAnim] = useState(new Animated.Value(0));
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [hasFocusedOnce, setHasFocusedOnce] = useState(false);

  const [currentMapProvider, setCurrentMapProvider] = useState<Provider | undefined>(
    Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined
  );

  const [showMap, setShowMap] = useState(true);

  const initialMapRegion: Region = {
    latitude: 45.4342, 
    longitude: 12.3389, 
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  const [region, setRegion] = useState<Region>(initialMapRegion); 

  const CARD_WIDTH = Math.min(330, width - 40);
  const CARD_HEIGHT = height < 700 ? 350 : 400;

  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setHasFocusedOnce(false);
      if (Platform.OS === 'android') {
        setShowMap(false); 
      }
    });
    return unsubscribe;
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android' && !showMap) {
        const timer = setTimeout(() => {
          setShowMap(true); 
        }, 100); 
        return () => clearTimeout(timer);
      }
      return undefined;
    }, [showMap])
  );

  useEffect(() => {
    const loadLastRegion = async () => {
      try {
        const saved = await AsyncStorage.getItem(LAST_REGION_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setRegion(parsed);
        }
      } catch (error) {
        console.error('Failed to load last region', error);
      }
    };
    loadLastRegion();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (title && autoFocus && mapReady && showMap && !hasFocusedOnce) {
        const match = allBars.find(bar => bar.title === title);
        if (match) {
          const coords = parseCoordinates(match.coordinates);
          const newRegion = {
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          };
          setSelectedPlace(match);
          setSelectedMarkerId(match.id);
          if (mapRef.current) {
            mapRef.current.animateToRegion(newRegion, 800);
            setRegion(newRegion);
          }
          Animated.timing(cardAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }).start();

          setHasFocusedOnce(true);
        }
      }

      return () => {
        if (selectedPlace) {
          setSelectedPlace(null);
          setSelectedMarkerId(null);
          Animated.timing(cardAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      };
    }, [title, autoFocus, mapReady, showMap, hasFocusedOnce, selectedPlace, cardAnim])
  );

  useEffect(() => {
    const loadFavorites = async () => {
      const json = await AsyncStorage.getItem(SAVED_KEY);
      if (json) {
        const savedEntries: Entry[] = JSON.parse(json);
        setFavorites(savedEntries.map(entry => entry.title));
      }
    };
    loadFavorites();
  }, []);

  const toggleFavorite = async (place: Entry) => {
    const json = await AsyncStorage.getItem(SAVED_KEY);
    const arr: Entry[] = json ? JSON.parse(json) : [];

    const exists = arr.some((e) => e.id === place.id);
    const updated = exists
      ? arr.filter((e) => e.id !== place.id)
      : [...arr, place];

    await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(updated));
    setFavorites(updated.map((e) => e.title));
  };

  const handleShare = async (place: Entry) => {
    try {
      await Share.share({
        title: place.title,
        message: `${place.title}\n\n${place.description}\n\n📍 ${place.address}`,
      });
    } catch (error) {
      console.error('Share failed', error);
    }
  };

  const handleRegionChangeComplete = (newRegion: Region) => {
    setRegion(newRegion);
    AsyncStorage.setItem(LAST_REGION_KEY, JSON.stringify(newRegion)).catch(e => console.error("Failed to save region", e));
  };

  return (
    <SafeAreaView style={styles.root}>
      <Image source={require('../assets/bar_map.png')} style={styles.topImage} />

      <View style={styles.mapWrapper}>
        {}
        {showMap && (
          <MapView
            key={showMap.toString()} 
            ref={mapRef}
            style={styles.map}
            provider={currentMapProvider} 
            region={region}
            onRegionChangeComplete={handleRegionChangeComplete}
            customMapStyle={darkMapStyle} 
            onMapReady={() => {
              console.log("MapView: onMapReady fired");
              setMapReady(true);
            }}
          >
            {allBars.map((bar) => (
              <Marker
                key={bar.id}
                coordinate={parseCoordinates(bar.coordinates)}
                onPress={() => {
                  setSelectedPlace(bar);
                  setSelectedMarkerId(bar.id);
                  const coords = parseCoordinates(bar.coordinates);
                  const newRegion = {
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                  };
                  mapRef.current?.animateToRegion(newRegion, 500);
                  setRegion(newRegion);
                  Animated.timing(cardAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                  }).start();
                }}
              >
                <LinearGradient
                  colors={['#FFD88F', '#BB7C05']}
                  style={{
                    width: bar.id === selectedMarkerId ? 52 : 36,
                    height: bar.id === selectedMarkerId ? 52 : 36,
                    borderRadius: 26,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: 'white',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 2,
                    elevation: 5,
                  }}
                >
                  <View style={{ width: 12, height: 12, backgroundColor: 'white', borderRadius: 6 }} />
                </LinearGradient>
              </Marker>
            ))}
          </MapView>
        )}
      </View>

      {selectedPlace && (
        <Animated.View
          style={[
            styles.cardContainer,
            {
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              marginLeft: -CARD_WIDTH / 2,
              marginTop: -CARD_HEIGHT / 2,
              opacity: cardAnim,
              transform: [{ scale: cardAnim }],
            },
          ]}
        >
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => {
                Animated.timing(cardAnim, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: true,
                }).start(() => {
                  setSelectedPlace(null);
                  setSelectedMarkerId(null);
                });
              }}
            >
              <Image
                source={require('../assets/closs.png')}
                style={styles.closeIconImage}
              />
            </TouchableOpacity>

            <Image source={getImageSource(selectedPlace.imageName)} style={styles.cardImage} />
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{selectedPlace.title}</Text>
              <Text style={styles.cardDesc}>{selectedPlace.description}</Text>
              <Text style={styles.cardAddr}>{selectedPlace.address}</Text>
            </View>
            <View style={styles.cardButtons}>
              <TouchableOpacity style={styles.iconButton} onPress={() => handleShare(selectedPlace)}>
                <Image source={require('../assets/fa-solid_share.png')} style={styles.iconImage} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => toggleFavorite(selectedPlace)}>
                {favorites.includes(selectedPlace.title) ? (
                  <LinearGradient colors={['#FFDB98', '#654200']} style={styles.iconButtonGradient}>
                    <Image
                      source={require('../assets/material-symbols_bookmark-rounded.png')}
                      style={styles.iconImageActive}
                    />
                  </LinearGradient>
                ) : (
                  <View style={styles.iconButton}>
                    <Image
                      source={require('../assets/material-symbols_bookmark-rounded.png')}
                      style={styles.iconImage}
                    />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

export default VineBarMapScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'black' },
  topImage: {
    width: '100%',
    height: 130,
    marginTop: Platform.OS === 'android' ? 10 : 0,
    resizeMode: 'stretch',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    transform: [{ translateY: -20 }],
  },
  mapWrapper: {
    height: '70%',
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    borderColor: '#FFDB98',
    borderWidth: 2,
  },
  map: { width: '100%', height: '100%' },
  cardContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 10,
    backgroundColor: '#222',
    borderRadius: 16,
    overflow: 'hidden',
    borderColor: '#FFDB98',
    borderWidth: 2,
  },
  card: { flex: 1, paddingBottom: 12 },
  closeIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 20,
    backgroundColor: 'black',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'white',
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIconImage: {
    width: 18,
    height: 18,
    tintColor: 'white',
  },
  cardImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  cardText: { padding: 12 },
  cardTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDesc: { color: '#ccc', fontSize: 14, marginBottom: 4 },
  cardAddr: { color: '#999', fontSize: 12 },
  cardButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFDB98',
  },
  iconImage: {
    width: 32,
    height: 32,
    tintColor: 'white',
  },
  iconImageActive: { width: 32, height: 32, tintColor: 'black' },
  iconButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
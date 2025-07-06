import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Share,
  Animated, 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

const SAVED_KEY = 'saved_places';

const imageMap: Record<string, any> = {
  'image_romantic.png': require('../assets/image_romantic.png'),
  'image_elegant1.png': require('../assets/image_elegant1.png'),
  'image_hidden.png': require('../assets/image_hidden.png'),
  'image_local1.png': require('../assets/image_local1.png'),
};

interface Entry {
  title: string;
  description: string;
  coordinates: string;
  address: string;
  imageName: string;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SavedBarsScreen = () => {
  const [savedItems, setSavedItems] = useState<Entry[]>([]);
  const navigation = useNavigation<NavigationProp>();
  const [animatedValues, setAnimatedValues] = useState<Animated.Value[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const json = await AsyncStorage.getItem(SAVED_KEY);
      const arr: Entry[] = json ? JSON.parse(json) : [];
      setSavedItems(arr);
      setAnimatedValues(arr.map(() => new Animated.Value(0)));
    };

    const unsubscribe = navigation.addListener('focus', fetchData);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (savedItems.length > 0) {
      const animations = animatedValues.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        })
      );
      Animated.stagger(150, animations).start();
    }
  }, [savedItems, animatedValues]); 

  const handleShare = async (item: Entry) => {
    try {
      await Share.share({
        message: `${item.title}\n${item.description}\nCoordinates: ${item.coordinates}\nAddress: ${item.address}`,
      });
    } catch (error) {
      console.error('Share error', error);
    }
  };

 const handleRoute = (item: Entry) => {
  navigation.navigate('Main', {
    screen: 'VineBarMap',
    params: {
      coordinates: item.coordinates,
      title: item.title,
      selectedId: item.title, 
      autoFocus: true,    
    },
  });
};


  const handleToggleSave = async (item: Entry) => {
    const json = await AsyncStorage.getItem(SAVED_KEY);
    const arr: Entry[] = json ? JSON.parse(json) : [];

    const exists = arr.some((e) => e.title === item.title);
    const updated = exists
      ? arr.filter((e) => e.title !== item.title)
      : [...arr, item];

    await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(updated));
    setSavedItems(updated);
    setAnimatedValues(updated.map(() => new Animated.Value(0)));
  };

  const renderCard = (item: Entry, index: number) => {
    const opacity = animatedValues[index] || new Animated.Value(0);

    const translateY = opacity.interpolate({
      inputRange: [0, 1],
      outputRange: [20, 0], 
    });

    return (
      <Animated.View
        key={`${item.title}-${index}`}
        style={{
          opacity,
          transform: [{ translateY }],
        }}
      >
        <View style={styles.card}>
          <Image
            source={imageMap[item.imageName] || require('../assets/default.png')}
            style={styles.cardImage}
          />
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
            <Text style={styles.cardCoords}>Coordinates: {item.coordinates}</Text>
            <View style={styles.addressRow}>
              <Image source={require('../assets/map-pin.png')} style={styles.icon} />
              <Text style={styles.cardAddress}>{item.address}</Text>
            </View>
          </View>
          <View style={styles.cardButtons}>
            {}
            <TouchableOpacity onPress={() => handleShare(item)}>
              <LinearGradient colors={['#FFDB98', '#654200']} style={styles.iconButtonBorder}>
                <View style={styles.iconButtonInnerBlack}>
                  <Image
                    source={require('../assets/fa-solid_share.png')}
                    style={styles.iconImageWhite}
                  />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {}
            <TouchableOpacity onPress={() => handleRoute(item)} style={styles.routeButton}>
              <LinearGradient colors={['#FFDB98', '#654200']} style={styles.routeButtonInner}>
                <Text style={styles.routeText}>Set route</Text>
              </LinearGradient>
            </TouchableOpacity>

            {}
            <TouchableOpacity onPress={() => handleToggleSave(item)}>
              <LinearGradient colors={['#FFDB98', '#654200']} style={styles.iconButtonBorder}>
                <LinearGradient colors={['#FFDB98', '#654200']} style={styles.iconButtonInnerSaved}>
                  <Image
                    source={require('../assets/material-symbols_bookmark-rounded.png')}
                    style={styles.iconImageBlack}
                  />
                </LinearGradient>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={require('../assets/saved_header.png')}
          style={styles.topImage}
          resizeMode="cover"
        />
        {savedItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>There are no saved bars yet</Text>
          </View>
        ) : (
          savedItems.map((item, index) => renderCard(item, index))
        )}
      </ScrollView>
    </View>
  );
};

export default SavedBarsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 100,
  },
  topImage: {
    width: 393,
    height: 163,
    marginBottom: 20,
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  card: {
    width: 334,
    backgroundColor: '#111',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FFDB98',
    overflow: 'hidden',
    marginBottom: 32,
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  cardBody: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 14,
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
    fontSize: 14,
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
    width: 48,
    height: 48,
    borderRadius: 12,
    padding: 2,
  },
  iconButtonInnerBlack: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  iconButtonInnerSaved: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  iconImageWhite: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  iconImageBlack: {
    width: 20,
    height: 20,
    tintColor: '#000',
  },
  routeButton: {
    flex: 1,
    height: 48,
    marginHorizontal: 12,
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
});
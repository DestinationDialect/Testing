import {
  ImageBackground,
  Image,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";

import unlockedAirportIcon from "../../assets/unlockedAirportIcon.png";
import lockedAirportIcon from "../../assets/lockedAirportIcon.png";
import unlockedRestaurantIcon from "../../assets/unlockedRestaurantIcon.png";
import lockedRestaurantIcon from "../../assets/lockedRestaurantIcon.png";
import unlockedHotelIcon from "../../assets/unlockedHotelIcon.png";
import lockedHotelIcon from "../../assets/lockedHotelIcon.png";
import unlockedMuseumIcon from "../../assets/unlockedMuseumIcon.png";
import lockedMuseumIcon from "../../assets/lockedMuseumIcon.png";
import unlockedZooIcon from "../../assets/unlockedZooIcon.png";
import lockedZooIcon from "../../assets/lockedZooIcon.png";
import unlockedFarmersMarketIcon from "../../assets/unlockedFarmersMarketIcon.png";
import lockedFarmersMarketIcon from "../../assets/lockedFarmersMarketIcon.png";
import unlockedHospitalIcon from "../../assets/unlockedHospitalIcon.png";
import lockedHospitalIcon from "../../assets/lockedHospitalIcon.png";

import star from "../../assets/star.png";

import { NavigationProp } from "@react-navigation/native";
import { useTheme } from "./ThemeContext";
import AudioManager from "./AudioManager";
import { StarData } from "./Login"; // import interface to store number of stars for each level

import styles from "./Styles";

import React from "react";
import { useState, useEffect } from "react";

import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

import AsyncStorage from "@react-native-async-storage/async-storage";

export interface RouterProps {
  navigation: NavigationProp<any, any>;
}

export interface RouteItem {
  id: number;
  title: string;
  unlockedIcon: string;
  lockedIcon: string;
  children?: RouteItem[];
  isUnlocked: boolean;
  level: number;
}

type IconKey =
  | "unlockedAirportIcon"
  | "lockedAirportIcon"
  | "unlockedRestaurantIcon"
  | "lockedRestaurantIcon"
  | "unlockedHotelIcon"
  | "lockedHotelIcon"
  | "unlockedMuseumIcon"
  | "lockedMuseumIcon"
  | "unlockedZooIcon"
  | "lockedZooIcon"
  | "unlockedFarmersMarketIcon"
  | "lockedFarmersMarketIcon"
  | "unlockedHospitalIcon"
  | "lockedHospitalIcon";

const iconMap: Record<IconKey, any> = {
  unlockedAirportIcon,
  lockedAirportIcon,
  unlockedRestaurantIcon,
  lockedRestaurantIcon,
  unlockedHotelIcon,
  lockedHotelIcon,
  unlockedMuseumIcon,
  lockedMuseumIcon,
  unlockedZooIcon,
  lockedZooIcon,
  unlockedFarmersMarketIcon,
  lockedFarmersMarketIcon,
  unlockedHospitalIcon,
  lockedHospitalIcon,
};

export const initialRouteData: RouteItem[] = [
  {
    id: 1,
    title: "AirportScenario",
    unlockedIcon: "unlockedAirportIcon",
    lockedIcon: "lockedAirportIcon",
    children: [
      {
        id: 2,
        title: "RestaurantScenario",
        unlockedIcon: "unlockedRestaurantIcon",
        lockedIcon: "lockedRestaurantIcon",
        isUnlocked: false,
        level: 1,
      },
      {
        id: 3,
        title: "HotelScenario",
        unlockedIcon: "unlockedHotelIcon",
        lockedIcon: "lockedHotelIcon",
        isUnlocked: false,
        level: 1,
      },
      {
        id: 4,
        title: "MuseumScenario",
        unlockedIcon: "unlockedMuseumIcon",
        lockedIcon: "lockedMuseumIcon",
        isUnlocked: false,
        level: 2,
      },
      {
        id: 5,
        title: "ZooScenario",
        unlockedIcon: "unlockedZooIcon",
        lockedIcon: "lockedZooIcon",
        isUnlocked: false,
        level: 2,
      },
      {
        id: 6,
        title: "FarmersMarketScenario",
        unlockedIcon: "unlockedFarmersMarketIcon",
        lockedIcon: "lockedFarmersMarketIcon",
        isUnlocked: false,
        level: 3,
      },
      {
        id: 7,
        title: "HospitalScenario",
        unlockedIcon: "unlockedHospitalIcon",
        lockedIcon: "lockedHospitalIcon",
        isUnlocked: false,
        level: 3,
      },
    ],
    isUnlocked: true,
    level: 0,
  },
];

const RouteItemComponent: React.FC<{
  item: RouteItem;
  navigation: NavigationProp<any, any>;
  stars: number;
  darkMode: boolean;
}> = ({ item, navigation, stars, darkMode }) => {
  const iconKey = item.isUnlocked
    ? (item.unlockedIcon as IconKey)
    : (item.lockedIcon as IconKey);
  const iconSource = iconMap[iconKey];
  return (
    <TouchableOpacity
      onPress={() => {
        AudioManager.playButtonSound();
        item.isUnlocked && navigation.navigate(item.title);
      }}
      style={styles.scenarioButton}
    >
      <Image
        style={styles.scenarioButtonIcon}
        source={iconSource}
        resizeMode="contain"
      />
      {item.isUnlocked && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={[routeStyles.starText, darkMode && routeStyles.darkStarText]}
          >
            {(Number.isInteger(stars) && stars.toFixed(0)) ||
              (!Number.isInteger(stars) && stars.toFixed(1))}
          </Text>
          <Image source={star} style={{ height: 20, width: 20, margin: 5 }} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const flattenRouteData = (data: RouteItem[]): RouteItem[] => {
  return data.reduce<RouteItem[]>((acc, item) => {
    acc.push({ ...item });
    if (item.children) {
      acc.push(...flattenRouteData(item.children));
    }
    return acc;
  }, []);
};

export const flattenedRouteData = flattenRouteData(initialRouteData);

const groupByLevel = (data: RouteItem[]): Record<number, RouteItem[]> => {
  const grouped: Record<number, RouteItem[]> = {};

  const addToGroup = (item: RouteItem) => {
    const level = item.level;
    if (!grouped[level]) {
      grouped[level] = [];
    }
    grouped[level].push(item);

    if (item.children) {
      item.children.forEach(addToGroup);
    }
  };

  data.forEach(addToGroup);
  return grouped;
};

const Route: React.FC<{
  data: RouteItem[];
  navigation: NavigationProp<any, any>;
  stars: StarData[];
  darkMode: boolean;
}> = ({ data, navigation, stars, darkMode }) => {
  const groupedData = groupByLevel(data);
  const levels = Object.keys(groupedData);
  const findStars = (id: number) => {
    const levelStars = stars.find((starItem) => starItem.id === id);
    if (levelStars) {
      return levelStars.stars;
    } else {
      return 0;
    }
  };
  return (
    <FlatList
      data={levels}
      keyExtractor={(level) => level}
      renderItem={({ item: level }) => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 5,
            marginHorizontal: 5,
          }}
        >
          {groupedData[parseInt(level)].map((item) => (
            <RouteItemComponent
              key={item.id}
              item={item}
              navigation={navigation}
              stars={findStars(item.id)}
              darkMode={darkMode}
            />
          ))}
        </View>
      )}
    />
  );
};

const RouteScreen = ({ navigation }: RouterProps) => {
  const [routeData, setRouteData] = useState<RouteItem[]>(initialRouteData);
  const [stars, setStars] = useState<StarData[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const { darkMode, toggleDarkMode } = useTheme();

  const unlockLevel = (id: number, data: RouteItem[]): RouteItem[] => {
    return data.map((item) => {
      if (item.id === id) {
        return { ...item, isUnlocked: true };
      }
      if (item.children) {
        return { ...item, children: unlockLevel(id, item.children) };
      }
      return item;
    });
  };

  const unlockNextLevel = (id: number, data: RouteItem[]): RouteItem[] => {
    return data.map((item) => {
      if (item.id === id && item.children && item.children.length > 0) {
        const updatedChildren = item.children.map((child, index) => {
          const childId = id + (index + 1);
          return unlockLevel(childId, [child])[index];
        });
        return { ...item, children: updatedChildren };
      }
      if (item.id === id && !item.children) {
        return unlockLevel(id + 1, data)[id];
      }
      if (item.children) {
        return { ...item, children: unlockNextLevel(id, item.children) };
      }
      return item;
    });
  };

  const handleLevelCompletion = (id: number) => {
    const updatedData = unlockNextLevel(id, routeData);
    setRouteData(updatedData); // Update state to trigger re-render
  };

  useEffect(() => {
    const getRouteData = async () => {
      try {
        const routeJSON = await AsyncStorage.getItem("routeData");
        if (routeJSON != null) {
          const route = JSON.parse(routeJSON);
          setRouteData(route);
        }
      } catch (error) {
        console.error("Error retrieving route data: ", error);
      }
    };
    const getStarData = async () => {
      try {
        const starJSON = await AsyncStorage.getItem("stars");
        if (starJSON != null) {
          setStars(JSON.parse(starJSON));
        }
      } catch (error) {
        console.error("Error retrieving star data: ", error);
      }
    };
    getRouteData();
    getStarData();
  }, []);

  return (
    <ImageBackground
      source={
        darkMode
          ? require("../../assets/darkRoute.png") // Dark mode image
          : require("../../assets/routeScreen.png") // Light mode image
      }
      resizeMode="cover"
      style={[styles.imgBackground, darkMode && styles.darkImgBackground]} // Apply Dark Mode styles
    >
      <Pressable
        onPress={() => {
          AudioManager.playButtonSound();
          navigation.navigate("Home");
        }}
      >
        <Image
          style={styles.backButtonIcon}
          source={
            darkMode
              ? require("../../assets/whiteBackArrow.png")
              : require("../../assets/backArrow.png")
          }
        />
      </Pressable>
      <Route
        data={routeData}
        navigation={navigation}
        stars={stars}
        darkMode={darkMode}
      />
    </ImageBackground>
  );
};

const routeStyles = StyleSheet.create({
  starText: {
    color: "black",
    fontSize: 18,
    margin: 5,
  },
  darkStarText: {
    color: "white",
    fontSize: 18,
    margin: 5,
  },
});

export default RouteScreen;

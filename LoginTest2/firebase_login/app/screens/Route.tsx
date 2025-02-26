import {
  ImageBackground,
  Image,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Pressable,
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

import { NavigationProp } from "@react-navigation/native";
import { useTheme } from "./ThemeContext"; 

import styles from "./Styles";

import React from "react";
import { useState, useEffect } from "react";

import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

interface RouteItem {
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

const initialRouteData: RouteItem[] = [
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
        isUnlocked: true,
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
}> = ({ item, navigation }) => {
  const iconKey = item.isUnlocked
    ? (item.unlockedIcon as IconKey)
    : (item.lockedIcon as IconKey);
  const iconSource = iconMap[iconKey];
  return (
    <TouchableOpacity
      onPress={() => item.isUnlocked && navigation.navigate(item.title)}
    >
      <Image
        style={styles.scenarioButtonIcon}
        source={iconSource}
        resizeMode="contain"
      />
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
}> = ({ data, navigation }) => {
  const groupedData = groupByLevel(data);
  const levels = Object.keys(groupedData);
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
            />
          ))}
        </View>
      )}
    />
  );
};

const RouteScreen = ({ navigation }: RouterProps) => {
  const [routeData, setRouteData] = useState<RouteItem[]>(initialRouteData);
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
    const getData = async () => {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const user_id = user.uid;
        const ref = doc(FIRESTORE_DB, "user_data", user_id);
        const docSnap = await getDoc(ref);
        const docData = docSnap.data();
        let i = 1;
        let updatedData = [...routeData];
        console.log("user found");
        if (docData) {
          let scenarioID = docData[i];
          while (scenarioID) {
            if (scenarioID && scenarioID.unlocked == true) {
              updatedData = unlockLevel(i, updatedData);
            }
            i = i + 1;
            scenarioID = docData[i];
          }
          setRouteData(updatedData);
        }
      }
    };
    getData();
    console.log(routeData);
    console.log(flattenedRouteData);
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
      <Pressable onPress={() => navigation.navigate("Home")}>
        <Image
          style={styles.backButtonIcon}
          source={
            darkMode 
            ? require("../../assets/whiteBackArrow.png")
            : require("../../assets/backArrow.png")
          }
        />
      </Pressable>
      <Route data={routeData} navigation={navigation} />
    </ImageBackground>
  );
};

export default RouteScreen;

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

import { NavigationProp } from "@react-navigation/native";

import styles from "./Styles";

import React from "react";
import { useState } from "react";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

interface RouteItem {
  id: string;
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
  | "lockedHotelIcon";

const iconMap: Record<IconKey, any> = {
  unlockedAirportIcon,
  lockedAirportIcon,
  unlockedRestaurantIcon,
  lockedRestaurantIcon,
  unlockedHotelIcon,
  lockedHotelIcon,
};

const initialRouteData: RouteItem[] = [
  {
    id: "1",
    title: "AirportScenario",
    unlockedIcon: "unlockedAirportIcon",
    lockedIcon: "lockedAirportIcon",
    children: [
      {
        id: "1.1",
        title: "RestaurantScenario",
        unlockedIcon: "unlockedRestaurantIcon",
        lockedIcon: "lockedRestaurantIcon",
        isUnlocked: false,
        level: 1,
      },
      {
        id: "1.2",
        title: "HotelScenario",
        unlockedIcon: "unlockedHotelIcon",
        lockedIcon: "lockedHotelIcon",
        isUnlocked: false,
        level: 1,
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
      <Image style={styles.scenarioButtonIcon} source={iconSource} />
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

const groupByLevel = (data: RouteItem[]): Record<number, RouteItem[]> => {
  return data.reduce<Record<number, RouteItem[]>>((acc, item) => {
    const level = item.level;
    if (!acc[level]) {
      acc[level] = [];
    }
    acc[level].push(item);

    if (item.children) {
      const childGroups = groupByLevel(item.children);
      Object.entries(childGroups).forEach(([childLevel, items]) => {
        const parsedLevel = parseInt(childLevel, 10);
        if (!acc[parsedLevel]) {
          acc[parsedLevel] = [];
        }
        acc[parsedLevel].push(...items);
      });
    }
    return acc;
  }, {});
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
            justifyContent: "space-around",
            marginVertical: 10,
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

  const unlockLevel = (id: string, data: RouteItem[]): RouteItem[] => {
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

  const handleLevelCompletion = (id: string) => {
    const updatedData = unlockLevel(id, routeData);
    setRouteData(updatedData); // Update state to trigger re-render
  };

  return (
    <ImageBackground
      source={require("../../assets/routeScreen.png")}
      resizeMode="cover"
      style={styles.imgBackground}
    >
      <Pressable onPress={() => navigation.navigate("Home")}>
        <Image
          style={styles.backButtonIcon}
          source={require("../../assets/backArrow.png")}
        />
      </Pressable>
      <Route data={routeData} navigation={navigation} />
    </ImageBackground>
  );
};

export default RouteScreen;

import {
  ImageBackground,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import styles from "./Styles";
import React from "react";
import { NavigationProp } from "@react-navigation/native";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Route = ({ navigation }: RouterProps) => {
  return (
    <ImageBackground
      source={require("../../assets/routeScreen.png")}
      resizeMode="cover"
      style={styles.imgBackground}
    >
      <ScrollView style={styles.scroller}>
        <Text style={styles.titleText}>Route</Text>

        <TouchableOpacity
          style={styles.airport}
          onPress={() => navigation.navigate("AirportScenario")}
        >
          <Text>Airport</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

export default Route;

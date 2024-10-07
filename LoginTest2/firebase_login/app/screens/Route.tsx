import { ImageBackground, View, Text, TouchableOpacity } from "react-native";
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("AirportScenario")}
        >
          <Text>Airport</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default Route;

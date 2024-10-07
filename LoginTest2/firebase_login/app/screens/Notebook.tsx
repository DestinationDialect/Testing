import { ImageBackground, View, Text, TouchableOpacity } from "react-native";
import styles from "./Styles";
import React from "react";
import { NavigationProp } from "@react-navigation/native";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Notebook = ({ navigation }: RouterProps) => {
  return (
    <ImageBackground
      source={require("../../assets/routeScreen.png")}
      resizeMode="cover"
      style={styles.imgBackground}
    >
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      ></View>
    </ImageBackground>
  );
};

export default Notebook;

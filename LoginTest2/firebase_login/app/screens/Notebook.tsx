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
      source={require("../../assets/homeScreen.png")}
      resizeMode="cover"
      style={styles.imgBackground}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Notebook</Text>
      </View>
    </ImageBackground>
  );
};

export default Notebook;
import { 
  ImageBackground, 
  View, 
  Text, 
  TouchableOpacity,
  Pressable, 
  Image,
} from "react-native";
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
      <Pressable onPress={() => navigation.goBack()}>
        <Image
          style={styles.backButtonIcon}
          source={require("../../assets/backArrow.png")}
        />
      </Pressable>

      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Notebook</Text>
      </View>
    </ImageBackground>
  );
};

export default Notebook;

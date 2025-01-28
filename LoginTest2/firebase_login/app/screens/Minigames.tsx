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

const Minigames = ({ navigation }: RouterProps) => {
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
        <Text style={styles.titleText}>Minigames</Text>
      </View>
      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Flashcards")}
        >
          <Text style={styles.buttonText}>Flashcards</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Matching")}
        >
          <Text style={styles.buttonText}>Matching</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default Minigames;

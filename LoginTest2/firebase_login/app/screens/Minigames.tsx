import { 
  ImageBackground, 
  View, 
  Text, 
  TouchableOpacity, 
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import styles from "./Styles";
import React from "react";
import { NavigationProp } from "@react-navigation/native";
import { useTheme } from "./ThemeContext";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Minigames = ({ navigation }: RouterProps) => {
  const { darkMode } = useTheme(); // Get Dark Mode from context

  return (
    <ImageBackground
      source={
        darkMode
          ? require("../../assets/DarkModeBackground.jpg") // Dark mode image
          : require("../../assets/homeScreen.png") // Light mode image
      }
      resizeMode="cover"
      style={[styles.imgBackground, darkMode && styles.darkImgBackground]} // Apply Dark Mode styles
    >
      <Pressable onPress={() => navigation.goBack()}>
        <Image
          style={styles.backButtonIcon}
          source={
            darkMode
              ? require("../../assets/whiteBackArrow.png")
              : require("../../assets/backArrow.png")
          }
        />
      </Pressable>

        <ScrollView contentContainerStyle={styles.minigamesContainer}>
          <View style={[styles.titleContainer, darkMode && styles.darkTitleContainer]}>
            <Text style={[styles.titleText, darkMode && styles.darkTitleText]}>Minigames</Text>
          </View>
            <View style={[styles.menu, darkMode && styles.darkMenu]}>
              <TouchableOpacity
                style={[styles.button, darkMode && styles.darkButton]}
                onPress={() => navigation.navigate("Flashcards")}
              >
                <Text style={[styles.buttonText, darkMode && styles.darkButtonText]}>Flashcards</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, darkMode && styles.darkButton]}
                onPress={() => navigation.navigate("Matching")}
              >
                <Text style={[styles.buttonText, darkMode && styles.darkButtonText]}>Matching</Text>
              </TouchableOpacity>
            </View>
        </ScrollView>
    </ImageBackground>
  );
};

export default Minigames;

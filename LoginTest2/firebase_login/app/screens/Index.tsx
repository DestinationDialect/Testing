import { ImageBackground, View, Text, TouchableOpacity } from "react-native";
import styles from "./Styles";
import React from "react";
import { NavigationProp } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { useTheme } from "./ThemeContext";
import AudioManager from "./AudioManager";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Home = ({ navigation }: RouterProps) => {
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
      <View style={[styles.titleContainer, darkMode && styles.darkTitleContainer]}>
        <Text style={[styles.titleText, darkMode && styles.darkTitleText]}>Destination Dialect</Text>
      </View>
      <View style={styles.menu}>
        <TouchableOpacity
          style={[styles.button, darkMode && styles.darkButton]}
          onPress={() => { 
            AudioManager.playButtonSound()   
            navigation.navigate("Route");
          }}
        >
          <Text style={[styles.buttonText, darkMode && styles.darkButtonText]}>Route</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, darkMode && styles.darkButton]}
          onPress={() => { 
            AudioManager.playButtonSound();
            navigation.navigate("Notebook")
          }}
        >
          <Text style={[styles.buttonText, darkMode && styles.darkButtonText]}>Notebook</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, darkMode && styles.darkButton]}
          onPress={() => { 
            AudioManager.playButtonSound();
            navigation.navigate("Minigames")
          }}
        >
          <Text style={[styles.buttonText, darkMode && styles.darkButtonText]}>Minigames</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, darkMode && styles.darkButton]}
          onPress={() => { 
            AudioManager.playButtonSound();
            navigation.navigate("Settings")
          }}
        >
          <Text style={[styles.buttonText, darkMode && styles.darkButtonText]}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, darkMode && styles.darkButton]}
          onPress={() => { 
            AudioManager.playButtonSound();
            AudioManager.stopBackgroundMusic(); 
            FIREBASE_AUTH.signOut();
          }}
        >
          <Text style={[styles.buttonText, darkMode && styles.darkButtonText]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default Home;

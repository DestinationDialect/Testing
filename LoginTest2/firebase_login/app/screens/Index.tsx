import { ImageBackground, View, Text, TouchableOpacity } from "react-native";
import styles from "./Styles";
import React from "react";
import { NavigationProp } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../../FirebaseConfig";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Home = ({ navigation }: RouterProps) => {
  return (
    <ImageBackground
      source={require("../../assets/homeScreen.png")}
      resizeMode="cover"
      style={styles.imgBackground}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Destination Dialect</Text>
      </View>
      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Route")}
        >
          <Text style={styles.buttonText}>Route</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Notebook")}
        >
          <Text style={styles.buttonText}>Notebook</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Minigames")}
        >
          <Text style={styles.buttonText}>Minigames</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Settings")}
        >
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => FIREBASE_AUTH.signOut()}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default Home;

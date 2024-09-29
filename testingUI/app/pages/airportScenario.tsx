import { Text, TouchableOpacity, ImageBackground, Image } from "react-native";

import styles from "./styles";

export default function airportScenario() {
  return (
    <ImageBackground>
      <Text style={styles.titleText}>Airport</Text>
      <TouchableOpacity>
        <Image source={require("../../assets/images/airplaneIcon.png")} />
      </TouchableOpacity>
    </ImageBackground>
  );
}

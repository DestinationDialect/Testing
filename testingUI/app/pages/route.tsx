import { Text, TouchableOpacity, ImageBackground, Image } from "react-native";
import { Link } from "expo-router";
import styles from "./styles";

export default function Route() {
  return (
    <ImageBackground>
      <Text style={styles.titleText}>Route</Text>
      <Link href="./airportScenario" asChild>
        <TouchableOpacity>
          <Image source={require("../../assets/images/airplaneIcon.png")} />
        </TouchableOpacity>
      </Link>
    </ImageBackground>
  );
}

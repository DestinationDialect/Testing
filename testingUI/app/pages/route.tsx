import {
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";
import styles from "../styles";

export default function Route() {
  return (
    <ImageBackground
      source={require("../../assets/images/roadmap.png")}
      resizeMode="cover"
      style={styles.imgBackground}
    >
      <ScrollView style={styles.scroller}>
        <Text style={styles.titleText}>Route</Text>
        <Link href="./airportScenario" asChild>
          <TouchableOpacity style={styles.airport}>
            <Text>Airport</Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </ImageBackground>
  );
}

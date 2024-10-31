import { ImageBackground, View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import styles from "../styles";

export default function Home() {
  return (
    <ImageBackground
      source={require("../../assets/images/road.png")}
      resizeMode="cover"
      style={styles.imgBackground}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Destination Dialect</Text>
      </View>
      <View style={styles.menu}>
        <Link href="./route" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Route</Text>
          </TouchableOpacity>
        </Link>
        <Link href="./notebook" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Notebook</Text>
          </TouchableOpacity>
        </Link>
        <Link href="./minigames" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Minigames</Text>
          </TouchableOpacity>
        </Link>
        <Link href="./settings" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ImageBackground>
  );
}

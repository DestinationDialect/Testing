import {
  ImageBackground,
  View,
  SafeAreaView,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
} from "react-native";

import styles from "./styles";

export default function LogIn() {
  const handleLogin = () => {};
  return (
    <SafeAreaView>
      <ImageBackground
        source={require("../../assets/images/roadSign.png")}
        style={styles.imgBackground}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Destination Dialect</Text>
        </View>
        <Text>Email:</Text>
        <TextInput placeholder="Enter your email" />
        <Text>Password:</Text>
        <TextInput placeholder="Enter your password" />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Switch to create an account</Text>
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  );
}

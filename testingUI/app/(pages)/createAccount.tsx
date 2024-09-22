import {
  ImageBackground,
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
} from "react-native";

import styles from "./styles";

export default function RegisterOrLogin() {
  const handleCreateAccount = () => {};
  return (
    <SafeAreaView>
      <ImageBackground
        source={require("../../assets/images/roadSign.png")}
        style={styles.imgBackground}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Destination Dialect</Text>
        </View>
        <Text>First Name:</Text>
        <TextInput placeholder="Enter your first name" />
        <Text>Last Name:</Text>
        <TextInput placeholder="Enter your last name" />
        <Text>Email:</Text>
        <TextInput placeholder="Enter your email" />
        <Text>Password:</Text>
        <TextInput placeholder="Create a password" />
        <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
          <Text style={styles.buttonText}>Create account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Switch to log in</Text>
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  );
}

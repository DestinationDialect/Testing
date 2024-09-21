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

function LogInScreen() {
  const openLogin = () => {};

  const openSignup = () => {};
  return (
    <SafeAreaView>
      <Text>Destination Dialect</Text>
      <View style={styles.button}>
        <Button title="Sign up" onPress={openSignup} />
      </View>
      <View style={styles.button}>
        <Button title="Log in" onPress={openLogin} />
      </View>
    </SafeAreaView>
  );
}

function LogIn() {
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
        <View style={styles.button}>
          <Button title="LOG IN" onPress={handleLogin} />
        </View>
        <View style={styles.button}>
          <Button title="Create an account" />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

export default function HomeScreen() {
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
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Route</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Notebook</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Minigames</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  titleText: {
    color: "white",
    fontSize: 30,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
  button: {
    padding: 10,
    margin: 10,
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 3,
    backgroundColor: "green",
    width: "50%",
    alignItems: "center",
  },
  imgBackground: {
    justifyContent: "center",
    flex: 1,
    width: null,
    height: null,
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "green",
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "white",
    marginLeft: "10%",
    width: "80%",
    height: 200,
  },
  menu: {
    alignItems: "center",
    marginBottom: 30,
  },
});

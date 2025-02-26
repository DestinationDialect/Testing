import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ImageBackground,
  Pressable, 
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "./ThemeContext";

export default function ContactUs() {
  const navigation = useNavigation();
  const { darkMode } = useTheme(); // Get Dark Mode from context

  // State variables for form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Function to handle form submission
  const handleSubmit = () => {
    if (!name || !email || !message) {
      Alert.alert("Error", "Please fill out all fields before submitting.");
      return;
    }

    // Simulating form submission
    Alert.alert("Success", "Your message has been sent!");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <ImageBackground
      source={
        darkMode
          ? require("../../assets/DarkModeBackground.jpg") // Dark mode image
          : require("../../assets/homeScreen.png") // Light mode image
      }
      resizeMode="cover"
      style={styles.background}
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

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, darkMode && styles.darkTitle]}>Contact Us</Text>
        <Text style={[styles.description, darkMode && styles.darkDescription]}>Have a question or feedback? Reach out to us!</Text>

        {/* Name Input */}
        <TextInput
          style={[styles.input, darkMode && styles.darkInput]}
          placeholder="Your Name"
          placeholderTextColor="white"
          value={name}
          onChangeText={setName}
        />

        {/* Email Input */}
        <TextInput
          style={[styles.input, darkMode && styles.darkInput]}
          placeholder="Your Email"
          placeholderTextColor="white"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* Message Input */}
        <TextInput
          style={[styles.input, darkMode && styles.darkInput, styles.textArea]}
          placeholder="Your Message"
          placeholderTextColor="white"
          value={message}
          onChangeText={setMessage}
          multiline
        />

        {/* Submit Button */}
        <TouchableOpacity style={[styles.button, darkMode && styles.darkButton]} onPress={handleSubmit}>
          <Text style={[styles.buttonText, darkMode && styles.darkButtonText]}>Send Message</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
  },
  backButtonIcon: {
    margin: 20,
    height: 30,
    width: 30,
  },

  //--------------
  darkTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "rgb(241, 236, 215)",
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1d1d1d",
    marginBottom: 10,
  },
  //---------------

  //---------------
  darkDescription: {
    fontSize: 16,
    color: "rgb(241, 236, 215)",
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: "#1d1d1d",
    textAlign: "center",
    marginBottom: 20,
  },
  //----------------

  //----------------
  darkInput: {
    width: "100%",
    backgroundColor: "darkgreen",
    color: "rgb(241, 236, 215)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: "rgb(241, 236, 215)",
  },
  input: {
    width: "100%",
    backgroundColor: "green",
    color: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: "white",
  },
  //----------------

  textArea: {
    height: 120,
    textAlignVertical: "top",
  },

  //----------------
  darkButton: {
    padding: 10,
    margin: 10,
    borderRadius: 10,
    borderColor: "rgb(241, 236, 215)",
    borderWidth: 3,
    backgroundColor: "darkgreen",
    alignItems: "center",
  },
  button: {
    padding: 10,
    margin: 10,
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 3,
    backgroundColor: "green",
    alignItems: "center",
  },
  //----------------

  //----------------
  darkButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  //----------------
});

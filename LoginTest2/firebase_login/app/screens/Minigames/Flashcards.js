import {
    Text,
    TouchableOpacity,
    ImageBackground,
    Image,
    View,
    TextInput,
    StyleSheet,
    Pressable,
    SafeAreaView,
  } from "react-native";
  import { useNavigation, } from "@react-navigation/native";
  import React, { useState, useEffect, useRef } from 'react';
  import FlashcardList from './FlashcardList';
  import { useTheme } from "../ThemeContext";
  
  const Flashcards = () => {
    const navigation = useNavigation();
    const [flashcards, setFlashcards] = useState([])
    const [numQuestions, setNumQuestions] = useState("5");
    const { darkMode } = useTheme(); // Get Dark Mode from context

    function handleGenerate() {
      const num = parseInt(numQuestions, 10) || 1; // Ensure it's a valid number
      const shuffled = [...FLASHCARDS].sort(() => Math.random() - 0.5);
      setFlashcards(shuffled.slice(0, Math.min(num, FLASHCARDS.length))); // Ensure it doesn't exceed the total number
    }
  
    return (
      <SafeAreaView style={styles.container}> 
        <ImageBackground
          source={
            darkMode
              ? require("../../../assets/DarkModeBackground.jpg") // Dark mode image
              : require("../../../assets/homeScreen.png") // Light mode image
          }
          resizeMode="cover"
          style={styles.imgBackground}
        >
          <Pressable onPress={() => navigation.goBack()}>
            <Image
              style={styles.backButtonIcon}
              source={
                darkMode
                  ? require("../../../assets/whiteBackArrow.png")
                  : require("../../../assets/backArrow.png")
              }
            />
          </Pressable>
        <View style={styles.header}>
          <Text style={[styles.label, darkMode && styles.darkLabel]}>Number of Questions</Text>
          <TextInput
            style={[styles.input, darkMode && styles.darkInput]}
            keyboardType="numeric"
            value={numQuestions}
            onChangeText={setNumQuestions}
          />
          <TouchableOpacity style={styles.button} onPress={handleGenerate}>
            <Text style={[styles.buttonText, darkMode && styles.darkButtonText]}>Generate</Text>
          </TouchableOpacity>
        </View>
        

        <View style={styles.container}>
        {flashcards.length > 0 ? (
          <FlashcardList flashcards={flashcards} />
        ) : (
          <Text style={[styles.emptyText, darkMode && styles.darkEmptyText]}>No flashcards available.</Text>
        )}
        </View> 
        </ImageBackground>
      </SafeAreaView>

    );
  };

  const FLASHCARDS = [
    {
      id: 1,
      question: "Hasta pronto",
      answer: "See you soon",
    },
    {
      id: 2,
      question: "Adios",
      answer: "Hello",
    },
    {
      id: 3,
      question: "Hola",
      answer: "Hello",
    },
    {
      id: 4,
      question: "Pollo",
      answer: "Chicken",
    },
    {
      id: 5,
      question: "Gato",
      answer: "Cat",
    },
    {
      id: 6,
      question: "Raton",
      answer: "Mouse",
    },
    {
      id: 7,
      question: "Perro",
      answer: "Dog",
    },
    {
      id: 8,
      question: "Por favor",
      answer: "Please",
    },
    {
      id: 9,
      question: "No",
      answer: "No",
    },
    {
      id: 10,
      question: "Si",
      answer: "Yes",
    },
    {
      id: 11,
      question: "Gracias",
      answer: "Thank you",
    },
    {
      id: 12,
      question: "Hasta Luego",
      answer: "See you later",
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    }, 
    imgBackground: { 
      flex: 1,
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    backButtonIcon: { 
      margin: 20,
      height: 30,
      width: 30,
    },
    header: { 
      padding: 10, 
      alignItems: "center" 
    },

    //--------------
    darkLabel: {
      fontSize: 20, 
      color: "rgb(241, 236, 215)",
    },
    label: { 
      fontSize: 20, 
      color: "black",
    },
    //---------------

    //---------------
    darkInput: {
      borderWidth: 2, 
      borderColor: "rgb(241, 236, 215)", 
      padding: 10, 
      width: 100, 
      textAlign: "center", 
      borderRadius: 5, 
      marginBottom: 10,
      backgroundColor: "darkgreen",
      color: "rgb(241, 236, 215)",
    },
    input: { 
      borderWidth: 2, 
      borderColor: "white", 
      padding: 10, 
      width: 100, 
      textAlign: "center", 
      borderRadius: 5, 
      marginBottom: 10,
      backgroundColor: "green",
      color: "white",
    },
    //-----------------

    button: { 
      backgroundColor: "blue", 
      padding: 10, 
      borderRadius: 5 
    },

    //-----------------
    darkButtonText: {
      color: "rgb(241, 236, 215)", 
      fontWeight: "bold" 
    },
    buttonText: { 
      color: "white", 
      fontWeight: "bold" 
    },
    //-----------------

    //-----------------
    emptyText: {
      color: "black",
      fontSize: 15,
    },
    darkEmptyText: {
      color: "rgb(241, 236, 215)",
      fontSize: 15,
    },
    //-----------------
  });
  
export default Flashcards;
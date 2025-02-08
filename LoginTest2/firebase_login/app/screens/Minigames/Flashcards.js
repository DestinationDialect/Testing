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
  // import { SafeAreaView } from "react-native-safe-area-context";
  // import './FlashStyles.tsx';
  //import styles from "../Styles";
  
  const Flashcards = () => {
    const navigation = useNavigation();
    const [flashcards, setFlashcards] = useState([])
    const [numQuestions, setNumQuestions] = useState("5");

    function handleGenerate() {
      const num = parseInt(numQuestions, 10) || 1; // Ensure it's a valid number
      const shuffled = [...FLASHCARDS].sort(() => Math.random() - 0.5);
      setFlashcards(shuffled.slice(0, Math.min(num, FLASHCARDS.length))); // Ensure it doesn't exceed the total number
    }
  
    return (
      <SafeAreaView style={styles.container}> 
        <ImageBackground
          source={require("../../../assets/homeScreen.png")}
          resizeMode="cover"
          style={styles.imgBackground}
        >
          <Pressable onPress={() => navigation.goBack()}>
            <Image
              style={styles.backButtonIcon}
              source={require("../../../assets/backArrow.png")}
            />
          </Pressable>
        <View style={styles.header}>
          <Text style={styles.label}>Number of Questions</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={numQuestions}
            onChangeText={setNumQuestions}
          />
          <TouchableOpacity style={styles.button} onPress={handleGenerate}>
            <Text style={styles.buttonText}>Generate</Text>
          </TouchableOpacity>
        </View>
        

        <View style={styles.container}>
        {flashcards.length > 0 ? (
          <FlashcardList flashcards={flashcards} />
        ) : (
          <Text style={styles.emptyText}>No flashcards available.</Text>
        )}
        </View> 
        </ImageBackground>
      </SafeAreaView>

    );
  };

  const FLASHCARDS = [
    {
      id: 1,
      question: "What is the air speed velocity of an unladen swallow?",
      answer: "Is that an African or European swallow?",
      //options: ["Is that an African or European swallow?", "Yellow", "I mean Blue", "Sir Lancelot of Camelot"]
    },
    {
      id: 2,
      question: "Hasta pronto",
      answer: "See you soon",
      //options: ["Hello", "Goodbye", "See you soon", "See you later"]
    },
    {
      id: 3,
      question: "Adios",
      answer: "Hello",
      //options: ["Hello", "Goodbye", "See you soon", "See you later"]
    },
    {
      id: 4,
      question: "Hola",
      answer: "Hello",
      //options: ["Hello", "Goodbye", "See you soon", "See you later"]
    },
    {
      id: 5,
      question: "Pollo",
      answer: "Chicken",
      //options: ["Dog", "Chicken", "Cat", "Mouse"]
    },
    {
      id: 6,
      question: "Gato",
      answer: "Cat",
      //options: ["Dog", "Chicken", "Cat", "Mouse"]
    },
    {
      id: 7,
      question: "Raton",
      answer: "Mouse",
      //options: ["Dog", "Chicken", "Cat", "Mouse"]
    },
    {
      id: 8,
      question: "Perro",
      answer: "Dog",
      //options: ["Dog", "Chicken", "Cat", "Mouse"]
    },
    {
      id: 9,
      question: "Por favor",
      answer: "Please",
      //options: ["Please", "Yes", "Thank you", "No"]
    },
    {
      id: 10,
      question: "No",
      answer: "No",
      //options: ["Please", "Yes", "Thank you", "No"]
    },
    {
      id: 11,
      question: "Si",
      answer: "Yes",
      //options: ["Please", "Yes", "Thank you", "No"]
    },
    {
      id: 12,
      question: "Gracias",
      answer: "Thank you",
      //options: ["Please", "Yes", "Thank you", "No"]
    },
    {
      id: 13,
      question: "Hasta Luego",
      answer: "See you later",
      //options: ["Hello", "Goodbye", "See you soon", "See you later"]
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
    // backButton: { 
    //   position: "absolute", 
    //   top: 20, 
    //   left: 20 
    // },
    backButtonIcon: { 
      margin: 20,
      height: 30,
      width: 30,
    },
    header: { 
      padding: 10, 
      alignItems: "center" 
    },
    label: { 
      fontSize: 20, 
      color: "black",
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
    button: { 
      backgroundColor: "rgb(0, 150, 255)", 
      padding: 10, 
      borderRadius: 5 
    },
    buttonText: { 
      color: "white", 
      fontWeight: "bold" 
    },
  });
  
export default Flashcards;
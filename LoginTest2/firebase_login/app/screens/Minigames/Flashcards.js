import {
    Text,
    TouchableOpacity,
    ImageBackground,
    Image,
    View,
    FlatList,
    Pressable,
  } from "react-native";
  import { useNavigation, } from "@react-navigation/native";
  import React, { useState, useEffect, useRef } from 'react';
  import FlashcardList from './FlashcardList';
  import './app.css';
  
  
  import styles from "../Styles";
  
  const Flashcards = () => {
    const navigation = useNavigation();

    const [flashcards, setFlashcards] = useState([])

  const amountRef = useRef()

  function handleSubmit(e){
    e.preventDefault();
    const num = parseInt(amountRef.current.value, 10) || 1; // Ensure it's a valid number
    const shuffled = [...FLASHCARDS].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled.slice(0, Math.min(num, FLASHCARDS.length))); // Ensure it doesn't exceed the total number
  }
  
    return (
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
          <form className='header' onSubmit={handleSubmit}>
      <div className='form-group'>
        <label htmlFor='amount'>Number Of Questions</label>
        <input type='number' id='amount' min='1' max='10' step='1' defaultValue={5} ref={amountRef}></input>
        <button className='flashcardButton'>Generate</button>
      </div>
    </form>
    <div className='container'>
      <FlashcardList flashcards = {flashcards} />
    </div>
      </ImageBackground>

    );
  };

  const FLASHCARDS = [
    {
      id: 1,
      question: "What is the air speed velocity of an unladen swallow?",
      answer: "Is that an African or European swallow?",
      options: ["Is that an African or European swallow?", "Yellow", "I mean Blue", "Sir Lancelot of Camelot"]
    },
    {
      id: 2,
      question: "Hasta pronto",
      answer: "See you soon",
      options: ["Hello", "Goodbye", "See you soon", "See you later"]
    },
    {
      id: 3,
      question: "Adios",
      answer: "Hello",
      options: ["Hello", "Goodbye", "See you soon", "See you later"]
    },
    {
      id: 4,
      question: "Hola",
      answer: "Hello",
      options: ["Hello", "Goodbye", "See you soon", "See you later"]
    },
    {
      id: 5,
      question: "Pollo",
      answer: "Chicken",
      options: ["Dog", "Chicken", "Cat", "Mouse"]
    },
    {
      id: 6,
      question: "Gato",
      answer: "Cat",
      options: ["Dog", "Chicken", "Cat", "Mouse"]
    },
    {
      id: 7,
      question: "Raton",
      answer: "Mouse",
      options: ["Dog", "Chicken", "Cat", "Mouse"]
    },
    {
      id: 8,
      question: "Perro",
      answer: "Dog",
      options: ["Dog", "Chicken", "Cat", "Mouse"]
    },
    {
      id: 9,
      question: "Por favor",
      answer: "Please",
      options: ["Please", "Yes", "Thank you", "No"]
    },
    {
      id: 10,
      question: "No",
      answer: "No",
      options: ["Please", "Yes", "Thank you", "No"]
    },
    {
      id: 11,
      question: "Si",
      answer: "Yes",
      options: ["Please", "Yes", "Thank you", "No"]
    },
    {
      id: 12,
      question: "Gracias",
      answer: "Thank you",
      options: ["Please", "Yes", "Thank you", "No"]
    },
    {
      id: 13,
      question: "Hasta Luego",
      answer: "See you later",
      options: ["Hello", "Goodbye", "See you soon", "See you later"]
    },
  ]
  
  export default Flashcards;
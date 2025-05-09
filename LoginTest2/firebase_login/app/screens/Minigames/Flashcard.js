import React, { useState, useEffect, useRef, use } from "react";
import {
  Text,
  TouchableOpacity,
  Animated,
  View,
  StyleSheet,
} from "react-native";
import { useTheme } from "../ThemeContext";

export default function Flashcard({ flashcard }) {
  const [flip, setFlip] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const { darkMode } = useTheme(); // Get Dark Mode from context

  const flipCard = () => {
    Animated.timing(animatedValue, {
      toValue: flip ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setFlip(!flip));
  };

  const frontAnimatedStyle = {
    transform: [
      {
        rotateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "180deg"],
        }),
      },
    ],
  };

  const backAnimatedStyle = {
    transform: [
      {
        rotateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: ["180deg", "360deg"],
        }),
      },
    ],
  };

  return (
    <TouchableOpacity onPress={flipCard}>
      <View style={[styles.cardContainer]}>
        <Animated.View style={[styles.card, darkMode && styles.darkCard, frontAnimatedStyle, !flip && { zIndex: 1 }]}>
          <Text style={[styles.text, darkMode && styles.darkText]}>{flashcard.question}</Text>
        </Animated.View>
        <Animated.View style={[styles.card, darkMode && styles.darkCard, styles.cardBack, darkMode && styles.darkCardBack, backAnimatedStyle, flip && { zIndex: 1 }]}>
          <Text style={[styles.text, darkMode && styles.darkText]}>{flashcard.answer}</Text>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: 250,
    height: 150,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  //----------------
  darkCard: {
    width: 250, 
    height: 150, 
    backgroundColor: "darkgreen", 
    justifyContent: "center", 
    alignItems: "center", 
    backfaceVisibility: "hidden", 
    borderRadius: 10, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 3.84, 
    elevation: 5, 
    borderColor: "rgb(241, 236, 215)",
    borderWidth: 2,
    padding: 5, 
  },
  card: { 
    width: 250, 
    height: 150, 
    backgroundColor: "green", 
    justifyContent: "center", 
    alignItems: "center", 
    backfaceVisibility: "hidden", 
    borderRadius: 10, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 3.84, 
    elevation: 5, 
    borderColor: "white",
    borderWidth: 2,
    padding: 5,
  },
  //----------------

  //----------------
  darkCardBack: {
    position: "absolute", 
    backgroundColor: "#d8a208",
  },
  cardBack: { 
    position: "absolute", 
    backgroundColor: "#ffc82c",
  },
  //----------------

  //----------------
  darkText: {
    fontSize: 18, 
    fontWeight: "bold", 
    textAlign: "center",
    color: "rgb(241, 236, 215)",
  },
  text: { 
    fontSize: 18, 
    fontWeight: "bold", 
    textAlign: "center",
    color: "white",
  },
  //----------------

  option: { 
    fontSize: 14, 
    color: "white", 
    marginTop: 5 
  },
});

import { Image, StyleSheet, Platform } from "react-native";
import {
  Text,
  SafeAreaView,
  View,
  Pressable,
  Alert,
  ImageBackground,
} from "react-native";
import { SetStateAction, useEffect, useState } from "react";

const QUESTIONS = [
  {
    question: "What does habitacion mean?",
    options: ["room", "sun", "dog", "house"],
    correctAnswer: "room",
  },
  {
    question: "What does maleta mean?",
    options: ["bell", "reservation", "suitcase", "horse"],
    correctAnswer: "suitcase",
  },
];

export default function HotelScenario() {
  const [currentquestionindex, setcurrentquestionindex] = useState(0);
  const [selectedOption, setselectedOption] = useState("");
  const [isCorrect, setisCorrect] = useState(false);

  const checkAnswer = (pressedOption: string) => {
    setselectedOption(pressedOption);

    const isAnswerCorrect =
      QUESTIONS[currentquestionindex].correctAnswer === pressedOption;
    setisCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      Alert.alert("Correct!");
    } else {
      Alert.alert("Incorrect :(");
    }
  };

  const nextQuestion = () => {
    if (currentquestionindex === QUESTIONS.length - 1) {
      setcurrentquestionindex(0);
      return;
    }
    setisCorrect(false);
    setcurrentquestionindex(currentquestionindex + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../../../assets/insideHotel.png")}
        style={styles.imageBackground}
        resizeMode="cover"
      ></ImageBackground>
      <View style={styles.overlay}>
        <Text style={styles.question}>
          {QUESTIONS[currentquestionindex].question}
        </Text>

        {QUESTIONS[currentquestionindex].options.map((option, index) => (
          //<View style={styles.option}>
          <Pressable key={index} onPress={() => checkAnswer(option)}>
            <Text
              style={[
                styles.option,
                isCorrect ? styles.correctAnswer : styles.option,
              ]}
            >
              {option}
            </Text>
          </Pressable>
          //</View>
        ))}

        <Pressable onPress={nextQuestion} style={styles.nextButton}>
          <Text style={styles.buttonText}>Next Question</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
  },
  overlay: {
    paddingVertical: 50,
    backgroundColor: "green",
    color: "white",
    position: "absolute",
    bottom: 0,
    height: "50%",
    width: "100%",
    justifyContent: "center",
    borderColor: "white",
    borderWidth: 5,
    borderRadius: 25,
  },
  imageBackground: {
    width: "100%",
    height: "75%",
    resizeMode: "cover",
  },
  question: {
    color: "white",
    padding: 15,
    marginBottom: 4,
    marginTop: 6,
    fontSize: 30,
  },
  option: {
    color: "white",
    borderColor: "white",
    borderBlockColor: "white",
    borderWidth: 3,
    borderRadius: 5,
    marginVertical: 4,
    marginHorizontal: 5,
    fontSize: 25,
    paddingLeft: 10,
  },
  correctAnswer: {
    borderWidth: 3,
    borderRadius: 5,
    marginVertical: 4,
    marginHorizontal: 5,
    backgroundColor: "chartreuse",
    color: "white",
  },
  nextButton: {
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
    borderColor: "white",
    borderWidth: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});

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
import { flattenedRouteData } from "../../screens/Route";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../FirebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

const QUESTIONS = [
  {
    question: "What does juevos mean?",
    options: ["egg", "sun", "dog", "house"],
    correctAnswer: "egg",
  },
  {
    question: "What does caballo mean?",
    options: ["sandwich", "fish", "eggs", "horse"],
    correctAnswer: "horse",
  },
];

export default function RestaurantScenario() {
  const [currentquestionindex, setcurrentquestionindex] = useState(0);
  const [selectedOption, setselectedOption] = useState("");
  const [isCorrect, setisCorrect] = useState(false);
  const name = 'RestaurantScenario';
  const currentRouteLocation = flattenedRouteData.find(item => item.title === name);

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

  const nextQuestion = async () => {
    if (currentquestionindex === QUESTIONS.length - 1) {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const user_id = user.uid;
        const ref = doc(FIRESTORE_DB, "user_data", user_id);
        const docSnap = await getDoc(ref);
        const docData = docSnap.data();
        let i = 0
          
        if (currentRouteLocation && docData) {
          let i = currentRouteLocation.id;
          let scenarioID = docData[i+1];
          if (scenarioID) {
            setDoc(
              doc(FIRESTORE_DB, "user_data", user_id),
              {
                [flattenedRouteData[i].id]: {
                  name: flattenedRouteData[i].title,
                  stars: 0,
                  unlocked: true,
                },
              },
              { merge: true });
          }
        }
      }
      setcurrentquestionindex(0);
      return;
    }
    setisCorrect(false);
    setcurrentquestionindex(currentquestionindex + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../../../assets/insideRestaurant.png")}
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

import { Image, StyleSheet, Platform, Modal } from "react-native";
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
import RouteScreen from "../Route";
import { useNavigation } from "@react-navigation/native";
import * as Speech from "expo-speech";

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
  const navigation = useNavigation();

  const name = "HotelScenario";
  const currentRouteLocation = flattenedRouteData.find(
    (item) => item.title === name
  );

  const [score, setscore] = useState(90);
  const [isVisible, setVisible] = useState(false);
  const [scores, setScores] = useState<number[]>([]);

  const checkAnswer = (pressedOption: string) => {
    setselectedOption(pressedOption);

    const isAnswerCorrect =
      QUESTIONS[currentquestionindex].correctAnswer === pressedOption;
    setisCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      Alert.alert("Correct!");
    } else {
      Alert.alert("Incorrect :(");
      if (score > 0) setscore(score - 30);
    }
  };

  const nextQuestion = async () => {
    if (isCorrect) {
      setScores([...scores, score]);
      if (currentquestionindex === QUESTIONS.length - 1) {
        const averageScore =
          scores.length > 0
            ? Math.round(
                scores.reduce((sum, score) => sum + score, 0) / scores.length
              )
            : 0;
        const stars = averageScore / 30;
        const user = FIREBASE_AUTH.currentUser;
        if (user) {
          const user_id = user.uid;
          const ref = doc(FIRESTORE_DB, "user_data", user_id);
          const docSnap = await getDoc(ref);
          const docData = docSnap.data();
          let i = 0;

          if (currentRouteLocation && docData) {
            let i = currentRouteLocation.id;
            let scenarioID = docData[i + 1];
            if (scenarioID) {
              setDoc(
                doc(FIRESTORE_DB, "user_data", user_id),
                {
                  [flattenedRouteData[i].id]: {
                    name: flattenedRouteData[i].title,
                    stars: stars,
                    unlocked: true,
                  },
                },
                { merge: true }
              );
            }
          }
        }
        setcurrentquestionindex(0);
        setVisible(true);
        return;
      }
      setisCorrect(false);
      setscore(90);
      setcurrentquestionindex(currentquestionindex + 1);
    }
  };

  const averageScore =
    scores.length > 0
      ? Math.round(
          scores.reduce((sum, score) => sum + score, 0) / scores.length
        )
      : 0;

  return (
    <SafeAreaView style={styles.container}>
      <Modal visible={isVisible} transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.score}>You got {averageScore / 30} stars!</Text>
            <Pressable
              onPress={() => setVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.buttonText}>Review Lesson</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <ImageBackground
        source={require("../../../assets/insideHotel.png")}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <Pressable onPress={() => navigation.goBack()}>
          <Image
            style={styles.backButtonIcon}
            source={require("../../../assets/backArrow.png")}
          />
        </Pressable>
      </ImageBackground>
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
  score: {
    fontSize: 36,
    justifyContent: "center",
    textAlign: "center",
    marginBottom: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
  },
  modalView: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  backButtonIcon: {
    margin: 20,
    height: 30,
    width: 30,
  },
});

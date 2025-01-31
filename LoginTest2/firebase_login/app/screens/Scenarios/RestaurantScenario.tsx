import { Image, StyleSheet, Modal } from "react-native";
import {
  Text,
  SafeAreaView,
  View,
  Pressable,
  Alert,
  ImageBackground,
} from "react-native";
import { useEffect, useState } from "react";
import { flattenedRouteData } from "../../screens/Route";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../FirebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import * as Speech from "expo-speech";
import AsyncStorage from "@react-native-async-storage/async-storage";

//import Tts from "react-native-tts";
interface Language {
  name: string;
  tag: string;
}

const languages: { [key: string]: Language } = {};
languages["English"] = { name: "English", tag: "en" };
languages["Spanish"] = { name: "Spanish", tag: "es" };
languages["French"] = { name: "French", tag: "fr" };
languages["German"] = { name: "German", tag: "de" };

const QUESTIONS = [
  {
    question: "Hello! Good afternoon. How are you?",
    options: [
      "Hello! Good afternoon. I'm fine, thank you. And you?",
      "Hello! How are you? I'm feeling bad.",
      "Hello! I don't know, how are you?",
    ],
    correctAnswer: "Hello! Good afternoon. I'm fine, thank you. And you?",
  },
  {
    question:
      "I'm fine, thank you. Welcome to our restaurant. Is this your first time here?",
    options: [
      "No, I've been here before. I really like this place.",
      "Yes, it's my first time.",
      "No, I've already been to another restaurant.",
    ],
    correctAnswer: "Yes, it's my first time.",
  },
  {
    question:
      "Great! Do you know already know what you're going to order or would you like to see the menu?",
    options: [
      "I would like to see the menu please.",
      "I know what I want, bring me what I always ask for.",
      "No, thanks, I don't want anything else.",
    ],
    correctAnswer: "I would like to see the menu please.",
  },
  {
    question:
      "Sure, here's the menu. Would you like something to drink while you decide?",
    options: [
      "I don't know, what do you have to drink?",
      "No, I just want water.",
      "Yes, please. Do you have orange juice?",
    ],
    correctAnswer: "Yes, please. Do you have orange juice?",
  },
  {
    question:
      "Yes, we have fresh orange juice. Would you like a small or large glass?",
    options: [
      "A large glass, please.",
      "A small glass, please.",
      "I don't want juice, just water is fine.",
    ],
    correctAnswer: "A large glass, please.",
  },
  {
    question: "Perfect. Would you like anything else?",
    options: [
      "Yes, I would like some carne asada tacos.",
      "No, that's fine.",
      "No, I don't want anymore food.",
    ],
    correctAnswer: "Yes, I would like some carne asada tacos.",
  },
  {
    question:
      "Perfect. So, a large orange juice and some carne asada tacos. Anything else to go with it?",
    options: [
      "No, I don't want anything else.",
      "Yes, I want an alcoholic drink too.",
      "No, just that. Thank you.",
    ],
    correctAnswer: "No, just that. Thank you.",
  },
  {
    question:
      "Here are your carne asada tacos and your orange juice. Enjoy!",
    options: [
      "Thank you! It looks delicious.",
      "Thanks! But this is not what I ordered.",
      "I don't like it very much, but thanks.",
    ],
    correctAnswer: "Thank you! It looks delicious.",
  },
  {
    question:
      "I'm glad you like it! If you need anything else, don't hesitate to ask me.",
    options: [
      "Yes, I want more salsa, please.",
      "Sure, thanks.",
      "No, I don't need anything else.",
    ],
    correctAnswer: "Sure, thanks.",
  },
  {
    question:
      "Here is your check whenever you're ready. Thank you for dining with us today!",
    options: [
      "Thank you.",
      "Yes, thank you, please.",
      "No, I don't need anything else.",
    ],
    correctAnswer: "Thank you.",
  },
];

export default function RestaurantScenario() {
  const [currentquestionindex, setcurrentquestionindex] = useState(0);
  const [selectedOption, setselectedOption] = useState("");
  const [isCorrect, setisCorrect] = useState(false);
  const navigation = useNavigation();

  const name = "RestaurantScenario";
  const currentRouteLocation = flattenedRouteData.find(
    (item) => item.title === name
  );

  const [score, setscore] = useState(90);
  const [isVisible, setVisible] = useState(false);
  const [scores, setScores] = useState<number[]>([]);
  const [language, setLanguage] = useState("English");
  const [languageStored, setLanguageStored] = useState(false);

  const getLanguage = async () => {
    // attempts to get language from async storage
    try {
      const lang = await AsyncStorage.getItem("newLanguage");
      return lang;
    } catch (error) {
      console.error("Error retrieving data from AsyncStorage:", error);
      return null; // Return null in case of an error
    }
  };

  const storeLanguage = async () => {
    // stores result of attempt to get language in variable and sets language to that if successful
    const lang = await getLanguage();
    if (lang) {
      setLanguage(lang);
    }
  };

  const speak = (text: string) => {
    Speech.stop();
    Speech.speak(text, { language: languages[language].tag });
  };

  useEffect(() => {
    const setLanguageAndSpeak = async () => {
      // gets language from async storage before speaking first question (on render)
      if (currentquestionindex === 0 && !languageStored) {
        await storeLanguage();
        setLanguageStored(true);
      }
      // speak question on render and every time question index changes
      if (languageStored) {
        speak(QUESTIONS[currentquestionindex].question);
      }
    };
    setLanguageAndSpeak();
  }, [currentquestionindex, languageStored]);

  const checkAnswer = (pressedOption: string) => {
    setselectedOption(pressedOption);
    speak(pressedOption); // speaks the selected answer
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
        source={require("../../../assets/insideRestaurant.png")}
        style={styles.imageBackground}
        resizeMode="cover"
      ></ImageBackground>
      <Pressable onPress={() => navigation.goBack()}>
        <Image
          style={styles.backButtonIcon}
          source={require("../../../assets/backArrow.png")}
        />
      </Pressable>
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
  ttsButton: {
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
    borderColor: "white",
    borderWidth: 3,
  },
});
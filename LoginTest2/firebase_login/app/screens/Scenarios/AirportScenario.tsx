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
import { translateText } from "../../../translate";
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
     question: "Hello, Welcome! Where are you flying to today?",
     answerChoices: ["Barcelona", "My house", "A new country"],
     correctAnswer: "Barcelona",
   },
   {
     question: "May I have your passport and ticket, please?",
     answerChoices: ["No", "Yes, here you go.", "Why?"],
     correctAnswer: "Yes, here you go.",
   },
   {
     question: "Are you checking any bags?",
     answerChoices: ["Yeah, but I want it back.", "Why?", "Yes, just this one."],
     correctAnswer: "Yes, just this one.",
   },
   {
     question: "Do you have a carry on bag?",
     answerChoices: ["Yes, here you go.", "No, just this backpack", "What if I do?"],
     correctAnswer: "Yes, here you go.",
   },
   {
     question: "Here is your boarding pass. Your flight leaves from gate 16A and it will begin boarding at 2:20pm. Your seat number is 25E. Now, you will need to head over to the security checkpoint.",
     answerChoices: ["Thank you.", "Can you say that again?", "Ok, what does that mean?"],
     correctAnswer: "Thank you.",
   },
   {
     question: "Welcome to the security checkpoint, please place your bags flat on the conveyor belt, and use the bins for your hat and shoes.",
     answerChoices: ["Where do I put my stuff?", "Okay, thank you.", "What did you say?"],
     correctAnswer: "Okay, thank you.",
   },
   {
     question: "Please walk through the metal detector.",
     answerChoices: ["I don't want to.", "Ok.", "Why?"],
     correctAnswer: "Ok.",
   },
   {
     question: "Please grab your items and you are all set. Have a nice flight!",
     answerChoices: ["Thank you, have a good day!", "Ok.", "Why?"],
     correctAnswer: "Thank you, have a good day!",
   },
   {
     question: "Arriving at your destination and going to customs... Hello! Can I see your passport?",
     answerChoices: ["Excuse me?", "No", "Here you go"],
     correctAnswer: "Here you go",
   },
   {
     question: "Everything looks good. Have a good stay!?",
     answerChoices: ["No", "Thank you!", "I don't want to"],
     correctAnswer: "Thank you!",
   },
];

export default function AirportScenario() {
  const [currentquestionindex, setcurrentquestionindex] = useState(0);
  const [selectedOption, setselectedOption] = useState("");
  const [isCorrect, setisCorrect] = useState(false);
  const navigation = useNavigation();

  const name = "AirportScenario";
  const currentRouteLocation = flattenedRouteData.find(
    (item) => item.title === name
  );

  const [score, setscore] = useState(90);
  const [isVisible, setVisible] = useState(false);
  const [scores, setScores] = useState<number[]>([]);
  const [learningLanguage, setLearningLanguage] = useState("English");
  const [firstLanguage, setFirstLanguage] = useState("English");
  const [languageStored, setLanguageStored] = useState(false);
  const [loading, setLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState("");

  const getLearningLanguage = async () => {
    // attempts to get target language from async storage
    try {
      const lang = await AsyncStorage.getItem("newLanguage");
      return lang;
    } catch (error) {
      console.error("Error retrieving data from AsyncStorage:", error);
      return null; // Return null in case of an error
    }
  };

  const getFirstLanguage = async () => {
    // attempts to get target language from async storage
    try {
      const lang = await AsyncStorage.getItem("originLanguage");
      return lang;
    } catch (error) {
      console.error("Error retrieving data from AsyncStorage:", error);
      return null; // Return null in case of an error
    }
  };

  const storeLanguage = async () => {
    // stores result of attempt to get language in variable and sets language to that if successful
    const lang = await getLearningLanguage();
    if (lang) {
      setLearningLanguage(lang);
    }
    const firstLang = await getFirstLanguage();
    if (firstLang) {
      setFirstLanguage(firstLang);
    }
  };

  const speak = (text: string) => {
    Speech.stop();
    Speech.speak(text, { language: languages[learningLanguage].tag });
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

  const handleTranslate = async () => {
    setLoading(true);
    try {
      const translation = await translateText(
        QUESTIONS[currentquestionindex].question,
        languages[firstLanguage].tag
      );
      setTranslatedText(translation);
    } catch (error) {
      console.error("Translation error:", error);
    }
    setLoading(false);
  };

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
        source={require("../../../assets/airport.png")}
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
        <Pressable onPress={() => handleTranslate()}>
          <Text>translate {translatedText}</Text>
        </Pressable>
        {QUESTIONS[currentquestionindex].answerChoices.map((option, index) => (
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
    fontSize: 25,
  },
  option: {
    color: "white",
    borderColor: "white",
    borderBlockColor: "white",
    borderWidth: 3,
    borderRadius: 5,
    marginVertical: 4,
    marginHorizontal: 5,
    fontSize: 20,
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
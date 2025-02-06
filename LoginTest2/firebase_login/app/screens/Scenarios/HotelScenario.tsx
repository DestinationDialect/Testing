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
    question: "Good afternoon. How may I help you?",
    options: ["I'm supposed to be staying here.", 
      "I have a room booked under the name Doe.", 
      "I just want my room.", 
    ],
    correctAnswer: "I have a room booked under the name Doe.",
  },
  {
    question: "Yes, I have a single king bed for 7 nights. Is that correct?",
    options: ["Yes, that is correct.", 
      "I thought I had a queen bed.", 
      "No, it should be for 7 nights.",
    ],
    correctAnswer: "Yes, that is correct.",
  },
  {
    question: "Ok, we have your credit card information on file, may I see your ID?",
    options: ["No.", 
      "Sure, no problem.", 
      "Why do you need my ID?",
    ],
    correctAnswer: "Sure, no problem.",
  },
  {
    question: "Thank you. Here is your key, you are in room 427. Breakfast starts at 7am.",
    options: ["No, thank you.", 
      "That's not my room.", 
      "Great, thank you.",
    ],
    correctAnswer: "Great, thank you.",
  },
  {
    question: "Do you have any questions I can answer for you?",
    options: ["What room am I in?", 
      "I don't think so.", 
      "Actually yes. Where is the pool?", 
    ],
    correctAnswer: "Actually yes. Where is the pool?",
  },
  {
    question: "We have an outdoor pool just out the door to your left. It's open from 7AM to 8PM.",
    options: ["Perfect. Also, is there a place nearby where I can get dinner?", 
      "I want dinner. Where are the restaurants?", 
      "I didn't ask.", 
    ],
    correctAnswer: "Perfect. Also, is there a place nearby where I can get dinner?",
  },
  {
    question: "Yes, there are several restaurants within walking distance. Here's a map with some recommendations.",
    options: ["Thank you. You've been very helpful.", 
      "Thanks, I'll just go to my room.", 
      "Ok, cool.", 
    ],
    correctAnswer: "Thank you. You've been very helpful.",
  },
  {
    question: "No problem. If you need anything else, please let us know. Enjoy your stay!",
    options: ["Why do you say that?", 
      "I will, thank you.", 
      "I won't.", 
    ],
    correctAnswer: "I will, thank you.",
  },
  {
    question: "Checking out of the hotel... Did you enjoy your stay with us?",
    options: ["Yes I did. What is the quickest way to get to the airport?", 
      "I need to get to the airport.", 
      "Where's the airport?", 
    ],
    correctAnswer: "Yes I did. What is the quickest way to get to the airport?",
  },
  {
    question: "We have a free airport shuttle service. The next shuttle leaves in 20 minutes.",
    options: ["Ok, I guess I'll just have to wait.", 
      "Great, thank you.", 
      "Why doesn't it leave earlier?", 
    ],
    correctAnswer: "Great, thank you.",
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
        <Pressable onPress={() => handleTranslate()}>
          <Text>translate {translatedText}</Text>
        </Pressable>
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
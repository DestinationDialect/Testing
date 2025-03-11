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
import { Vocab } from "../Notebook";
import { useTheme } from "../ThemeContext";
import AudioManager from "../AudioManager";
import { updateStars } from "./AirportScenario";
import { updateRoute, ScenarioNavigationProp } from "./AirportScenario";
interface Language {
  name: string;
  tag: string;
}

export const languages: { [key: string]: Language } = {};
languages["English"] = { name: "English", tag: "en" };
languages["Spanish"] = { name: "Spanish", tag: "es" };
languages["French"] = { name: "French", tag: "fr" };
languages["German"] = { name: "German", tag: "de" };

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

const QUESTIONS: Question[] = [
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
    question: "Here are your carne asada tacos and your orange juice. Enjoy!",
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
  const navigation = useNavigation<ScenarioNavigationProp>();
  const { darkMode } = useTheme(); // Get Dark Mode from context

  const name = "RestaurantScenario";
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
  const [translated, setTranslated] = useState(false);
  const [dialogue, setDialogue] = useState(QUESTIONS);
  const [nativeDialogue, setNativeDialogue] = useState(QUESTIONS);

  const getLearningLanguage = async () => {
    // attempts to get target language from async storage
    try {
      const lang = await AsyncStorage.getItem("newLanguage");
      console.log("learningLanguage: ", lang);
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

  // convert array of question objects to array of strings
  const flattenData = (data: Question[]): string[] => {
    return data.reduce<string[]>((acc, item) => {
      // reduce Questions array to string array
      acc.push(item.question); // push question
      item.options.forEach((option) => acc.push(option)); // push each option
      acc.push(item.correctAnswer); // push correct answer
      return acc;
    }, []);
  };

  // stores array of strings dialogue to send through translation API
  const flattenedQuestions = flattenData(QUESTIONS); // store questions as array of strings

  // changes array of strings back to array of Question objects
  const formatTranslation = (data: string[]): Question[] => {
    const dialogue: Question[] = [];
    for (let i = 0; i < data.length; i += 5) {
      const question = data[i];
      const options = [data[i + 1], data[i + 2], data[i + 3]];
      const correctAnswer = data[i + 4];

      dialogue.push({ question, options, correctAnswer });
    }
    return dialogue;
  };

  useEffect(() => {
    const setLanguageAndSpeak = async () => {
      // gets language from async storage before speaking first question (on render)
      if (currentquestionindex === 0 && !languageStored) {
        await storeLanguage();
        setLanguageStored(true);
      }
      // after language is stored, translates questions to language
      if (currentquestionindex === 0 && languageStored && !translated) {
        if (learningLanguage != "English") {
          await handleTranslateArray(
            flattenedQuestions,
            languages[learningLanguage].tag,
            "en"
          );
        }
        if (firstLanguage != "English") {
          await vocabTranslate(
            flattenedQuestions,
            languages[firstLanguage].tag,
            "en"
          );
        }
        setTranslated(true);
      }
      // speak question on render and every time question index changes, after language is stored
      // and dialogue is translated
      if (languageStored && translated) {
        speak(dialogue[currentquestionindex].question);
      }
    };
    setLanguageAndSpeak();
  }, [currentquestionindex, languageStored, translated]);

  const handleTranslateArray = async (
    text: string[],
    target: string,
    source: string
  ) => {
    setLoading(true);
    try {
      const translations = await translateText(text, target, source); // call API to translate text
      const translatedStrings = translations.map((t: any) => t.translatedText);
      setDialogue(formatTranslation(translatedStrings)); // store translation reformatted as array of objects
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      setLoading(false); // does not display dialogue until after translation
    }
  };

  const vocabTranslate = async (
    text: string[],
    target: string,
    source: string
  ) => {
    try {
      const translations = await translateText(text, target, source); // call API to translate text
      const translatedStrings = translations.map((t: any) => t.translatedText);
      setNativeDialogue(formatTranslation(translatedStrings)); // store translation reformatted as array of objects
    } catch (error) {
      console.error("Translation error:", error);
    }
  };

  const formatVocab = (
    data: Question[],
    translatedData: Question[]
  ): Vocab[] => {
    return data.reduce<Vocab[]>((acc, item, index) => {
      // reduce Questions array to Vocab array
      const item2 = translatedData[index];
      // stores question and answer for each question in the language they're learning and their first language
      acc.push({
        learnedText: item.question,
        translation: item2.question,
      });
      acc.push({
        learnedText: item.correctAnswer,
        translation: item2.correctAnswer,
      });

      return acc;
    }, []);
  };

  const storeVocab = async () => {
    const vocabulary = formatVocab(dialogue, nativeDialogue);
    try {
      const jsonVocab = JSON.stringify(vocabulary);
      await AsyncStorage.setItem("restaurantVocabulary", jsonVocab);
      console.log("vocab stored: ");
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const user_id = user.uid;
        await setDoc(
          doc(FIRESTORE_DB, "user_vocab_notebook", user_id),
          {
            RestaurantScenario: {
              title: "restaurantVocabulary",
              vocab: jsonVocab,
            },
          },
          { merge: true }
        );
      }
    } catch (error) {
      console.error("Error storing vocab: ", error);
    }
  };

  const checkAnswer = (pressedOption: string) => {
    setselectedOption(pressedOption);
    speak(pressedOption); // speaks the selected answer
    const isAnswerCorrect =
      dialogue[currentquestionindex].correctAnswer === pressedOption;
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
        storeVocab();
        updateRoute(3);
        const averageScore =
          scores.length > 0
            ? Math.round(
                scores.reduce((sum, score) => sum + score, 0) / scores.length
              )
            : 0;
        const stars = averageScore / 30;
        updateStars(2, stars);
        const user = FIREBASE_AUTH.currentUser;
        if (user) {
          const user_id = user.uid;
          const ref = doc(FIRESTORE_DB, "user_data", user_id);
          const docSnap = await getDoc(ref);
          const docData = docSnap.data();
          let i = 0;

          if (currentRouteLocation && docData) {
            let i = currentRouteLocation.id;
            let currentID = docData[i];
            if (currentID) {
              setDoc(
                doc(FIRESTORE_DB, "user_data", user_id),
                {
                  [flattenedRouteData[i - 1].id]: {
                    stars: stars,
                  },
                },
                { merge: true }
              );
            }
            let scenarioID = docData[i + 1];
            if (scenarioID) {
              setDoc(
                doc(FIRESTORE_DB, "user_data", user_id),
                {
                  [flattenedRouteData[i].id]: {
                    name: flattenedRouteData[i].title,
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
          <View style={[styles.modalView, darkMode && styles.darkModalView]}>
            <Text style={styles.score}>You got {averageScore / 30} stars!</Text>
            <Pressable
              onPress={() => setVisible(false)}
              style={[styles.closeButton, darkMode && styles.darkCloseButton]}
            >
              <Text
                style={[styles.buttonText, darkMode && styles.darkButtonText]}
              >
                Review Lesson
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <ImageBackground
        source={require("../../../assets/insideRestaurant.png")}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <Pressable onPress={() => navigation.replace("Route")}>
          <Image
            style={styles.backButtonIcon}
            source={require("../../../assets/backArrow.png")}
          />
        </Pressable>
      </ImageBackground>
      <View style={[styles.overlay, darkMode && styles.darkOverlay]}>
        {!loading ? ( //view encasing what displays once page and translation loads
          <View>
            <Text style={[styles.question, darkMode && styles.darkQuestion]}>
              {dialogue[currentquestionindex].question}
            </Text>
            {dialogue[currentquestionindex].options.map((option, index) => (
              //<View style={styles.option}>
              <Pressable key={index} onPress={() => checkAnswer(option)}>
                <Text
                  style={[
                    styles.option,
                    option === dialogue[currentquestionindex].correctAnswer &&
                    isCorrect
                      ? [
                          styles.correctAnswer,
                          darkMode && styles.darkCorrectAnswer,
                        ]
                      : [styles.option, darkMode && styles.darkOption],
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
              //</View>
            ))}
          </View>
        ) : (
          <Text>LOADING</Text>
        )}

        <Pressable
          onPress={() => {
            AudioManager.playButtonSound();
            nextQuestion();
          }}
          style={[styles.nextButton, darkMode && styles.darkNextButton]}
        >
          <Text style={[styles.buttonText, darkMode && styles.darkButtonText]}>
            Next Question
          </Text>
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

  //---------------
  darkOverlay: {
    paddingVertical: 50,
    backgroundColor: "darkgreen",
    color: "rgb(241, 236, 215)",
    position: "absolute",
    bottom: 0,
    height: "50%",
    width: "100%",
    justifyContent: "center",
    borderColor: "rgb(241, 236, 215)",
    borderWidth: 5,
    borderRadius: 25,
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
  //----------------

  imageBackground: {
    width: "100%",
    height: "75%",
    resizeMode: "cover",
  },

  //----------------
  darkQuestion: {
    color: "rgb(241, 236, 215)",
    padding: 15,
    marginBottom: 4,
    marginTop: 6,
    fontSize: 25,
  },
  question: {
    color: "white",
    padding: 15,
    marginBottom: 4,
    marginTop: 6,
    fontSize: 25,
  },
  //-----------------

  //-----------------
  darkOption: {
    color: "rgb(241, 236, 215)",
    borderColor: "rgb(241, 236, 215)",
    borderBlockColor: "rgb(241, 236, 215)",
    borderWidth: 3,
    borderRadius: 5,
    marginVertical: 4,
    marginHorizontal: 5,
    fontSize: 20,
    paddingLeft: 10,
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
  //-----------------

  //-----------------
  darkCorrectAnswer: {
    borderWidth: 3,
    borderRadius: 5,
    marginVertical: 4,
    marginHorizontal: 5,
    backgroundColor: "green",
    color: "rgb(241, 236, 215)",
  },
  correctAnswer: {
    borderWidth: 3,
    borderRadius: 5,
    marginVertical: 4,
    marginHorizontal: 5,
    backgroundColor: "chartreuse",
    color: "white",
  },
  //--------------------

  //--------------------
  darkNextButton: {
    padding: 10,
    backgroundColor: "darkred",
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
    borderColor: "rgb(241, 236, 215)",
    borderWidth: 3,
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
  //-------------------

  //-------------------
  darkButtonText: {
    color: "rgb(241, 236, 215)",
    fontSize: 18,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  //-------------------

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

  //-------------------
  darkModalView: {
    width: "80%",
    padding: 20,
    backgroundColor: "rgb(241, 236, 215)",
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
  //-----------------

  //-----------------
  darkCloseButton: {
    marginTop: 20,
    backgroundColor: "darkred",
    padding: 10,
    borderRadius: 5,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  //----------------

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

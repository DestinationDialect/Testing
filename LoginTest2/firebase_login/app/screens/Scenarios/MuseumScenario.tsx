import { Image, StyleSheet, Modal, Platform } from "react-native";
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
import styles from "../Styles";
import FeatherIcon from "react-native-vector-icons/Feather";
//import speaker from "../../../assets/speaker.png";
interface Language {
  name: string;
  tag: string;
}

const languages: { [key: string]: Language } = {};
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
    question: "Hello, welcome to the museum. How may I help you today?",
    options: [
      "Hello.",
      "Hello, do you offer guided tours?",
      "Hello, where do I start?",
    ],
    correctAnswer: "Hello, do you offer guided tours?",
  },
  {
    question: "Yes we do. Our tours last about 90 minutes.",
    options: [
      "Ok, what does the tour cover?",
      "How long is it?",
      "Ok, how do I do that?",
    ],
    correctAnswer: "Ok, what does the tour cover?",
  },
  {
    question:
      "The tour covers the major highlights of the museum. Does that sound like something you would want to do?",
    options: [
      "I'll have to think about it.",
      "Yes but how long is it?",
      "Yes it does, sign me up!",
    ],
    correctAnswer: "Yes it does, sign me up!",
  },
  {
    question:
      "Ok, you can join that group over there and the tour will begin shortly.",
    options: [
      "Ok, thank you!",
      "I don't want to.",
      "Thanks but I don't like people.",
    ],
    correctAnswer: "Ok, thank you!",
  },
  {
    question:
      "Ok, everyone follow me. We're going to start the tour in our Ancient Egyptian exhibit.",
    options: ["Can I touch any of this stuff?", "Let's go!", "Awesome!"],
    correctAnswer: "Let's go!",
  },
  {
    question:
      "Here we have a statue of Pharaoh Ramesses II, one of Egypt's most powerful rulers. Ramesses II was known for his military campaigns and for commissioning grand monuments like this one.",
    options: [
      "How did they transport something this big back then?",
      "Can I touch it?",
      "Can I take pictures in here?",
    ],
    correctAnswer: "How did they transport something this big back then?",
  },
  {
    question:
      "Great question! Ancient Egyptians were brilliant engineers. They used wooden sledges and rolled them over logs or poured water on the sand to make transportation easier.",
    options: ["Thank you! That is very insightful.", "Cool!", "Awesome!"],
    correctAnswer: "Thank you! That is very insightful.",
  },
  {
    question:
      "Ok everyone, let's move onto the next section, our Renaissance painting exhibit!",
    options: [
      "Can I take pictures of these?",
      "Wow, this painting looks so detailed! What is the story behind it?",
      "These paintings are weird.",
    ],
    correctAnswer:
      "Wow, this painting looks so detailed! What is the story behind it?",
  },
  {
    question:
      "This is one of the few surviving portraits by Leonardo da Vinci, painted around 1474-1478.",
    options: [
      "It is so pretty!",
      "Why does it look like that?",
      "Can I take a picture of it?",
    ],
    correctAnswer: "It is so pretty!",
  },
  {
    question: "Ok everyone, this concludes our tour. Thank you all for coming!",
    options: [
      "Thanks, bye!",
      "This was so cool!",
      "Thank you! You were a great tour guide!",
    ],
    correctAnswer: "Thank you! You were a great tour guide!",
  },
];

export default function MuseumScenario() {
  const [currentquestionindex, setcurrentquestionindex] = useState(0);
  const [selectedOption, setselectedOption] = useState("");
  const [isCorrect, setisCorrect] = useState(false);
  const navigation = useNavigation<ScenarioNavigationProp>();
  const { darkMode } = useTheme(); // Get Dark Mode from context

  const name = "MuseumScenario";
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
    Speech.speak(text, {
      language: languages[learningLanguage].tag,
    });
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
      await AsyncStorage.setItem("museumVocabulary", jsonVocab);
      console.log("vocab stored: ");
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const user_id = user.uid;
        await setDoc(
          doc(FIRESTORE_DB, "user_vocab_notebook", user_id),
          {
            MuseumScenario: { title: "museumVocabulary", vocab: jsonVocab },
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
        updateRoute(5);
        const averageScore =
          scores.length > 0
            ? Math.round(
                scores.reduce((sum, score) => sum + score, 0) / scores.length
              )
            : 0;
        const stars = averageScore / 30;
        updateStars(4, stars);
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
    <SafeAreaView style={museumStyles.container}>
      <Modal visible={isVisible} transparent={true}>
        <View style={museumStyles.modalOverlay}>
          <View
            style={[
              museumStyles.modalView,
              darkMode && museumStyles.darkModalView,
            ]}
          >
            <Text style={museumStyles.score}>
              You got {averageScore / 30} stars!
            </Text>
            <Pressable
              onPress={() => setVisible(false)}
              style={[
                museumStyles.closeButton,
                darkMode && museumStyles.darkCloseButton,
              ]}
            >
              <Text
                style={[
                  museumStyles.buttonText,
                  darkMode && museumStyles.darkButtonText,
                ]}
              >
                Review Lesson
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <ImageBackground
        source={require("../../../assets/InsideMuseum.jpg")}
        style={museumStyles.imageBackground}
        resizeMode="cover"
      >
        <Pressable onPress={() => navigation.replace("Route")}>
          <Image
            style={museumStyles.backButtonIcon}
            source={require("../../../assets/backArrow.png")}
          />
        </Pressable>
      </ImageBackground>
      <View
        style={[museumStyles.overlay, darkMode && museumStyles.darkOverlay]}
      >
        {!loading ? ( //view encasing what displays once page and translation loads
          <View>
            <View style={museumStyles.questionContainer}>
              <Pressable
                onPress={() => speak(dialogue[currentquestionindex].question)}
              >
                <FeatherIcon
                  style={[
                    museumStyles.featherIcon,
                    darkMode && museumStyles.darkFeatherIcon,
                  ]}
                  name="volume-2"
                  size={22}
                />
              </Pressable>
              <Text
                style={[
                  museumStyles.question,
                  darkMode && museumStyles.darkQuestion,
                ]}
              >
                {dialogue[currentquestionindex].question}
              </Text>
            </View>
            {dialogue[currentquestionindex].options.map((option, index) => (
              <View key={index} style={museumStyles.optionContainer}>
                <Pressable
                  onPress={() =>
                    speak(dialogue[currentquestionindex].options[index])
                  }
                >
                  <FeatherIcon
                    style={[
                      museumStyles.featherIcon,
                      darkMode && museumStyles.darkFeatherIcon,
                    ]}
                    name="volume-2"
                    size={22}
                  />
                </Pressable>
                <Pressable
                  onPress={() => checkAnswer(option)}
                  style={museumStyles.optionButton}
                >
                  <Text
                    style={[
                      museumStyles.option,
                      option === dialogue[currentquestionindex].correctAnswer &&
                      isCorrect
                        ? [
                            museumStyles.correctAnswer,
                            darkMode && museumStyles.darkCorrectAnswer,
                          ]
                        : [
                            museumStyles.option,
                            darkMode && museumStyles.darkOption,
                          ],
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              </View>
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
          style={[
            museumStyles.nextButton,
            darkMode && museumStyles.darkNextButton,
          ]}
        >
          <Text style={museumStyles.buttonText}>Next Question</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export const museumStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
  },

  questionContainer: {
    flexDirection: "row", // Ensures the speaker and text are in a row
    alignItems: "center", // Centers the speaker button and text vertically
    marginBottom: 5, // Adds spacing below the question
  },

  optionContainer: {
    flexDirection: "row", // Align elements in a row
    alignItems: "center", // Center vertically
    justifyContent: "space-between",
    marginVertical: 5, // Add spacing
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
  darkFeatherIcon: {
    color: "rgb(241, 236, 215)",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  featherIcon: {
    color: "white",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  //----------------

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
    paddingHorizontal: 10,
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
    paddingHorizontal: 10,
  },
  //-----------------

  optionButton: {
    flex: 1,
  },

  //-----------------
  darkCorrectAnswer: {
    borderWidth: 3,
    borderRadius: 5,
    marginVertical: 4,
    marginHorizontal: 5,
    backgroundColor: "green",
    color: "rgb(241, 236, 215)",
    paddingHorizontal: 10,
  },
  correctAnswer: {
    borderWidth: 3,
    borderRadius: 5,
    marginVertical: 4,
    marginHorizontal: 5,
    backgroundColor: "chartreuse",
    color: "white",
    paddingHorizontal: 10,
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

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

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

const QUESTIONS: Question[] = [
  {
    question:
      "Produce vendor: Good morning! Welcome to the farmers market. Let me know if you need any help!",
    options: [
      "Are these tomatoes?",
      "Good morning! Your produce looks amazing. Are these tomatoes organic?",
      "Do you have any bread?",
    ],
    correctAnswer:
      "Good morning! Your produce looks amazing. Are these tomatoes organic?",
  },
  {
    question: "Yes, they are! We grow them without any pesticides.",
    options: [
      "Nice! I'll take half a kilogram, please.",
      "I don't like organic produce.",
      "Can I buy just one?",
    ],
    correctAnswer: "Nice! I'll take half a kilogram, please.",
  },
  {
    question: "Great! That will be 4 please. Anything else for you?",
    options: [
      "Actually, I don't think I want these anymore.",
      "Thank you!",
      "This is it for now, thank you!",
    ],
    correctAnswer: "This is it for now, thank you!",
  },
  {
    question:
      "Vendor: Hi! Would you like to try a sample of our wildflower honey?",
    options: [
      "That sounds gross.",
      "I guess.",
      "Absolutely! That sounds great!",
    ],
    correctAnswer: "Absolutely! That sounds great!",
  },
  {
    question:
      "Here you go. Our wildflower honey has a rich and complex flavor.",
    options: [
      "I don't think I like it.",
      "It tastes great! How much for a small jar?",
      "It's ok.",
    ],
    correctAnswer: "It tastes great! How much for a small jar?",
  },
  {
    question:
      "Our small jar is 10, and I'll throw in a sample jar of our clover honey.",
    options: [
      "Thank you! I appreciate it!",
      "I don't want to pay extra.",
      "Do you have any other samples?",
    ],
    correctAnswer: "Thank you! I appreciate it!",
  },
  {
    question:
      "Bakery Vendor: Welcome in! We have some fresh-baked bread, croissants, and some homemade pies today. Can I interest you in anything?",
    options: [
      "I love bread!",
      "What kind of pies do you have?",
      "How many pies do you have?",
    ],
    correctAnswer: "What kind of pies do you have?",
  },
  {
    question: "We have apple, cherry, and pumpkin.",
    options: [
      "Do you have pumpkin?",
      "I'll take an apple pie.",
      "Nevermind. Thanks anyways!",
    ],
    correctAnswer: "I'll take an apple pie.",
  },
  {
    question:
      "Craft vendor: Hi there! Everything here is handmade, from pottery to candles and jewelry. Let me know if you have any questions!",
    options: [
      "None of these are my style.",
      "I love pottery!",
      "These earrings are beautiful! I'll take these!",
    ],
    correctAnswer: "These earrings are beautiful! I'll take these!",
  },
  {
    question: "Great choice! That will be 12.",
    options: [
      "Thank you! Have a good day!",
      "That's expensive!",
      "Here you go, thank you!",
    ],
    correctAnswer: "Here you go, thank you!",
  },
];

export default function FarmersMarketScenario() {
  const [currentquestionindex, setcurrentquestionindex] = useState(0);
  const [selectedOption, setselectedOption] = useState("");
  const [isCorrect, setisCorrect] = useState(false);
  const navigation = useNavigation();

  const name = "FarmersMarketScenario";
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
      await AsyncStorage.setItem("farmerVocabulary", jsonVocab);
      console.log("vocab stored: ");
      const user = FIREBASE_AUTH.currentUser;
          if (user) {
            const user_id = user.uid;
            await setDoc(doc(FIRESTORE_DB, "user_vocab_notebook", user_id), {
              FarmersMarketScenario: {title: 'farmerVocabulary', vocab: jsonVocab}
            },
            { merge: true }); 
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
            let currentID = docData[i];
            if(currentID){
              setDoc(
                doc(FIRESTORE_DB, "user_data", user_id),
                {
                  [flattenedRouteData[i-1].id]: {
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
        source={require("../../../assets/FarmersMarket.png")}
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
        {!loading ? ( //view encasing what displays once page and translation loads
          <View>
            <Text style={styles.question}>
              {dialogue[currentquestionindex].question}
            </Text>
            {dialogue[currentquestionindex].options.map((option, index) => (
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
          </View>
        ) : (
          <Text>LOADING</Text>
        )}

        <Pressable onPress={nextQuestion} style={styles.nextButton}>
          <Text style={styles.buttonText}>Next Question</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
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

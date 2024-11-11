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

const QUESTIONS = [
  {
    question: "What does juevos mean?",
    options: ["egg", "sun", "dog", "house"],
    correctAnswer: "egg",
  },
  {
    question: "¡Hola! Buenas tardes. ¿Cómo estás?",
    options: [
      "¡Hola! Buenas tardes. Estoy bien, gracias. ¿Y tú?",
      "¡Hola! ¿Qué tal? Estoy mal.",
      " ¡Hola! No sé, ¿cómo estás tú?",
    ],
    correctAnswer: "¡Hola! Buenas tardes. Estoy bien, gracias. ¿Y tú?",
  },
  {
    question:
      "Estoy bien, gracias. Bienvenido a nuestro restaurante. ¿Es tu primera vez aquí?",
    options: [
      " No, ya he venido antes. Me gusta mucho este lugar.",
      "Sí, es mi primera vez.",
      " No, ya he estado en otro restaurante.",
    ],
    correctAnswer: "Sí, es mi primera vez.",
  },
  {
    question:
      "¡Qué bueno! ¿Ya sabes qué vas a pedir o te gustaría ver el menú?",
    options: [
      "Me gustaría ver el menú, por favor.",
      "Ya sé qué quiero, traeme lo que siempre pido.",
      "No, gracias, ya no quiero nada.",
    ],
    correctAnswer: "Me gustaría ver el menú, por favor.",
  },
  {
    question:
      "Claro, aquí tienes el menú. ¿Te gustaría algo de beber mientras decides?",
    options: [
      "Sí, por favor. ¿Tienen jugo de naranja?",
      "No, solo quiero agua.",
      "No sé, ¿qué tienes para beber?",
    ],
    correctAnswer: "Sí, por favor. ¿Tienen jugo de naranja?",
  },
  {
    question:
      "Sí, tenemos jugo de naranja fresco. ¿Te gustaría un vaso grande o pequeño?",
    options: [
      " Un vaso grande, por favor.",
      "Un vaso pequeño, gracias.",
      "No quiero jugo, solo agua está bien.",
    ],
    correctAnswer: "Un vaso grande, por favor.",
  },
  {
    question: "Perfecto. ¿Deseas algo más?",
    options: [
      "No, eso está bien.",
      "Sí, también quiero una sopa.",
      "No, no quiero más comida.",
    ],
    correctAnswer: "No, eso está bien.",
  },
  {
    question:
      "Perfecto. Entonces, un jugo de naranja grande y unos tacos de carne asada. ¿Algo más para acompañar?",
    options: [
      "No, está perfecto así.",
      "Sí, quiero una bebida alcohólica también.",
      "No, solo eso.",
    ],
    correctAnswer: "No, está perfecto así.",
  },
  {
    question:
      "Aquí están tus tacos de carne asada y tu jugo de naranja. ¡Buen provecho!",
    options: [
      " ¡Gracias! Se ve delicioso.",
      "¡Gracias! Pero esto no es lo que pedí.",
      "No me gusta mucho, pero gracias.",
    ],
    correctAnswer: "¡Gracias! Se ve delicioso.",
  },
  {
    question:
      "¡Qué bueno que te guste! Si necesitas algo más, no dudes en pedírmelo.",
    options: [
      "Claro, gracias.",
      "Sí, quiero más salsa, por favor.",
      "No, no necesito nada más.",
    ],
    correctAnswer: "Claro, gracias.",
  },
];

export default function RestaurantScenario() {
  const [currentquestionindex, setcurrentquestionindex] = useState(0);
  const [selectedOption, setselectedOption] = useState("");
  const [isCorrect, setisCorrect] = useState(false);

  const name = "RestaurantScenario";
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
                    stars: 0,
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
});

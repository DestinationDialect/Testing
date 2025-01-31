import {
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  View,
  FlatList,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";



type Question = {
  question: string;
  answerChoices: string[];
  correctAnswer: string;
};

const airportQuestions: Question[] = [
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

import styles from "../Styles";

const AirportScenario = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require("../../../assets/airport.png")}
      resizeMode="cover"
      style={styles.imgBackground}
    >
      <Pressable onPress={() => navigation.goBack()}>
          <Image
            style={styles.backButtonIcon}
            source={require("../../../assets/backArrow.png")}
          />
        </Pressable>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <View style={styles.scenarioTextContainer}>
          <Text style={styles.scenarioText}>
            {airportQuestions[0].question}
          </Text>
          <FlatList
            data={airportQuestions}
            renderItem={({ item }) => (
              <Text style={styles.scenarioText}>
                {airportQuestions[0].answerChoices}
              </Text>
            )}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

export default AirportScenario;

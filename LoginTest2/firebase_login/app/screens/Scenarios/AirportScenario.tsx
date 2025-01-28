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
import * as Speech from "expo-speech";

type Question = {
  question: string;
  answerChoices: string[];
  correctAnswer: string;
};

const airportQuestions: Question[] = [
  {
    question: "Hello! Where are you going?",
    answerChoices: ["your mom", "my house", "a new country"],
    correctAnswer: "a new country",
  },
];

import styles from "../Styles";

const AirportScenario = () => {
  const navigation = useNavigation();

  const speak = (text: string) => {
    Speech.speak(text);
  };

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

import {
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  View,
  FlatList,
} from "react-native";

type Question = {
  question: string;
  answerChoices: string[];
  correctAnswer: string;
};

const airportQuestions: Question[] = [
  {
    question: "Hola, bienvenida! adonde vas?",
    answerChoices: ["tu madre", "mi casa", "un nuevo pais"],
    correctAnswer: "un nuevo pais",
  },
];

import styles from "./Styles";

const airportScenario = () => {
  return (
    <ImageBackground
      source={require("../../assets/images/airport.png")}
      resizeMode="cover"
      style={styles.imgBackground}
    >
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

export default airportScenario;

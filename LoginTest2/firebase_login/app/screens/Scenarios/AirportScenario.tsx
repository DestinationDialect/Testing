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
    question: "Hola, bienvenida! adonde vas?",
    answerChoices: ["tu madre", "mi casa", "un nuevo pais"],
    correctAnswer: "un nuevo pais",
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

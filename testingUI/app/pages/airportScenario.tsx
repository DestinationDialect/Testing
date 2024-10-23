import {
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  View,
  FlatList,
} from "react-native";

import { airportQuestions } from "./airportQuestion";

import styles from "../styles";

export default function airportScenario() {
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
}

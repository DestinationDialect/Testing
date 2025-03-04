import {
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  View,
  TextInput,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useRef } from "react";
import FlashcardList from "./FlashcardList";
// import { SafeAreaView } from "react-native-safe-area-context";
// import './FlashStyles.tsx';
import styles from "../Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Flashcards = () => {
  const navigation = useNavigation();
  const [flashcards, setFlashcards] = useState([]); // stores flashcard set in use
  const [numQuestions, setNumQuestions] = useState("5"); // stores number of flashcards to generate
  const [modalVisible, setModalVisible] = useState(false); // controls topic selection modal visibility
  const [availableScenarios, setAvailableScenarios] = useState([]); // stores which scenarios vocab is unlocked
  const [availablePersonal, setAvailablePersonal] = useState([]); // stores available personal vocab sets
  const [topic, setTopic] = useState("Airport"); // stores topic of flashcards selected by user

  // stores vocab from scenarios
  const [airportVocabulary, setAirportVocabulary] = useState([{}]);
  const [restaurantVocabulary, setRestaurantVocabulary] = useState([{}]);
  const [hotelVocabulary, setHotelVocabulary] = useState([{}]);
  const [museumVocabulary, setMuseumVocabulary] = useState([{}]);
  const [zooVocabulary, setZooVocabulary] = useState([{}]);
  const [farmerVocabulary, setFarmerVocabulary] = useState([{}]);
  const [hospitalVocabulary, setHospitalVocabulary] = useState([{}]);

  // stores vocab from personal translations
  const [personalVocab, setPersonalVocab] = useState([{}]);

  function handleTopic() {
    if (topic == "Airport") {
      return airportVocabulary;
    } else if (topic == "Restaurant") {
      return restaurantVocabulary;
    } else if (topic == "Hotel") {
      return hotelVocabulary;
    } else if (topic == "Museum") {
      return museumVocabulary;
    } else if (topic == "Zoo") {
      return zooVocabulary;
    } else if (topic == "Farmer's Market") {
      return farmerVocabulary;
    } else if (topic == "Hospital") {
      return hospitalVocabulary;
    } else if (topic == "Personal") {
      return personalVocab;
    }
  }

  function handleGenerate() {
    const num = parseInt(numQuestions, 10) || 1; // Ensure it's a valid number
    const flashcardSet = handleTopic(); // stores flashcards from selected topic
    const shuffled = [...flashcardSet].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled.slice(0, Math.min(num, flashcardSet.length))); // Ensure it doesn't exceed the total number
  }

  // format vocab from async storage into format flashcard interface works with
  function formatVocab(vocabList) {
    let formattedVocab = [];
    let i = 1;
    for (let item of vocabList) {
      formattedVocab.push({
        id: i,
        question: item.learnedText,
        answer: item.translation,
      });
      i += 1;
    }
    return formattedVocab;
  }

  useEffect(() => {
    let storedScenarios = [];
    let storedPersonal = [];
    // function to get each vocab set
    const getVocab = async (itemName) => {
      try {
        const vocabJSON = await AsyncStorage.getItem(itemName);
        if (vocabJSON != null) {
          const vocab = JSON.parse(vocabJSON);
          const formattedVocab = formatVocab(vocab);
          return formattedVocab;
        }
      } catch (error) {
        console.error(`Error retrieving ${itemName} vocabulary: `, error);
      }
    };
    // fetching vocab for each scenario and personal set
    const fetchVocab = async () => {
      // personal
      const personal = await getVocab("personalVocab");
      if (personal) {
        setPersonalVocab(personal);
        storedPersonal.push("Personal");
      }
      // scenarios
      const airportvocab = await getVocab("airportVocabulary");
      if (airportvocab) {
        setAirportVocabulary(airportvocab);
        storedScenarios.push("Airport");
      }
      const restaurantvocab = await getVocab("restaurantVocabulary");
      if (restaurantvocab) {
        setRestaurantVocabulary(restaurantvocab);
        storedScenarios.push("Restaurant");
      }
      const hotelvocab = await getVocab("hotelVocabulary");
      if (hotelvocab) {
        setHotelVocabulary(hotelvocab);
        storedScenarios.push("Hotel");
      }
      const museumvocab = await getVocab("museumVocabulary");
      if (museumvocab) {
        setMuseumVocabulary(museumvocab);
        storedScenarios.push("Museum");
      }
      const zoovocab = await getVocab("zooVocabulary");
      if (zoovocab) {
        setZooVocabulary(zoovocab);
        storedScenarios.push("Zoo");
      }
      const farmervocab = await getVocab("farmerVocabulary");
      if (farmervocab) {
        setFarmerVocabulary(farmervocab);
        storedScenarios.push("Farmer's Market");
      }
      const hospitalvocab = await getVocab("hospitalVocabulary");
      if (hospitalvocab) {
        setHospitalVocabulary(hospitalvocab);
        storedScenarios.push("Hospital");
      }
      setAvailableScenarios(storedScenarios);
      setAvailablePersonal(storedPersonal);
    };
    fetchVocab();
  }, []);

  return (
    <SafeAreaView style={flashcardStyles.container}>
      <ImageBackground
        source={require("../../../assets/homeScreen.png")}
        resizeMode="cover"
        style={flashcardStyles.imgBackground}
      >
        <Pressable onPress={() => navigation.goBack()}>
          <Image
            style={flashcardStyles.backButtonIcon}
            source={require("../../../assets/backArrow.png")}
          />
        </Pressable>
        <View style={flashcardStyles.header}>
          <Text style={flashcardStyles.label}>Number of Questions</Text>
          <TextInput
            style={flashcardStyles.input}
            keyboardType="numeric"
            value={numQuestions}
            onChangeText={setNumQuestions}
          />
          <Pressable
            onPress={() => setModalVisible(true)}
            style={flashcardStyles.input}
          >
            <Text style={{ color: "white" }}>{"Select Topic" || topic}</Text>
          </Pressable>
          <TouchableOpacity
            style={flashcardStyles.button}
            onPress={handleGenerate}
          >
            <Text style={flashcardStyles.buttonText}>Generate</Text>
          </TouchableOpacity>
        </View>

        <View style={flashcardStyles.container}>
          {flashcards.length > 0 ? (
            <FlashcardList flashcards={flashcards} />
          ) : (
            <Text style={flashcardStyles.emptyText}>
              No flashcards available.
            </Text>
          )}
        </View>
        <Modal visible={modalVisible} transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Select your flashcard topic</Text>
              <View style={styles.modalLanguages}>
                <View style={styles.modalLanguage}>
                  <Text>Scenario Vocabulary:</Text>
                  {availableScenarios.map((scenario, index) => (
                    <Pressable
                      key={index}
                      style={
                        scenario === topic
                          ? styles.selectedModalLanguageButton
                          : styles.modalLanguageButton
                      }
                      onPress={() => setTopic(scenario)}
                    >
                      <Text>{scenario}</Text>
                    </Pressable>
                  ))}
                </View>
                <View style={styles.modalLanguage}>
                  <Text>Personal Vocabulary:</Text>
                  {availablePersonal.map((vocab, index) => (
                    <Pressable
                      key={index}
                      style={
                        vocab === topic
                          ? styles.selectedModalLanguageButton
                          : styles.modalLanguageButton
                      }
                      onPress={() => setTopic(vocab)}
                    >
                      <Text>{vocab}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={styles.continueButton}
              >
                <Text>Confirm</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
};

const FLASHCARDS = [
  {
    id: 1,
    question: "What is the air speed velocity of an unladen swallow?",
    answer: "Is that an African or European swallow?",
    //options: ["Is that an African or European swallow?", "Yellow", "I mean Blue", "Sir Lancelot of Camelot"]
  },
  {
    id: 2,
    question: "Hasta pronto",
    answer: "See you soon",
    //options: ["Hello", "Goodbye", "See you soon", "See you later"]
  },
  {
    id: 3,
    question: "Adios",
    answer: "Hello",
    //options: ["Hello", "Goodbye", "See you soon", "See you later"]
  },
  {
    id: 4,
    question: "Hola",
    answer: "Hello",
    //options: ["Hello", "Goodbye", "See you soon", "See you later"]
  },
  {
    id: 5,
    question: "Pollo",
    answer: "Chicken",
    //options: ["Dog", "Chicken", "Cat", "Mouse"]
  },
  {
    id: 6,
    question: "Gato",
    answer: "Cat",
    //options: ["Dog", "Chicken", "Cat", "Mouse"]
  },
  {
    id: 7,
    question: "Raton",
    answer: "Mouse",
    //options: ["Dog", "Chicken", "Cat", "Mouse"]
  },
  {
    id: 8,
    question: "Perro",
    answer: "Dog",
    //options: ["Dog", "Chicken", "Cat", "Mouse"]
  },
  {
    id: 9,
    question: "Por favor",
    answer: "Please",
    //options: ["Please", "Yes", "Thank you", "No"]
  },
  {
    id: 10,
    question: "No",
    answer: "No",
    //options: ["Please", "Yes", "Thank you", "No"]
  },
  {
    id: 11,
    question: "Si",
    answer: "Yes",
    //options: ["Please", "Yes", "Thank you", "No"]
  },
  {
    id: 12,
    question: "Gracias",
    answer: "Thank you",
    //options: ["Please", "Yes", "Thank you", "No"]
  },
  {
    id: 13,
    question: "Hasta Luego",
    answer: "See you later",
    //options: ["Hello", "Goodbye", "See you soon", "See you later"]
  },
];

const flashcardStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imgBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  // backButton: {
  //   position: "absolute",
  //   top: 20,
  //   left: 20
  // },
  backButtonIcon: {
    margin: 20,
    height: 30,
    width: 30,
  },
  header: {
    padding: 10,
    alignItems: "center",
  },
  label: {
    fontSize: 20,
    color: "black",
  },
  input: {
    borderWidth: 2,
    borderColor: "white",
    padding: 10,
    width: 100,
    textAlign: "center",
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "green",
    color: "white",
  },
  button: {
    backgroundColor: "rgb(0, 150, 255)",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Flashcards;

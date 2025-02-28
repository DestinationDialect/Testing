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
  import { useNavigation, } from "@react-navigation/native";
  import React, { useState, useEffect, useRef } from 'react';
  import FlashcardList from './FlashcardList';
  import { useTheme } from "../ThemeContext";
  import styles from "../Styles";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  
  const Flashcards = () => {
    const navigation = useNavigation();
    const [flashcards, setFlashcards] = useState([])
    const [numQuestions, setNumQuestions] = useState("5");
    const { darkMode } = useTheme(); // Get Dark Mode from context
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
      const shuffled = [...FLASHCARDS].sort(() => Math.random() - 0.5);
      setFlashcards(shuffled.slice(0, Math.min(num, FLASHCARDS.length))); // Ensure it doesn't exceed the total number
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
      <SafeAreaView style={flashStyles.container}> 
        <ImageBackground
          source={
            darkMode
              ? require("../../../assets/DarkModeBackground.jpg") // Dark mode image
              : require("../../../assets/homeScreen.png") // Light mode image
          }
          resizeMode="cover"
          style={styles.imgBackground}
        >
          <Pressable onPress={() => navigation.goBack()}>
            <Image
              style={flashStyles.backButtonIcon}
              source={
                darkMode
                  ? require("../../../assets/whiteBackArrow.png")
                  : require("../../../assets/backArrow.png")
              }
            />
          </Pressable>
        <View style={flashStyles.header}>
          <Text style={[flashStyles.label, darkMode && flashStyles.darkLabel]}>Number of Questions</Text>
          <TextInput
            style={[flashStyles.input, darkMode && flashStyles.darkInput]}
            keyboardType="numeric"
            value={numQuestions}
            onChangeText={setNumQuestions}
          />
          <Pressable
            onPress={() => setModalVisible(true)}
            style={[flashStyles.input, darkMode && flashStyles.darkInput]}
          >
            <Text style={[flashStyles.selectTopicButton, darkMode && flashStyles.darkSelectTopicButton]}>Select Topic</Text>
          </Pressable>
          <TouchableOpacity style={flashStyles.button} onPress={handleGenerate}>
            <Text style={[flashStyles.buttonText, darkMode && flashStyles.darkButtonText]}>Generate</Text>
          </TouchableOpacity>
        </View>

        <View style={flashStyles.container}>
        {flashcards.length > 0 ? (
          <FlashcardList flashcards={flashcards} />
        ) : (
          <Text style={[flashStyles.emptyText, darkMode && flashStyles.darkEmptyText]}>No flashcards yet.</Text>
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
                style={[flashStyles.continueButton, darkMode && flashStyles.darkContinueButton]}
              >
                <Text style={[flashStyles.buttonText, darkMode && flashStyles.darkButtonText]}>Confirm</Text>
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
      question: "Hasta pronto",
      answer: "See you soon",
    },
    {
      id: 2,
      question: "Adios",
      answer: "Hello",
    },
    {
      id: 3,
      question: "Hola",
      answer: "Hello",
    },
    {
      id: 4,
      question: "Pollo",
      answer: "Chicken",
    },
    {
      id: 5,
      question: "Gato",
      answer: "Cat",
    },
    {
      id: 6,
      question: "Raton",
      answer: "Mouse",
    },
    {
      id: 7,
      question: "Perro",
      answer: "Dog",
    },
    {
      id: 8,
      question: "Por favor",
      answer: "Please",
    },
    {
      id: 9,
      question: "No",
      answer: "No",
    },
    {
      id: 10,
      question: "Si",
      answer: "Yes",
    },
    {
      id: 11,
      question: "Gracias",
      answer: "Thank you",
    },
    {
      id: 12,
      question: "Hasta Luego",
      answer: "See you later",
    },
  ];

  const flashStyles = StyleSheet.create({
    container: {
      flex: 1,
    }, 
    imgBackground: { 
      flex: 1,
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    backButtonIcon: { 
      margin: 20,
      height: 30,
      width: 30,
    },
    header: { 
      padding: 10, 
      alignItems: "center" 
    },

    //--------------
    darkLabel: {
      fontSize: 20, 
      color: "rgb(241, 236, 215)",
    },
    label: { 
      fontSize: 20, 
      color: "black",
    },
    //---------------

    //---------------
    darkInput: {
      borderWidth: 2, 
      borderColor: "rgb(241, 236, 215)", 
      padding: 10, 
      width: 100, 
      textAlign: "center", 
      borderRadius: 5, 
      marginBottom: 10,
      backgroundColor: "darkgreen",
      color: "rgb(241, 236, 215)",
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
    //-----------------

    button: { 
      backgroundColor: "blue", 
      padding: 10, 
      borderRadius: 5 
    },

    //-----------------
    darkSelectTopicButton: {
      color: "rgb(241, 236, 215)",
    },
    selectTopicButton: {
      color: "white",
    },
    //-----------------

    //-----------------
    darkContinueButton: {
      backgroundColor: "darkgreen", 
      padding: 10, 
      borderRadius: 5 
    },
    continueButton: {
      backgroundColor: "green", 
      padding: 10, 
      borderRadius: 5 
    },
    //-----------------

    //-----------------
    darkButtonText: {
      color: "rgb(241, 236, 215)", 
      fontWeight: "bold" 
    },
    buttonText: { 
      color: "white", 
      fontWeight: "bold" 
    },
    //-----------------

    //-----------------
    emptyText: {
      color: "black",
      fontSize: 15,
    },
    darkEmptyText: {
      color: "rgb(241, 236, 215)",
      fontSize: 15,
    },
    //-----------------
  });
  
export default Flashcards;
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
    FlatList,
  } from "react-native";
  import { useNavigation, } from "@react-navigation/native";
  import React, { useState, useEffect } from 'react';
  import Flashcard from "./Flashcard";
  import FlashcardList from './FlashcardList';
  import { useTheme } from "../ThemeContext";
  import styles from "../Styles";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import AudioManager from "../AudioManager";
  import FeatherIcon from "react-native-vector-icons/Feather";
  
  const Flashcards = () => {
    const navigation = useNavigation();
    const [flashcards, setFlashcards] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0); 
    const [viewMode, setViewMode] = useState("list"); 
    const [numQuestions, setNumQuestions] = useState("10");
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
      const num = parseInt(numQuestions, 10) || 1; // Ensure valid number
      const flashcardSet = handleTopic(); // Get flashcards from selected topic
    
      if (!flashcardSet || flashcardSet.length === 0) {
        console.error("No flashcards found for topic:", topic);
        setFlashcards([]); // Reset flashcards if none are found
        setCurrentIndex(0); // Reset index to prevent stale state
        return;
      }
    
      const shuffled = [...flashcardSet].sort(() => Math.random() - 0.5);
      setFlashcards(shuffled.slice(0, Math.min(num, flashcardSet.length))); // Ensure valid range
    
      setCurrentIndex(0); // Reset to the first flashcard
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
      // Load user preference for view mode
      const loadSettings = async () => {
        try {
          const savedViewMode = await AsyncStorage.getItem("flashcardViewMode");
          if (savedViewMode) {
            setViewMode(savedViewMode);
          }
        } catch (error) {
          console.error("Error loading flashcard view mode:", error);
        }
      };
      loadSettings();

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

    // Save view mode to AsyncStorage
    const toggleViewMode = async () => {
      const newMode = viewMode === "list" ? "single" : "list";
      setViewMode(newMode);
      await AsyncStorage.setItem("flashcardViewMode", newMode);
      AudioManager.playButtonSound(); // Play sound on toggle
    };
  
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
          <Pressable 
            onPress={() => { 
              AudioManager.playButtonSound();
              navigation.goBack()
            }}
          >
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
            style={[flashStyles.input, darkMode && flashStyles.darkInput]}
            onPress={() => { 
              AudioManager.playButtonSound(); 
              setModalVisible(true)
            }}
          >
            <Text style={[flashStyles.buttonText, darkMode && flashStyles.darkButtonText]}>Select Topic</Text>
          </Pressable>
          <TouchableOpacity 
            style={flashStyles.button} 
            onPress={() => {
              AudioManager.playButtonSound(); 
              handleGenerate()
            }}
            >
            <Text style={[flashStyles.buttonText, darkMode && flashStyles.darkButtonText]}>Generate</Text>
          </TouchableOpacity>
        </View>

        <View style={flashStyles.container}>
         {/* Toggle Button for View Mode */}
          <TouchableOpacity
            style={[flashStyles.toggleButton, darkMode && flashStyles.darkToggleButton]}
            onPress={toggleViewMode}
          >
            <Text style={[flashStyles.buttonText, darkMode && flashStyles.darkButtonText]}>
              Switch to {viewMode === "list" ? "Single Card View" : "List View"}
            </Text>
          </TouchableOpacity>

          {/* List View Mode */}
          {viewMode === "list" ? (
            <FlatList
              contentContainerStyle={flashStyles.listContainer}
              data={flashcards}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => item ? (
                <View style={flashStyles.flashcardContainer}>
                  <Flashcard flashcard={item} />
                </View>
              ) : null}
            />
          ) : (
            // Single Card View Mode
            <View style={flashStyles.singleCardContainer}>
              {flashcards.length > 0 ? (
                <>
                  <Flashcard flashcard={flashcards[currentIndex]} />

                  <View style={flashStyles.navButtons}>
                    <TouchableOpacity
                      style={flashStyles.navButton}
                      onPress={() => {
                        AudioManager.playButtonSound();
                        setCurrentIndex((prevIndex) =>
                          prevIndex > 0 ? prevIndex - 1 : flashcards.length - 1
                        );
                      }}
                    >
                      <FeatherIcon name="arrow-left" size={30} style={[flashStyles.arrows, darkMode && flashStyles.darkArrows]} />
                    </TouchableOpacity>

                    {/* Flashcard Counter (Current Card / Total Cards) */}
                    <Text style={[flashStyles.counterText, darkMode && flashStyles.darkCounterText]}>
                      {flashcards.length > 0 ? `${currentIndex + 1} / ${flashcards.length}` : "0 / 0"}
                    </Text>

                    <TouchableOpacity
                      style={flashStyles.navButton}
                      onPress={() => {
                        AudioManager.playButtonSound();
                        setCurrentIndex((prevIndex) =>
                          (prevIndex + 1) % flashcards.length
                        );
                      }}
                    >
                      <FeatherIcon name="arrow-right" size={30} style={[flashStyles.arrows, darkMode && flashStyles.darkArrows]} />
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <Text style={[flashStyles.emptyText, darkMode && flashStyles.darkEmptyText]}>
                  No flashcards yet.
                </Text>
              )}
            </View>
          )}
        </View>
      
        {/* Flashcard Topic Selection Modal */}
        <Modal visible={modalVisible} transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalView, darkMode && styles.darkModalView]}>
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

                {/* Personal Vocabulary Section */}
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
              <Pressable
                style={[flashStyles.cancelButton, darkMode && flashStyles.darkCancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[flashStyles.buttonText, darkMode && flashStyles.darkButtonText]}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ImageBackground>
      </SafeAreaView>

    );
  };

  const flashStyles = StyleSheet.create({
    container: {
      flex: 1,
    }, 
    listContainer: {
      alignItems: "center", 
      justifyContent: "center",
    },
    singleCardContainer: {
      flex: 1,
      alignItems: "center", 
    },
    flashcardContainer: {
      alignItems: "center", 
      justifyContent: "center",
      marginVertical: 10,
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

    //----------------
    darkToggleButton: {
      borderWidth: 2, 
      borderColor: "rgb(241, 236, 215)", 
      backgroundColor: "darkgreen",
      padding: 10,
      borderRadius: 5,
      alignSelf: "center",
      marginBottom: 15,
    },
    toggleButton: {
      borderWidth: 2, 
      borderColor: "white", 
      backgroundColor: "green",
      padding: 10,
      borderRadius: 5,
      alignSelf: "center",
      marginBottom: 15,
    },
    //-----------------

    //-----------------
    arrows: {
      color: "black"
    },
    darkArrows: {
      color: "rgb(241, 236, 215)"
    },
    //-----------------

    navButtons: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "50%",
      marginTop: 20,
    },
    navButton: {
      padding: 10,
    },

    //----------------
    counterText: {
      fontSize: 20,
      fontWeight: "bold",
      color: "black",
    },
    darkCounterText: {
      fontSize: 20,
      fontWeight: "bold",
      color: "rgb(241, 236, 215)",
    }, 
    //----------------

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
      padding: 9, 
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

    //------------------
    darkSelectedLanguageText: {
      color: "rgb(241, 236, 215)"
    }, 
    selectedLanguageText: {
      color: "white",
    },
    //-----------------
  
    //------------------
    darkCancelButton: {
      marginTop: 20,
      backgroundColor: "darkred",
      padding: 10,
      borderRadius: 5,
    },
    cancelButton: {
      marginTop: 20,
      backgroundColor: "red",
      padding: 10,
      borderRadius: 5,
    },
    //-------------------

    //-------------------
    darkContinueButton: {
      marginTop: 20,
      backgroundColor: "darkgreen",
      padding: 10,
      borderRadius: 5,
    },
    continueButton: {
      marginTop: 20,
      backgroundColor: "green",
      padding: 10,
      borderRadius: 5,
    },
    //--------------------

    //--------------------
    darkContinueButtonText: {
      color: "rgb(241, 236, 215)",
    },
    continueButtonText: {
      color: "white",
    },
    //--------------------
  });
  
export default Flashcards;
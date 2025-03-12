import {
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  View,
  FlatList,
  Pressable,
  Button,
  StyleSheet,
  Animated,
  Easing,
  SafeAreaView,
  Modal,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import styles from "../Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../ThemeContext";
import AudioManager from "../AudioManager";

const randomArrFunction = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const initialTermPairs = {
  "Cat": "Gato",
  "Mouse": "Raton",
  "Hola": "Hello",
  "Adios": "Goodbye",
  "Por Favor": "Please",
  "Gracias": "Thank you",
};
const gameCardsFunction = (terms) => {
  let termList = Object.entries(terms).flat();
  const shuffledTerms = randomArrFunction(termList);

  return shuffledTerms.map((term, index) => ({
    id: index,
    symbol: term,
    isFlipped: false,
  }));
};

const Matching = () => {
  const navigation = useNavigation();

  const [cards, setCards] = useState(gameCardsFunction(initialTermPairs));
  const [selectedCards, setSelectedCards] = useState([]);
  const [matches, setMatches] = useState(0);
  const [winMessage, setWinMessage] = useState(new Animated.Value(0));
  const [gameWon, setGameWon] = useState(false);
  const { darkMode } = useTheme(); // Get Dark Mode from context

  const [modalVisible, setModalVisible] = useState(false); // controls topic selection modal visibility
  const [availableScenarios, setAvailableScenarios] = useState([]); // stores which scenarios vocab is unlocked
  const [availablePersonal, setAvailablePersonal] = useState([]); // stores available personal vocab sets
  const [topic, setTopic] = useState("Airport"); // stores topic of flashcards selected by user

  // useState variables to store
  // stores vocab from scenarios
  const [airportVocabulary, setAirportVocabulary] = useState({});
  const [restaurantVocabulary, setRestaurantVocabulary] = useState({});
  const [hotelVocabulary, setHotelVocabulary] = useState({});
  const [museumVocabulary, setMuseumVocabulary] = useState({});
  const [zooVocabulary, setZooVocabulary] = useState({});
  const [farmerVocabulary, setFarmerVocabulary] = useState({});
  const [hospitalVocabulary, setHospitalVocabulary] = useState({});

  // stores vocab from personal translations
  const [personalVocab, setPersonalVocab] = useState({});

  // returns set of terms based on selected topic
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

  function formatVocab(vocabList) {
    return vocabList.reduce((acc, { learnedText, translation }) => {
      acc[learnedText] = translation;
      return acc;
    }, {});
  }

  // runs when component mounts
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
        setCards(gameCardsFunction(airportvocab)); // if airport vocab available, set by default
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

  const cardClickFunction = (card) => {
    if (!gameWon && selectedCards.length < 2 && !card.isFlipped) {
      const updatedSelectedCards = [...selectedCards, card];
      const updatedCards = cards.map((c) =>
        c.id === card.id ? { ...c, isFlipped: true } : c
      );
      setSelectedCards(updatedSelectedCards);
      setCards(updatedCards);

      if (updatedSelectedCards.length === 2) {
        const [firstCard, secondCard] = updatedSelectedCards;
        const currentTermPairs = handleTopic(topic);
        const isMatch =
          currentTermPairs[firstCard.symbol] === secondCard.symbol ||
          currentTermPairs[secondCard.symbol] === firstCard.symbol;
        if (isMatch) {
          setMatches(matches + 1);
          setSelectedCards([]);
          if (matches + 1 === cards.length / 2) {
            winGameFunction();
            setGameWon(true);
          }
        } else {
          setTimeout(() => {
            const flippedCards = updatedCards.map((c) =>
              updatedSelectedCards.some((s) => s.id === c.id)
                ? { ...c, isFlipped: false }
                : c
            );
            setSelectedCards([]);
            setCards(flippedCards);
          }, 1000);
        }
      }
    } 
  };

  const winGameFunction = () => {
    Animated.timing(winMessage, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    if (matches === cards.length / 2) {
      winGameFunction();
      setGameWon(true);
    }
  }, [matches]);

  const msg = `Matches: ${matches} / ${cards.length / 2}`;

  return (
    <SafeAreaView style={matchingStyles.container}>
      <ImageBackground
        source={
                darkMode
                  ? require("../../../assets/DarkModeBackground.jpg") // Dark mode image
                  : require("../../../assets/homeScreen.png") // Light mode image
              }
        resizeMode="cover"
        style={styles.imgBackground}
      >
        <Pressable onPress={() => { 
                  AudioManager.playButtonSound(); 
                  navigation.goBack()
                }}>
                <Image
                  style={styles.backButtonIcon}
                  source={
                    darkMode
                      ? require("../../../assets/whiteBackArrow.png")
                      : require("../../../assets/backArrow.png")
                  }
                />
        </Pressable>
        <View style={matchingStyles.container}>
          <Text style={[matchingStyles.header1, darkMode && matchingStyles.darkHeader1]}>Memory Pair Game</Text>
          <Text style={[matchingStyles.matchText, darkMode && matchingStyles.darkMatchText]}>{msg}</Text>
          {gameWon ? (
            <View style={[matchingStyles.winMessage, darkMode && matchingStyles.darkWinMessage]}>
              {/* <View style={matchingStyles.winMessageContent}></View> */}
              <Text style={[matchingStyles.winText, darkMode && matchingStyles.darkWinText]}>Congratulations! You Won!</Text>
              <Pressable
                onPress={() => setModalVisible(true)}
                style={[matchingStyles.input, darkMode && matchingStyles.darkInput]}
              >
                <Text style={[matchingStyles.buttonText, darkMode && matchingStyles.darkButtonText]}>Select Topic</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  AudioManager.playButtonSound();
                  setCards(gameCardsFunction(handleTopic(topic)));
                  setSelectedCards([]);
                  setMatches(0);
                  setWinMessage(new Animated.Value(0));
                  setGameWon(false);
                }}
              >
                <Text>Restart</Text>
              </Pressable>
            </View>
          ) : (
            <View style={{ alignItems: "center" }}>
              <Pressable
                onPress={() => setModalVisible(true)}
                style={[matchingStyles.input, darkMode && matchingStyles.darkInput]}
              >
                <Text style={[matchingStyles.buttonText, darkMode && matchingStyles.darkButtonText]}>Select Topic</Text>
              </Pressable>
              <ScrollView style={{ maxHeight: "60vh" }}>
                <View style={matchingStyles.grid}>
                  {cards.map((card) => (
                    <TouchableOpacity
                      key={card.id}
                      style={[matchingStyles.card, darkMode && matchingStyles.darkCard, card.isFlipped && matchingStyles.cardFlipped, darkMode && matchingStyles.darkCardIsFlipped]}
                      onPress={() => cardClickFunction(card)}
                    >
                      {card.isFlipped ? (
                        <Text style={[matchingStyles.cardText, darkMode && matchingStyles.darkCardText]}>
                          {card.symbol}
                        </Text>
                      ) : null}
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
          <Modal visible={modalVisible} transparent={true}>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalView, darkMode && styles.darkModalView]}>
                <Text style={styles.modalTitle}>
                  Select your flashcard topic
                </Text>
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
                <View style={{ flexDirection: "row" }}>
                  <Pressable
                    onPress={() => {
                      setCards(gameCardsFunction(handleTopic(topic)));
                      setMatches(0);
                      setModalVisible(false);
                    }}
                    style={[matchingStyles.continueButton, darkMode && matchingStyles.darkContinueButton]}
                  >
                    <Text style={[matchingStyles.buttonText, darkMode && matchingStyles.darkButtonText]}>Confirm</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setModalVisible(false);
                    }}
                    style={[matchingStyles.cancelButton, darkMode && matchingStyles.darkCancelButton]}
                  >
                    <Text style={[matchingStyles.buttonText, darkMode && matchingStyles.darkButtonText]}>Cancel</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const matchingStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  imgBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  darkHeader1: {
      fontSize: 36,
      marginBottom: 10,
      color: "rgb(241, 236, 215)",
    },
    header1: {
      fontSize: 36,
      marginBottom: 10,
      color: "black",
    },
  darkMatchText: {
      fontSize: 18,
      color: "rgb(241, 236, 215)",
    },
    matchText: {
      fontSize: 18,
      color: 'black',
    },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
   darkCard: {
      width: 90,
      height: 90,
      margin: 10,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'darkgreen',
      borderRadius: 10,
      borderWidth: 2,
      borderColor: 'rgb(241, 236, 215)',
    },
    card: {
      width: 90,
      height: 90,
      margin: 10,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'green',
      borderRadius: 10,
      borderWidth: 2,
      borderColor: 'white',
    },
  darkCardFlipped: {
      backgroundColor: '#d8a208',
    },
    cardFlipped: {
      backgroundColor: '#ffc82c',
    },
    //-----------------

    //-----------------
    darkCardText: {
      fontSize: 15,
      color: 'white',
      fontWeight: 'bold',
    },
    cardText: {
      fontSize: 15,
      color: 'white',
      fontWeight: 'bold',
    },
    //-----------------

    //-----------------
    darkWinMessage: {
      position: 'absolute',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
      margin: 0,
      padding: 0,
    },
    winMessage: {
      position: 'absolute',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
      margin: 0,
      padding: 0,
    },
  darkWinText: {
      fontSize: 36,
      color: 'rgb(241, 236, 215)',
    },
    winText: {
      fontSize: 36,
      color: 'white',
    },
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
  darkButtonText: {
      color: "rgb(241, 236, 215)", 
      fontWeight: "bold" 
    },
    buttonText: { 
      color: "white", 
      fontWeight: "bold" 
    },
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
});

export default Matching;
